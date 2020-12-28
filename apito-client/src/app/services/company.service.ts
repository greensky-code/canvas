import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  companyUrl = environment.api + "company/"
  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) { }

  
addCompany(form){
  const data = form
  console.log(data);
  data.user_id = 
  this.http.post(`${this.companyUrl}addCompany`, data).subscribe(res => {
    this.toastr.success("Company added Succesfully")
    //this.router.navigate(["/person"])
  })
}

getCompany(id) {
  return this.http.get(`${this.companyUrl}getCompany/${id}`)
}

getCompanies() {
  return this.http.get(`${this.companyUrl}getCompanies`)
}

updateCompany(form) {
  const data = form
  console.log(data);
  this.http.put(`${this.companyUrl}updateCompany`, data).subscribe(res => {
    this.toastr.success("Company Details Updated Succesfully")
    this.router.navigate(["/company"])
  })
}

deleteCompany(id) {
  this.http.delete(`${this.companyUrl}deleteCompany/${id}`).subscribe(res => {
    this.toastr.success("Deleted Succesfully")
    this.router.navigate(["/company"])
    setTimeout(()=>{
      window.location.reload();
    },1000)
  });
}


}
