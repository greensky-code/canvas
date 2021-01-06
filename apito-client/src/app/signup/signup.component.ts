import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import { AuthService } from '../services/auth.service'

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  form: FormGroup;
  imageSrc: string;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
      name: new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
      password: new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
      birthday: new FormControl(null, { validators: [Validators.required, Validators.minLength(1)] }),
      file: new FormControl(''),
      fileSource: new FormControl('')
    })
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

  onSignUp() {
    if (this.form.invalid) {
      return;
    }
    this.form.value.role = "user";
    this.authService.signUp(this.form.value)
  }

  handleDate() {
    let ele = document.getElementById('birthday');
    let dt = new Date().toLocaleDateString('en-CA');;
    ele.setAttribute("type", "date");
    ele.setAttribute("max", dt)
  }

}
