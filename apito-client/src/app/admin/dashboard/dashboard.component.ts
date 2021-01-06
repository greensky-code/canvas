import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  isAuth
  user;
  form: FormGroup;
  constructor(private authService: AuthService, private router: Router, public dialog: MatDialog) { }

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

      this.form = new FormGroup({
        email: new FormControl('', { validators: [Validators.required, Validators.minLength(3)] }),
        name: new FormControl('', { validators: [Validators.required, Validators.minLength(3)] }),
        password: new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
      });
      
    }
  }

  openModal(templateRef) {
    let dialogRef = this.dialog.open(templateRef, {
         width: '250px',
         // data: { name: this.name, animal: this.animal }
    });

    dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        // this.animal = result;
    });
}

  logout() {
    this.authService.clearAuthData()
  }

  addAdminAccount(){
    if (this.form.invalid) {
      return;
    }
    this.form.value.role = 'admin';
    this.form.value.birthday = new Date();
    this.authService.signUp(this.form.value)
  }

}
