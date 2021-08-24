import { Component, Input, OnInit, EventEmitter, Output,ViewChild, ElementRef } from '@angular/core';
import { HttpRequestService } from '../../http-request.service';
import {User} from '../../models/user.model'
import Role from '../../enum'
// enum Role{SUPERADMIN=1,ADMIN,SUBSCRIBER};
@Component({
  selector: 'tr[app-row]',
  templateUrl: './row.component.html',
  styleUrls: ['./row.component.css']
})
export class RowComponent implements OnInit {

  eRole=Role;
  editSelectedRole!:number
  @Input() rowNumber = -1;
  @Input() user!: User;
  editable: boolean = false;
  @Output() mode = new EventEmitter<{ editable: boolean }>();
  @Output() refreshEvent = new EventEmitter();
   
 
  constructor(private httpService: HttpRequestService) { 
    
  }

  ngOnInit(): void {
    this.mode.subscribe(modeObject => {
    
      if (modeObject.editable) {
        this.editable = true;
      }
      else {
        this.editable = false;
      }
    });
  }



  deleteRow() {
    this.httpService.deleteUser(this.user.id).subscribe(response => {
      alert(`Deleted user with id = ${this.user.id} Successfully !`)
      this.refreshEvent.emit();

    }, error => {
      alert(error)
    })
  }

  editRow() {
    this.editSelectedRole=this.user.roleId
    this.mode.emit({ editable: true })
  }
  cancelRow(){
    
    this.mode.emit({ editable: false })
  }
  saveRow(){
    
    const id =(<HTMLTableElement>document.getElementById(`row${this.rowNumber}Id`)).innerHTML;
    const firstName =(<HTMLTableElement>document.getElementById(`row${this.rowNumber}FirstName`)).innerHTML;
    const middleName =(<HTMLTableElement>document.getElementById(`row${this.rowNumber}MiddleName`)).innerHTML;
    const lastName =(<HTMLTableElement>document.getElementById(`row${this.rowNumber}LastName`)).innerHTML;
    const email =(<HTMLTableElement>document.getElementById(`row${this.rowNumber}Email`)).innerHTML;
    const phoneNumber =(<HTMLTableElement>document.getElementById(`row${this.rowNumber}PhoneNumber`)).innerHTML;
    const roleId =this.editSelectedRole;
    const address =(<HTMLTableElement>document.getElementById(`row${this.rowNumber}Address`)).innerHTML;
    const customerName =(<HTMLTableElement>document.getElementById(`row${this.rowNumber}CustomerName`)).innerHTML;
    
    const updatedData:User={id:+id,firstName:firstName,middleName:middleName, lastName:lastName, email:email, phoneNumber:phoneNumber, roleId:roleId,address:address,customer:{name:customerName}}
    this.httpService.getCustomerId(updatedData).subscribe((response:any)=>{
     
      if(response.length===0)
      {
        alert("Invalid Customer Name");
        return;
      }
     
      const customer=response[0]
      const editData:any={id:+id,firstName:firstName,middleName:middleName, lastName:lastName, email:email, phoneNumber:phoneNumber, roleId:roleId,address:address,customerId:customer.id}
      this.httpService.editUser(this.user.id,editData).subscribe(response=>{
        console.log(response)
         alert(`\nEdited User with id = ${id} Successfully!`)
         this.refreshEvent.emit();
      }, error => {
      
        alert(error)
        
      })
    })

    
    this.mode.emit({ editable: false})
    
  }

}
