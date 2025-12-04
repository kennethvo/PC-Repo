import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Pokemon } from '../interfaces/pokemon';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  //An Array that holds our caught Pokemon
  caughtPokemon:Pokemon[] = []

  //Inject HttpClient so we can make HTTP requests
  constructor(private http:HttpClient) {}

  //method to get one random pokemon
  getPokemon():Observable<Pokemon>{

    //Get a random number so we can call for a random pokemon
    const randomNum:number = Math.floor(Math.random() * 1025) + 1;

    /* send an HTTP GET requests to pokeAPI, and convert it into a Pokemon object 
    We'll use the pipe() method to transform the incoming data into a Pokemon object
    We'll use the map() method to take the data and fit it into our Pokemon's fields*/
    return this.http.get<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${randomNum}`).pipe(
      map<any, Pokemon>(data => ({
        id:data.id,
        name:data.name,
        sprite:data.sprites.front_default
      }))
    )

    //map<IncomingDataType, OurDataType>

  }

}
