import { HttpRequestService } from '../http-request.service'
import { Component, Input, OnInit, Output ,EventEmitter} from "@angular/core";
import {User} from '../models/user.model'




@Component(
    {
        selector: 'app-table',
        templateUrl: './table.component.html',
        providers: [HttpRequestService],
        styleUrls: ['./table.component.css']
    }
)
export class TableComponent implements OnInit{

   

   
    editableRowId=-1;
    editable=false;
    @Input() users!: User[];
    @Output() refreshEvent = new EventEmitter();
    constructor(private httpRequestService: HttpRequestService) {
    }
    ngOnInit(): void{
    
    }   
    
    changeDisplay(eventobj:{disabled:boolean,id:number})
    {
      
        //makes selected row noneditable/editable
        if(eventobj.disabled==true)
        this.editableRowId=eventobj.id=-1;
        else
        this.editableRowId=eventobj.id;
    }
    
    changeHeader(obj:any){   
        this.editable=obj.editable;
    }
    emitRefreshEventtoParent(){
        this.refreshEvent.emit();

    }




}