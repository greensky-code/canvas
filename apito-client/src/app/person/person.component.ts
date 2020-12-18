import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { timestamp } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { PersonAddEditComponent } from '../dialog/person-add-edit/person-add-edit.component';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent implements OnInit {
  displayedColumns: string[] = [
    'name', 
    'email', 
    'phone', 
    'birthday',
    'address',
    'options'
  ];
  dataSource: any;
  isModalVisible: Boolean = false;
  isAuth
  form: FormGroup;
  user;
  lang;
  persons;

  private personAddEditComponent = PersonAddEditComponent;

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

  deleteRecord(recordId) {

  }

  
  public editRecord(record) {
    record.mode = 'edit';
    this.dialog.open(this.personAddEditComponent, {
      data: record
    });
  }

}
