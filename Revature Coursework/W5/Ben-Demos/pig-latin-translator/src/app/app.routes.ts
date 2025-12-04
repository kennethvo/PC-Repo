import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TranslateComponent } from './components/translate/translate.component';

/*This is the ONLY place we define our routes.
Remember, routing is how we dynamically move components in and out of the view!*/
export const routes: Routes = [
    {
        path:"", //empty url for path... dashboard shows up on intitial app render
        component: DashboardComponent
    },
    {
        path:"translate",
        component: TranslateComponent
    }
];
