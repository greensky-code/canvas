import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isAuth
  user;
  lang;
  imageSrc;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.isAuth = this.authService.getAuth()
    if (this.isAuth) {
      this.authService.getLoggedInUser().subscribe((res:any)=> {
        console.log(res);
        this.user = res.data;
        this.imageSrc = this.user.fileSource;
      })
      
    }
    this.lang = localStorage.getItem('lang') || 'en'
    console.log(this.isAuth);
  }
  logout() {
    this.authService.clearAuthData()
  }
  changeLang(value) {
    localStorage.setItem('lang', value)
    window.location.reload()
  }
}
