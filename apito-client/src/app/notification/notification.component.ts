import { Component, OnInit } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';
import { ConfirmBoxComponent } from '../dialog/confirm-box/confirm-box.component';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  form: FormGroup;
  minDate = new Date()
  dataSource: any
  displayedColumns: string[] = [
    'name', 
    'eventDate', 
    'category',
    'desc',
    'options'
  ];
  mode: any;
  user: any;
  idForEdit:any;
  categoryType = [
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

  private confirmBoxComponent = ConfirmBoxComponent;

  constructor(public dialog: MatDialog, private authService: AuthService,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.authService.getLoggedInUser().subscribe((res:any)=> {
      console.log(res);
      this.user = res.data;
      this.getReminders();
    });
    this.form = new FormGroup({
      name: new FormControl('', { validators: [Validators.required] }),
      eventDate: new FormControl('', { validators: [Validators.required, Validators.minLength(1)] }),
      category: new FormControl('', { validators: [Validators.required] }),
      desc: new FormControl('', { validators: [Validators.required, Validators.minLength(1)] }),
    });
  }

  getReminders(){
    this.notificationService.getReminder(this.user._id).subscribe((res:any)=> {
      console.log(res);
      this.dataSource = new MatTableDataSource(res.data);
    });
  }

  openDialog(templateRef, mode, data) {
  //   this.dialog.open(templateRef, {
  //    width: '50%'
  //  });
  this.mode = mode;
    if(mode === 'edit') {
      this.editRecord(data);
    }
    this.dialog.open(templateRef, {
      width: '50%'
    });
  }

  handleDate() {
    let ele = document.getElementById('eventDate');
    let dt = new Date().toLocaleDateString('en-CA');;
    ele.setAttribute("type", "date");
    ele.setAttribute("min", dt)
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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

  editRecord(ele){
    console.log(ele);
    this.form.patchValue({
      name: ele.name,
      category: ele.category,
      eventDate: this.formatDate(new Date(ele.eventDate)),
      desc: ele.desc
    });
    this.idForEdit = ele._id;
  }

  actionRelated() {
    if (this.form.invalid) {
      alert("All fields are mandatory.");
      return;
    }
    this.form.value.user_id = this.user._id
    if(this.mode === 'add') {
      this.notificationService.addReminder(this.form.value);
    } else {//edit mode
      this.form.value.reminder = {
        id: this.idForEdit
      }
      this.notificationService.updateReminder(this.form.value);
    }
  }

  deleteRecord(record){
    record.from = 'person';
    this.dialog.open(this.confirmBoxComponent, {
      data: record
    });
  }
}
