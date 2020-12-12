import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CanvasService } from '../../services/canvas.service'
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  form: FormGroup;
  constructor(public dialogRef: MatDialogRef<AddUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data, private canvasService:CanvasService,  private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    
    this.form = new FormGroup({
      email: new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
    })
  }
  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    let data = {
      canvasId: this.data.id,
      email: this.form.value.email
    }
    this.canvasService.addUser(data).subscribe((res:any) => {
      
      this.dialogRef.close()
      this.toastr.success(`${this.form.value.email} added Succesfully`)
    }, err=>{
      this.dialogRef.close()
    })
  }

}
