import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { HttpRequestService } from '../http-request.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  credentials = {
    email:"",
    password:""
  }
  constructor(private cookieService:CookieService, private httpRequestService:HttpRequestService,private router: Router) { }

  ngOnInit(): void {
  }
  onSubmit(){
    this.httpRequestService.login(this.credentials).subscribe((response:any)=>{
      
    
      this.cookieService.put("id",response.token)
      this.router.navigateByUrl('/home')
     
    }, err=>{
      alert(`Invalid Credentials`)
      console.log(err)
    })
  }

}
