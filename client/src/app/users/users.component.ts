import { HttpRequestService } from '../http-request.service'
import { Component, Input, OnInit ,SimpleChanges,OnChanges} from "@angular/core";
import {User} from '../models/user.model'


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users!:User[]
  constructor(private httpRequestService: HttpRequestService) { 
    this.httpRequestService.getUsers().subscribe(response => {
      this.users=response;
  }, error => {
      console.log(error);
  })
    
  }

  ngOnInit(): void {
   
  }
  getUsers() {

    this.httpRequestService.getUsers().subscribe(response => {
        this.users=response;
    }, error => {
        console.log(error);
    })



    
}

}
