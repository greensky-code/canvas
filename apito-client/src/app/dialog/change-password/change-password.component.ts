import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  form: FormGroup;

  constructor(private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ChangePasswordComponent>) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      currentPassword: new FormControl('', { validators: [Validators.required, Validators.minLength(3)] }),
      newPassword: new FormControl('', { validators: [Validators.required, Validators.minLength(3)] })
    });
  }

  changePassword(){
    if (this.form.invalid) {
      return;
    }
    this.form.value.user = {
      id: this.data.user._id
    }
    this.authService.updatePassword(this.form.value);
  }
}
