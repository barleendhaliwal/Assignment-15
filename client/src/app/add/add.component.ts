import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpRequestService } from '../http-request.service';
import Role from '../enum'
@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  eRole = Role

  constructor(private fb: FormBuilder, private httpService: HttpRequestService) {
  
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

    this.httpService.postUser(this.addUserForm.value).subscribe(response => {
      console.log(response)
      alert(`\nNew User with id = ${response.id} Successfully ! See Show Users to see Changes !`)
    }, error => {
      console.log(error)
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
