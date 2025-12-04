import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  //Depedency Inject Router to switch URLS
  constructor(private router:Router){}

  //Variables that will hold the username/password
  username:string = ""
  password:string = ""

  //Hardcoded login for now
  login(){
    if(this.username === "user" && this.password === "password"){
      //Switch URLs within Typescript using Router
      this.router.navigateByUrl("/dashboard")
    } else {
      alert("Invalid Username or Password")
    }
  }


  /* Here's what an HTTP POST request might look like - 
  This would live in the UserService? AuthService? Then get subscribed to from here
  
  fakeHttpLogin(username:string, password:string):Observable<any>{
    return this.http.post("URL_TO_YOUR_API", {username, password})
  }
  
  */

  //MAIN DIFFERENCES FROM GET: 
    //-post(), not get()
    //we include a method body (in this case, the login credentials)

  //there's a third param I didn't show - the config object!
    //You can include stuff like headers, content-type, Auth tokens


}
