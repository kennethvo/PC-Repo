import { Component, signal, WritableSignal } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { Pokemon } from '../../interfaces/pokemon';
import { CommonModule, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-catch',
  imports: [TitleCasePipe, CommonModule],
  templateUrl: './catch.component.html',
  styleUrl: './catch.component.css'
})
export class CatchComponent {

  //Constructor Inject the Service
  constructor(private pokemonService:PokemonService){} 

  //Variable to hold the pokemon from PokeAPI
  pokemon: WritableSignal<Pokemon> = signal({id:0, name:"", sprite:""});

  //ngOnInit - a component lifecycle method that lets us define logic to fire when the component renders
  ngOnInit(){
    this.getPokemon()
  }

  //The method that gets a Pokemon with the Service
  getPokemon(){

    //When we get an Observable returned, we need to SUBSCRIBE to it to access its data (The HTTP Response)
    this.pokemonService.getPokemon().subscribe(data => {
      console.log(data)

      //populate pokemon with the data in the response
      this.pokemon.set(data)
    })

  }

  //The method that catches a Pokemon and stores it in the Service
  catchPokemon(){
    this.pokemonService.caughtPokemon.push(this.pokemon())
    alert("Caught " + this.pokemon().name)
    this.pokemon.set({id:0, name:"", sprite:""})
  }

}