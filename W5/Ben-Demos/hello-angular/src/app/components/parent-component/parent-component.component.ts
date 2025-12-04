import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChildComponentComponent } from '../child-component/child-component.component';


@Component({
  selector: 'app-parent-component',
  imports: [CommonModule, FormsModule, ChildComponentComponent], 
  //CommonModule for directives like *ngFor and *ngIf
  //FormsModule lets us take user input with Two Way Binding [(ngModel)]
  templateUrl: './parent-component.component.html',
  styleUrl: './parent-component.component.css'
})
export class ParentComponentComponent {

  //The .ts file of an Angular Component defined the data/behaviors of the component
  
  //Defining an Array that we'll use to render multiple Child Components
  arr:number[] = [1, 2, 3, 4, 5, 6]

  //This function will be called via event binding in the HTML
  showSurprise(){
    alert("SURPRISE!!!!")
    this.hideElement = !this.hideElement
  }

  //This variable will show or hide the h1 in our HTML
  hideElement:boolean = true

  //This variable will hold the user's inputted name
  nameInput:string = ""

}