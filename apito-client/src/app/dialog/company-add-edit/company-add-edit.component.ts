import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { CompanyService } from 'src/app/services/company.service';

@Component({
  selector: 'app-company-add-edit',
  templateUrl: './company-add-edit.component.html',
  styleUrls: ['./company-add-edit.component.css']
})
export class CompanyAddEditComponent implements OnInit {
  type = 'add';
  isAuth;
  user;
  form: FormGroup;
  constructor(
    private authService: AuthService,
    private companyService: CompanyService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CompanyAddEditComponent>
  ) { }

  ngOnInit(): void {
    this.isAuth = this.authService.getAuth();

    this.authService.getLoggedInUser().subscribe((res:any)=> {
      console.log(res);
      this.user = res.data;
    });
    this.form = new FormGroup({
      email: new FormControl('', { validators: [Validators.required, Validators.minLength(3)] }),
      name: new FormControl('', { validators: [Validators.required, Validators.minLength(1)] }),
      address: new FormControl('', { validators: [Validators.required, Validators.minLength(1)] })
    });
    this.fetchRecord();
  }

  fetchRecord() {
    if(this.data.mode == 'edit'){
      this.form.patchValue({
        email: this.data.email,
        name: this.data.name,
        address: this.data.address
      });
    } else {
      console.log('Add mode.');
    }
    this.type = this.data.type;
    console.log('dataPass', this.data);
  }

  actionRelated() {
    if (this.data.mode == 'add') {
      //add mode
      if (this.form.invalid) {
        alert("All fields are mandatory.");
        return;
      }
      this.form.value.user_id = this.user._id
      this.companyService.addCompany(this.form.value);
    } else {
      //edit mode 
      if (this.form.invalid) {
        return;
      }
      this.form.value.company = {
        id: this.data._id
      }
      this.companyService.updateCompany(this.form.value);
    }
  }

}
