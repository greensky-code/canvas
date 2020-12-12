import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  constructor(private authService: AuthService, private translate: TranslateService) {
    this.translate.setDefaultLang('en')
    this.translate.use(localStorage.getItem('lang') || 'en')
  }
  ngOnInit() {
    this.authService.autoAutUser();
  }
}
