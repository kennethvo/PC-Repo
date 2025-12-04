import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TranslatorServiceService {

  /* Services are great for holding variables/functions that we want multiple components to access! They're also nice for uglier logic - we could have hidden our translate function() in here, and I'd feel less bad about making 500 lines. */

  constructor() {
    console.log('TranslatorServiceService instantiated');
   }

  public translationCounter:number = 0

}
