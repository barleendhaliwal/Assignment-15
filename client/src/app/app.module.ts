import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { TableComponent } from './table/table.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { RowComponent } from './table/row/row.component';

import { HomeComponent } from './home/home.component';
import { AddComponent } from './add/add.component';
import { CustomersComponent } from './customers/customers.component';
import { CustomerRowComponent } from './customers/customer-row/customer-row.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import {MatCardModule} from '@angular/material/card'
import {MatTableModule} from '@angular/material/table'
import {MatExpansionModule} from '@angular/material/expansion';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { UsersComponent } from './users/users.component';
import { LoginComponent } from './login/login.component';
import { HttpRequestService } from './http-request.service';
import { CookieModule } from 'ngx-cookie';
import { RegisterComponent } from './register/register.component';

import {AuthGuard} from './auth.guard'

const appRoutes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home', component: HomeComponent,canActivate: [AuthGuard]  },
  { path: 'showUsers', component: UsersComponent,canActivate: [AuthGuard]  },
  { path: 'addUser', component: AddComponent,canActivate: [AuthGuard]  },
  { path: 'customers', component:CustomersComponent,canActivate: [AuthGuard] },
  { path: 'addCustomer', component:AddCustomerComponent,canActivate: [AuthGuard] },
  //otherwise redirect to login
  { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    RowComponent,
    HomeComponent,
    AddComponent,
    CustomersComponent,
    CustomerRowComponent,
    AddCustomerComponent,
    UsersComponent,
    LoginComponent,
    RegisterComponent,
   
   

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
     RouterModule.forRoot(appRoutes),
     BrowserAnimationsModule,
     MatCardModule,
     MatTableModule,
     MatExpansionModule,
     CookieModule.forRoot()
 
  ],
  providers: [HttpRequestService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
