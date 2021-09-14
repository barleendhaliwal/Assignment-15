
import { Component, OnInit } from '@angular/core';
import { HttpRequestService } from '../http-request.service'
import {Customer} from '../models/customer.model'


@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css'],
 
})
export class CustomersComponent implements OnInit {

  customers!:Customer[]
  constructor(private httpRequestService:HttpRequestService) { }

  ngOnInit(): void {
    this.getCustomers()
  }
  
  getCustomers(){
   
    this.httpRequestService.getCustomers().subscribe(response=>{
      this.customers=response
    })
  }

}
