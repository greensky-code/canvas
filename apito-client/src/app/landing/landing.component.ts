import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  isAuth
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.isAuth = this.authService.getAuth()
    console.log(this.isAuth);
    
  }
  logout() {
    this.authService.clearAuthData()
  }

}
