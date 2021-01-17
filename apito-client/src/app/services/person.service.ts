import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class PersonService {
  personUrl = environment.api + "person/"
  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) { }
  
  addPerson(form){
    const data = form
    console.log(data);
    this.http.post(`${this.personUrl}addPerson`, data).subscribe(res => {
      console.log(res);
      this.toastr.success("Person added Succesfully")
      setTimeout(()=>{
        window.location.reload();
      }, 1000)
    })
  }

  getPerson(id) {
    return this.http.get(`${this.personUrl}getPerson/${id}`)
  }

  updatePerson(form) {
    const data = form
    console.log(data);
    this.http.put(`${this.personUrl}updatePerson`, data).subscribe(res => {
      this.toastr.success("Person Details Updated Succesfully")
      this.router.navigate(["/person"]);
      setTimeout(()=>{
        window.location.reload();
      }, 1000)
    })
  }

  deletePerson(id) {
    this.http.delete(`${this.personUrl}deletePerson/${id}`).subscribe(res => {
      this.toastr.success("Deleted Succesfully")
      this.router.navigate(["/person"])
      setTimeout(()=>{
        window.location.reload();
      },1000)
    });
  }
}
