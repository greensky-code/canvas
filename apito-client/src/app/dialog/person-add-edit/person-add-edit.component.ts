import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { PersonService } from 'src/app/services/person.service';

@Component({
  selector: 'app-person-add-edit',
  templateUrl: './person-add-edit.component.html',
  styleUrls: ['./person-add-edit.component.css']
})
export class PersonAddEditComponent implements OnInit {
  type = 'add';
  isAuth;
  user;
  form: FormGroup;
  personTypes = [
    {
      viewValue: 'Business Partner',
      value: 'business_partner'
    },
    {
      viewValue: 'Friends',
      value: 'friends'
    },
    {
      viewValue: 'Family',
      value: 'family'
    }
  ]
  constructor(
    private authService: AuthService,
    private personService: PersonService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PersonAddEditComponent>) { }

  ngOnInit(): void {
    this.isAuth = this.authService.getAuth();

    this.authService.getLoggedInUser().subscribe((res:any)=> {
      console.log(res);
      this.user = res.data;
    });
    this.form = new FormGroup({
      email: new FormControl('', { validators: [Validators.required, Validators.minLength(3)] }),
      name: new FormControl('', { validators: [Validators.required, Validators.minLength(1)] }),
      type: new FormControl('', { validators: [Validators.required] }),
      birthday: new FormControl('', { validators: [Validators.required, Validators.minLength(1)] }),
      address: new FormControl('', { validators: [Validators.required, Validators.minLength(1)] }),
      phone: new FormControl('', { validators: [Validators.required, Validators.minLength(10)] })
    });
    this.fetchRecord();
  }

  // ngAfterViewInit() {
  //   setTimeout(() => {
  //     this.fetchRecord();
  //   }, 200);
  // }

  fetchRecord() {
    if(this.data.mode == 'edit'){
      this.form.patchValue({
        email: this.data.email,
        name: this.data.name,
        type: this.data.type,
        birthday: this.formatDate(new Date(this.data.birthday)),
        address: this.data.address,
        phone: this.data.phone
      });
    } else {
      console.log('Add mode.');
    }
    this.type = this.data.type;
    console.log('dataPass', this.data);
  }

  actionRelated() {
    if (this.data.mode == 'add') {
      //add mode
      if (this.form.invalid) {
        alert("All fields are mandatory.")
        return;
      }
      this.form.value.user_id = this.user._id
      this.personService.addPerson(this.form.value);
      setTimeout(()=>{
        window.location.reload();
      }, 1000)
    } else {
      //edit mode 
      if (this.form.invalid) {
        return;
      }
      this.form.value.person = {
        id: this.data._id
      }
      this.personService.updatePerson(this.form.value);
      setTimeout(()=>{
        window.location.reload();
      }, 1000)
    }
  }

  formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }

  handleDate() {
    let ele = document.getElementById('birthday');
    let dt = new Date().toLocaleDateString('en-CA');;
    ele.setAttribute("type", "date");
    ele.setAttribute("max", dt)
  }
}
