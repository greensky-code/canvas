import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  returnUrl = ''
  auth;
  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.authService.getAuthStatusListener().subscribe(res=>{
        if (res) {
          this.router.navigate(['/home'])
        }
    })
    this.form = new FormGroup({
      email: new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
      password: new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] })
    })
    this.route.queryParams
      .subscribe(params => this.returnUrl = params['return'] || '/home');

  }
  onLogin() {
    if (this.form.invalid) {
      return;
    }
    this.authService.login(this.form.value, this.returnUrl)
  }

}
