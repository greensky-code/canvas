import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  isAuth
  form: FormGroup;
  imageSrc;
  user;
  lang;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.isAuth = this.authService.getAuth();
    
    this.form = new FormGroup({
      email: new FormControl('', { validators: [Validators.required, Validators.minLength(3)] }),
      name: new FormControl('', { validators: [Validators.required, Validators.minLength(3)] }),
      birthday: new FormControl('', { validators: [Validators.required, Validators.minLength(1)] }),
      file: new FormControl(''),
      fileSource: new FormControl('')
    });
    if (this.isAuth) {
      this.authService.getLoggedInUser().subscribe((res:any)=> {
        console.log(res);
        this.user = res.data;
        this.imageSrc = this.user.fileSource;
        console.log(this.user.email);
        this.form.patchValue({
          email: this.user.email,
          name: this.user.name,
          birthday: this.formatDate(new Date(this.user.birthday)),
          fileSource: this.user.fileSource
        });
      })
    }
  }

  formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  }

  onUpdate(){
    if (this.form.invalid) {
      return;
    }
    this.form.value.user = {
      id: this.user._id
    }
    this.authService.updateProfile(this.form.value)
  }

  onFileChange(event) {
    const reader = new FileReader();
    
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
    
      reader.onload = () => {
   
        this.imageSrc = reader.result as string;
     
        this.form.patchValue({
          fileSource: reader.result
        });
   
      };
   
    }
  }
}
