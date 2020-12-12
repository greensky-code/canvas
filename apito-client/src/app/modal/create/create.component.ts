import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CanvasService } from '../../services/canvas.service'
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  form: FormGroup;
  constructor(public dialogRef: MatDialogRef<CreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data, private canvasService:CanvasService,  private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    console.log(this.data);
    
    this.form = new FormGroup({
      name: new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
    })

  }
  onSubmit() {
    let data = {
      backImage: this.data.image,
      name: this.form.value.name
    }
    if (this.form.invalid) {
      return;
    }
    this.canvasService.createCanvas(data).subscribe((res:any) => {
      this.form.reset()
      this.dialogRef.close()
      this.toastr.success(`${res.data.name} Project created Succesfully`)
      this.router.navigate(['/design', res.data.backImage, res.data._id, res.data.name])
    }, err=>{
      this.dialogRef.close()
    })
  }
}
