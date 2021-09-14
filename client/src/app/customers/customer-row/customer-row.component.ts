import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Customer } from '../../models/customer.model'
import { HttpRequestService } from '../../http-request.service'
import { User } from 'src/app/models/user.model';
@Component({
  selector: 'app-customer-row',
  templateUrl: './customer-row.component.html',
  styleUrls: ['./customer-row.component.css']
})
export class CustomerRowComponent implements OnInit {

  @Input() customer!: Customer;
  @Input() customerNumber!: number; //same as rowNumber
  users: User[]=[];
  empty = true;
  editable = false;
  panelOpenState: boolean = false;
  @Output() refreshEvent = new EventEmitter<string>();

  togglePanel() {
    
    this.panelOpenState = !this.panelOpenState 

  }


  constructor(private httpRequestService: HttpRequestService) { }

  ngOnInit(): void {

   
    this.showUsers()
  }
  showUsers() {
    this.httpRequestService.getUsersFromCustomer(this.customer.id).subscribe(response => {

      const usersAssociatedWithCustomer = response;

      if (usersAssociatedWithCustomer.length !== 0) {
        this.empty = false
      }
      usersAssociatedWithCustomer.forEach((item) => {
        this.users.push({
          id: item.id,
          firstName: item.firstName,
          middleName: item.middleName,
          lastName: item.lastName,
          email: item.email,
          phoneNumber: item.phoneNumber,
          roleId: item.roleId,
          address: item.address,
          customer: { name: this.customer.name }

        })
       
      });
    })
  }
  editCustomer() {

    this.editable = true;
   

  }
  cancelCustomer() {
    this.editable = false;

  }
  deleteCustomer() {
    const id = (<HTMLTableElement>document.getElementById('row' + this.customerNumber + 'id')).innerHTML;

    this.httpRequestService.deleteCustomer(+id).subscribe(response => {
      alert(`Deleted customer with id = ${this.customer.id} Successfully !`)
      this.refreshEvent.emit();

    }, error => {
      alert(error)
    })
  }
  saveCustomer() {
    
    const id = (<HTMLTableElement>document.getElementById('row' + this.customerNumber + 'id')).innerText;
    const name = (<HTMLTableElement>document.getElementById('row' + this.customerNumber + 'name')).innerText;
    const website = (<HTMLTableElement>document.getElementById('row' + this.customerNumber + 'website')).innerText;
    const address = (<HTMLTableElement>document.getElementById('row' + this.customerNumber + 'address')).innerText;
    const body = { name: name, website: website, address: address }
    this.httpRequestService.editCustomer(+id, body).subscribe(response => {
      alert("Edited Customer Successfully!")
      this.refreshEvent.emit();


    }, error => {
      alert(error)
    })
    this.editable=false
  }



}
