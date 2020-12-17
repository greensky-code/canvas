import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { timestamp } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent implements OnInit {

  isModalVisible: Boolean = false;
  isAuth
  form: FormGroup;
  user;
  lang;
  persons;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.isAuth = this.authService.getAuth();

    this.authService.getLoggedInUser().subscribe((res:any)=> {
      console.log(res);
      this.user = res.data;
      this.getPersons();
    })
    
    this.form = new FormGroup({
      email: new FormControl('', { validators: [Validators.required, Validators.minLength(3)] }),
      name: new FormControl('', { validators: [Validators.required, Validators.minLength(3)] }),
      birthday: new FormControl('', { validators: [Validators.required, Validators.minLength(1)] }),
      address: new FormControl('', { validators: [Validators.required, Validators.minLength(5)] }),
      phone: new FormControl('', { validators: [Validators.required, Validators.minLength(10)] })
    });

    
  }

  toggleModal(){
    this.isModalVisible = !this.isModalVisible;
  }

  getPersons(){
    this.authService.getPerson(this.user._id).subscribe((res:any)=> {
      console.log(res);
      this.persons = res.data;
    });
  }

  addPerson() {
    if (this.form.invalid) {
      return;
    }
    this.form.value.user_id = this.user._id
    this.authService.addPerson(this.form.value)
  }

}
