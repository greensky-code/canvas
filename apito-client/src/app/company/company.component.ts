import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CompanyAddEditComponent } from '../dialog/company-add-edit/company-add-edit.component';
import { ConfirmBoxComponent } from '../dialog/confirm-box/confirm-box.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {
  displayedColumns: string[] = [
    'name', 
    'email', 
    'address',
    'options'
  ];
  auth;
  user;
  isAuth: any;
  dataSource: any;
  private companyAddEditComponent = CompanyAddEditComponent;
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
      this.getCompany();
    })
  }


  getCompany(){
    this.authService.getCompany(this.user._id).subscribe((res:any)=> {
      console.log(res);
      this.dataSource = new MatTableDataSource(res.data);
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  addCompany() {
    this.dialog.open(this.companyAddEditComponent, {
      data: {
        mode: 'add'
      }
    });
  }

  editRecord(record) {
    record.mode = 'edit';
    this.dialog.open(this.companyAddEditComponent, {
      data: record
    });
  }

  deleteRecord(record){
    record.from = 'company';
    this.dialog.open(this.confirmBoxComponent, {
      data: record
    });
  }
}
