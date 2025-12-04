import { Component } from '@angular/core';
import { TranslatorServiceService } from '../../services/translator-service.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  //Constructor Injection - This component needs the Translate Service to access the translate count
  constructor(public translatorService:TranslatorServiceService){}

}
