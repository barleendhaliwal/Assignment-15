import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpRequestService } from '../http-request.service';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.css']
})
export class AddCustomerComponent implements OnInit {

  constructor(private fb: FormBuilder,private httpRequestService:HttpRequestService) { }

  ngOnInit(): void {
  }
  addCustomerForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    address: ['',[Validators.required, Validators.minLength(10)]],
    website: ['', Validators.required]
  })
    onSubmit() {
  
    this.httpRequestService.postCustomer(this.addCustomerForm.value).subscribe(response => {
      alert(`\nNew User with id =${response.id} Successfully ! See Show Customers to see Changes !`)
    }, error => {

      alert(error)

    })
  }

}
