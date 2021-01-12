import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  displayedColumns: string[] = [
    'fileSource', 
    'name', 
    'email',
    'birthday',
    'createdAt',
    'updatedAt',
    'active',
    'options'
  ];
  dataSource: any;

  constructor(private authService: AuthService,) { }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(){
    this.authService.getUsers().subscribe((res:any)=> {
      console.log(res);
      this.dataSource = new MatTableDataSource(res.data);
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  toggleUserStatus(ele) {
    this.authService.toogleUserStatus({
      id: ele._id,
      status: !ele.active
    }); 
  }

  resetPassword(ele) {
    this.authService.forgotPassword({
      email: ele.email
    })
  }
}
