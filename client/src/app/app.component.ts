import { Component } from '@angular/core';
import {CookieService} from 'ngx-cookie'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'assignment12-13';
 
  constructor(private cookieService:CookieService){

  }
  checkLogin()
  {
    const id=this.cookieService.get("id")
    if(!id)
    return false;
    else
    return true;
  }
  logOut()
  {
    this.cookieService.remove("id")
  }
 
}
