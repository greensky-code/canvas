import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CanvasService {
  canvasUrl = environment.api + "canvas/"
  constructor(private http: HttpClient, private router: Router, private toastr: ToastrService) { }
  createCanvas(form) {
    return this.http.post(this.canvasUrl, form)
  }
  getUserCanvas() {
    return this.http.get(this.canvasUrl)
  }
  updateCanvas(id, data) {
    return this.http.put(`${this.canvasUrl}${id}`, data)
  }
  getCanvasById(id) {
    return this.http.get(`${this.canvasUrl}${id}`)
  }
  getAllLayers(id) {
    console.log("Hello");
    
    return this.http.get(`${this.canvasUrl}layer/${id}`)
  }
  getAllShapes(id) {
    console.log("Hello");
    
    return this.http.get(`${this.canvasUrl}shape/${id}`)
  }
  addUser(form) {
    return this.http.post(`${this.canvasUrl}add`, form)
  }
  deleteCanvas(id){
    this.http.delete(`${this.canvasUrl}deleteCanvas/${id}`).subscribe(res => {
      this.toastr.success("Deleted Succesfully")
      setTimeout(()=>{
        window.location.reload();
      },1000)
    });
  }
}
