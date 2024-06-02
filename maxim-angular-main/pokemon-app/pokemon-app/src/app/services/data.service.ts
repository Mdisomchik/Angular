import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  getPokemons(limit: number, offset: number): Observable<any> {
    return this.http.get(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`).pipe(
      catchError(error => {
        console.error('Error fetching pokemons:', error);
        return throwError(error);
      })
    );
  }

  getMoreInfo(name: string): Observable<any> {
    return this.http.get(`https://pokeapi.co/api/v2/pokemon/${name}`).pipe(
      catchError(error => {
        console.error('Error fetching more info for pokemon:', error);
        return throwError(error);
      })
    );
  }

  getPokemonByName(pokemonName: string): Observable<any> {
    return this.http.get(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`).pipe(
      catchError(error => {
        console.error('Error fetching pokemon by name:', error);
        return throwError(error);
      })
    );
  }
}
