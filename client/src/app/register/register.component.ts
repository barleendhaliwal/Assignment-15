import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import Role from '../enum';
import { HttpRequestService } from '../http-request.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  eRole = Role

  constructor(private fb: FormBuilder, private httpService: HttpRequestService,private router:Router) {
  
  }

  ngOnInit(): void {
  }
  addUserForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(3)]],
    middleName: [''],
    lastName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required]],
    password:['',[Validators.required, Validators.minLength(8)]],
    phoneNumber: ['', [Validators.required, Validators.pattern("[0-9]{10}")]],
    roleId: ['', [Validators.required]],
    address: ['', [Validators.required]],
    customerId: ['', [Validators.required]]
  })
  onSubmit() {
    
    this.httpService.signUp(this.addUserForm.value).subscribe((response:any) => {
      console.log(response)
      alert(`\nNew User with id = ${response.id} Successfully ! Log in to see Changes !`)
      this.router.navigateByUrl('/login');
    }, error => {

      alert(error)

    })
  }
  display(item: any) {
    if (Number.isInteger(item.value))
      return true;
    else
      return false;
  }
}


