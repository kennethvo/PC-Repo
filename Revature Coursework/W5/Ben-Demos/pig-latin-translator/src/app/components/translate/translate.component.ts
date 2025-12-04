import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatorServiceService } from '../../services/translator-service.service';

@Component({
  selector: 'app-translate',
  imports: [FormsModule, CommonModule], 
  //FormsModule for user input with NgModel [(two-way binding!)]
  //CommonModule for directives like ngIf, ngFor
  templateUrl: './translate.component.html',
  styleUrl: './translate.component.css'
})
export class TranslateComponent {

  //Constructor injection again
  constructor(public translatorService:TranslatorServiceService){}

  //Variables to hold the English and the Pig Latin
  englishText:string = ""
  pigLatinText:string = ""

  //Function to do the translation
  translate() {

    //A bit of validation - yell at the user for empty inputs or vulgarity
    if(!this.englishText){
      alert("Please type something before translating!")
      return
    }

    if(this.englishText === "JavaScript"){
      alert("Watch your language!")
      return
    }

    // Split the English text into words, keeping punctuation attached
    const words = this.englishText.split(/\b/);

    // Translate each word to Pig Latin
    const translatedWords = words.map(word => {
      // Check if the word is alphabetic (ignoring punctuation)
      if (/^[a-zA-Z]+$/.test(word)) {
        if (/^[aeiouAEIOU]/.test(word)) {
          return word + 'way'; // Add "way" if it starts with a vowel
        } else {
          const match = word.match(/^([^aeiouAEIOU]+)(.*)$/);
          return match ? match[2] + match[1] + 'ay' : word;
        }
      }
      return word; // Return punctuation or non-alphabetic parts as-is
    });

    // Join the translated words back into a single string
    this.pigLatinText = translatedWords.join('');

    //Increment the counter in the Service
    this.translatorService.translationCounter++

  }

}
