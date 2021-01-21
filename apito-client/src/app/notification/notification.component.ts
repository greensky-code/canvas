import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  form: FormGroup;
  minDate = new Date()
  canvasCat = [
    {
      viewValue: 'Birthday',
      value: 'Birthday'
    },
    {
      viewValue: 'Anniversary',
      value: 'Anniversary'
    },
    {
      viewValue: 'Other',
      value: 'Other'
    }
  ]
  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', { validators: [Validators.required, Validators.email] }),
      eventDate: new FormControl('', { validators: [Validators.required, Validators.minLength(1)] }),
      category: new FormControl('', { validators: [Validators.required] }),
      desc: new FormControl('', { validators: [Validators.required, Validators.minLength(1)] }),
    });
  }

  openDialog(templateRef) {
    let dialogRef = this.dialog.open(templateRef, {
     width: '50%'
   });
  }

  handleDate() {
    let ele = document.getElementById('eventDate');
    let dt = new Date().toLocaleDateString('en-CA');;
    ele.setAttribute("type", "date");
    ele.setAttribute("min", dt)
  }

}
