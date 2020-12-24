import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { timestamp } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { PersonAddEditComponent } from '../dialog/person-add-edit/person-add-edit.component';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmBoxComponent } from '../dialog/confirm-box/confirm-box.component';


@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent implements OnInit {
  displayedColumns: string[] = [
    'name', 
    'email', 
    'type',
    'phone', 
    'birthday',
    'address',
    'options'
  ];
  dataSource: any;
  isAuth
  form: FormGroup;
  user;
  lang;
  persons;
  personTypeTxt = {
    'business_partner': 'Business Partner',
    'friends':'Friends',
    'family': 'Family'
  }

  private personAddEditComponent = PersonAddEditComponent;
  private confirmBoxComponent = ConfirmBoxComponent

  constructor(
    private authService: AuthService,
    public dialog: MatDialog
    ) { }

  ngOnInit(): void {
    this.isAuth = this.authService.getAuth();

    this.authService.getLoggedInUser().subscribe((res:any)=> {
      console.log(res);
      this.user = res.data;
      this.getPersons();
    })
    
  }

  getPersons(){
    this.authService.getPerson(this.user._id).subscribe((res:any)=> {
      console.log(res);
      this.dataSource = new MatTableDataSource(res.data);
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addPerson() {
    this.dialog.open(this.personAddEditComponent, {
      data: {
        mode: 'add'
      }
    });
  }

  editRecord(record) {
    record.mode = 'edit';
    this.dialog.open(this.personAddEditComponent, {
      data: record
    });
  }

  deleteRecord(record){
    record.from = 'person';
    this.dialog.open(this.confirmBoxComponent, {
      data: record
    });
  }

}
