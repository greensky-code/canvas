import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  isAuth
  user;
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.isAuth = this.authService.getAuth()
    if (this.isAuth) {
      this.authService.getLoggedInUser().subscribe((res:any)=> {
        console.log(res);
        this.user = res.data;
        if(this.user.role == "user") {
          this.router.navigateByUrl("/home");
        }
      })
      
    }
  }

}
