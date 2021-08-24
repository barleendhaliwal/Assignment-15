import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './models/user.model'
import { Customer } from './models/customer.model';
import { environment } from '../environments/environment'
import { CookieService } from 'ngx-cookie'
import { ActivatedRoute, Router } from "@angular/router";
type Response = {
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class HttpRequestService {

  userBaseUrl = environment.BASE_URL_USERS;
  customerBaseUrl = environment.BASE_URL_CUSTOMERS;
  
  constructor(private http: HttpClient, private cookieService: CookieService, private router: Router) {

  }
  login(credentials: { email: string, password: string }) {

    return this.http.post(this.userBaseUrl + `/login`, credentials)
  }
  signUp(data: any) {
    data.customerId = +data.customerId
    data.roleId = +data.roleId
    return this.http.post(this.userBaseUrl + `/signup`, data);
  }
  getUsers() {

    const cookieUserId = this.cookieService.get("id")
    if (!cookieUserId) {
      alert(`Login Required !`)
      this.router.navigateByUrl('')
    }
    return this.http.get<User[]>(this.userBaseUrl + '?filter=%7B%0A%20%0A%20%0A%20%20%22fields%22%3A%20%7B%0A%20%20%20%20%22id%22%3A%20true%2C%0A%20%20%20%20%22firstName%22%3A%20true%2C%0A%20%20%20%20%22middleName%22%3A%20true%2C%0A%20%20%20%20%22lastName%22%3A%20true%2C%0A%20%20%20%20%22email%22%3A%20true%2C%0A%20%20%20%20%22phoneNumber%22%3A%20true%2C%0A%20%20%20%20%22address%22%3A%20true%2C%0A%20%20%20%20%22customerId%22%3A%20true%2C%0A%20%20%20%20%22roleId%22%3A%20true%0A%20%20%7D%2C%0A%20%20%22include%22%3A%20%5B%0A%20%20%20%20%7B%0A%20%20%20%20%20%20%22relation%22%3A%20%22customer%22%0A%20%20%20%20%20%20%0A%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%0A%20%20%20%20%7D%0A%20%20%0A%20%20%5D%0A%7D', { headers: { "Authorization": `Bearer ${cookieUserId}` } })



    //can't figure out why below query isnt working
    //return this.http.get<User[]>(this.baseURL+'?filter[include]=customers')

  }
  deleteUser(id: number) {
    const cookieUserId = this.cookieService.get("id")
    if (!cookieUserId) {
      alert(`Login Required !`)
      this.router.navigateByUrl('')
    }
    return this.http.delete(this.userBaseUrl + `/${id}`, { headers: { "Authorization": `Bearer ${cookieUserId}` } })

  }
  getCustomerId(data: User) {
    const cookieUserId = this.cookieService.get("id")
    if (!cookieUserId) {
      alert(`Login Required !`)
      this.router.navigateByUrl('')
    }
    return this.http.get(this.customerBaseUrl + `/?filter[where][name]=${data.customer.name}`, { headers: { "Authorization": `Bearer ${cookieUserId}` } })


  }
  editUser(id: number, data: any) {

    const cookieUserId = this.cookieService.get("id")
    if (!cookieUserId) {
      alert(`Login Required !`)
      this.router.navigateByUrl('')
    }

    const body = {
      firstName: data.firstName,
      middleName: data.middleName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      roleId: +data.roleId,
      address: data.address,
      customerId: data.customerId
    }

    return this.http.patch(this.userBaseUrl + `/${id}`, body, { headers: { "Authorization": `Bearer ${cookieUserId}` } })

  }
  postUser(data: any) {
  
    const cookieUserId = this.cookieService.get("id")
    if(!cookieUserId)
    {
      alert(`Login Required !`)
      this.router.navigateByUrl('')
    }

    const body = {
      firstName: data.firstName,
      middleName: data.middleName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      password:data.password,
      roleId: +data.roleId,
      address: data.address,
      customerId: +data.customerId
    }
    return this.http.post<User>(this.userBaseUrl, body, { headers: { "Authorization": `Bearer ${cookieUserId}` } })    ;
  }

  getCustomers() {
    const cookieUserId = this.cookieService.get("id")
    if(!cookieUserId)
    {
      alert(`Login Required !`)
      this.router.navigateByUrl('')
    }
    return this.http.get<Customer[]>(this.customerBaseUrl, { headers: { "Authorization": `Bearer ${cookieUserId}` } })
  }
  getUsersFromCustomer(id: number) {
    const cookieUserId = this.cookieService.get("id")
    if(!cookieUserId)
    {
      alert(`Login Required !`)
      this.router.navigateByUrl('')
    }
    return this.http.get<User[]>(`${this.customerBaseUrl}/${id}/users`, { headers: { "Authorization": `Bearer ${cookieUserId}` } })

  }
  deleteCustomer(id: number) {
    const cookieUserId = this.cookieService.get("id")
    if(!cookieUserId)
    {
      alert(`Login Required !`)
      this.router.navigateByUrl('')
    }
    return this.http.delete(this.customerBaseUrl + `/${id}`, { headers: { "Authorization": `Bearer ${cookieUserId}` } })

  }
  editCustomer(id: number, data: any) {


    const cookieUserId = this.cookieService.get("id")
    if(!cookieUserId)
    {
      alert(`Login Required !`)
      this.router.navigateByUrl('')
    }
    const body = {
      name: data.name,
      address: data.address,
      website: data.website
    }

    return this.http.patch(this.customerBaseUrl + `/${id}`, body, { headers: { "Authorization": `Bearer ${cookieUserId}` } })

  }
  postCustomer(data: any) {
    const cookieUserId = this.cookieService.get("id")
    if(!cookieUserId)
    {
      alert(`Login Required !`)
      this.router.navigateByUrl('')
    }

    const body = {
      name: data.name,
      website: data.website,
      address: data.address,
    }

    return this.http.post<Customer>(this.customerBaseUrl, body, { headers: { "Authorization": `Bearer ${cookieUserId}` } })    ;
  }

}
