import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { DataService } from "../services/data.service";

@Component({
  selector: 'app-pokemons',
  templateUrl: './pokemons.component.html',
  styleUrls: ['./pokemons.component.css']
})
export class PokemonsComponent implements OnInit {
  pokemons: any[] = [];
  totalPokemons: number | undefined;
  currentPage = 1;
  itemsPerPage = 9;
  searchQuery: string = '';
  filteredPokemons: any[] = [];
  selectedType: string = '';
  modalActive: boolean = false;
  selectedPokemon: any;
  elRef: ElementRef;
  noPokemonFound: boolean = false; 

  constructor(private dataService: DataService, private elementRef: ElementRef) {
    this.elRef = elementRef;
  }

  ngOnInit(): void {
    this.getPokemons();
  }
  
  getPokemons(): void {
    this.dataService.getPokemons(this.itemsPerPage, (this.currentPage - 1) * this.itemsPerPage)
      .subscribe((response: any) => { 
        this.totalPokemons = response.count;
        this.pokemons = [];
        response.results.forEach((result: { name: string; }) => {
          this.dataService.getMoreInfo(result.name)
            .subscribe((uniqResponse: any) => {
              this.pokemons.push(uniqResponse);
              this.filterPokemons(); 
            });
        });
      });
  }
  searchPokemon(): void {
    if (this.searchQuery.trim() !== '') {
      this.dataService.getPokemonByName(this.searchQuery.toLowerCase()).subscribe(
        (pokemon: any) => {
          this.filteredPokemons = [pokemon];
          this.noPokemonFound = this.filteredPokemons.length === 0;
        },
        (error: any) => {
          console.error('Error fetching pokemon by name:', error);
          this.noPokemonFound = true; 
        }
      );
    }
  }

  filterPokemons(): void {
    if (this.selectedType) {
      this.filteredPokemons = this.pokemons.filter(pokemon =>
        pokemon.types.some((pokeType: any) => pokeType.type.name === this.selectedType)
      );
    } else {
      this.filteredPokemons = [...this.pokemons];
    }
  }

  onTypeSelect(type: string): void {
    this.selectedType = type;
    this.filterPokemons();
  }

  nextPage(): void {
    if (this.currentPage < this.calculateTotalPages()) {
      this.currentPage++;
      this.getPokemons(); 
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getPokemons(); 
    }
  }

  calculateTotalPages(): number {
    return Math.ceil((this.totalPokemons || 0) / this.itemsPerPage);
  }

  openModal(pokemon: any): void {
    this.selectedPokemon = pokemon;
    this.modalActive = true;
  }

  closeModal(): void {
    this.modalActive = false;
  }

  stopPropagation(event: MouseEvent): void {
    event.stopPropagation();
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event): void {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.closeModal();
    }
  }
}
