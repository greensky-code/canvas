import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authUrl = environment.api + "auth/"
  isAuthenticated = false;
  private token: string;
  private authStatusListener = new Subject<boolean>();
  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) { }
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }
  getToken() {
    return this.token;
  }
  getAuth() {
    return this.isAuthenticated;
  }
  signUp(form) {
    form["role"] = "user"
    const data = form
    console.log(data);
    this.http.post(`${this.authUrl}register`, data).subscribe(res => {
      this.toastr.success("User Created Succesfully")
      this.router.navigate(["/login"])
    })
  }
  updateProfile(form) {
    const data = form
    console.log(data);
    this.http.put(`${this.authUrl}update`, data).subscribe(res => {
      this.toastr.success("User Updated Succesfully")
      this.router.navigate(["/profile"])
    })
  }
  login(form, url) {
    console.log(url);
    
    this.http.post(`${this.authUrl}login`, form).subscribe((res: any) => {
      const token = res.token;
      this.token = token;
      if (token) {
        this.isAuthenticated = true;
        this.authStatusListener.next(true);
        this.saveAuthData(token);
        this.router.navigateByUrl(url);
      }
    })
  }
  private saveAuthData(token: string) {
    localStorage.setItem('token', token);
  }
  clearAuthData() {
    this.token = null
    this.isAuthenticated = false
    localStorage.removeItem('token');
    window.location.reload()
  }
  private getAuthData() {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }
    return {
      Token: token
    };
  }
  autoAutUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    this.token = authInformation.Token;
    this.isAuthenticated = true
  }
  getLoggedInUser(){
    return this.http.get(`${this.authUrl}user`)
  }

  addPerson(form){
    const data = form
    console.log(data);
    data.user_id = 
    this.http.post(`${this.authUrl}addPerson`, data).subscribe(res => {
      this.toastr.success("Person added Succesfully")
      //this.router.navigate(["/person"])
    })
  }

  getPerson(id) {
    return this.http.get(`${this.authUrl}getPerson/${id}`)
  }

  updatePerson(form) {
    const data = form
    console.log(data);
    this.http.put(`${this.authUrl}updatePerson`, data).subscribe(res => {
      this.toastr.success("Person Details Updated Succesfully")
      this.router.navigate(["/person"])
    })
  }

  updatePassword(form) {
    const data = form
    console.log(data);
    this.http.put(`${this.authUrl}password`, data).subscribe(res => {
      this.toastr.success("Password updated Succesfully")
      this.router.navigate(["/profile"])
    })
  }
}
