import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  reminderUrl = environment.api + "reminder/";
  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) { }

  addReminder(form){
    const data = form
    console.log(data);
    this.http.post(`${this.reminderUrl}addReminder`, data).subscribe(res => {
      console.log(res);
      this.toastr.success("Reminder added Succesfully")
      setTimeout(()=>{
        window.location.reload();
      }, 1000)
    })
  }

  getReminder(id) {
    return this.http.get(`${this.reminderUrl}getReminder/${id}`)
  }

  updateReminder(form) {
    const data = form
    console.log(data);
    this.http.put(`${this.reminderUrl}updateReminder`, data).subscribe(res => {
      this.toastr.success("Reminder Details Updated Succesfully")
      this.router.navigate(["/notification"]);
      setTimeout(()=>{
        window.location.reload();
      }, 1000)
    })
  }

  deleteReminder(id) {
    this.http.delete(`${this.reminderUrl}deleteReminder/${id}`).subscribe(res => {
      this.toastr.success("Deleted Succesfully")
      this.router.navigate(["/notification"])
      setTimeout(()=>{
        window.location.reload();
      },1000)
    });
  }
}
