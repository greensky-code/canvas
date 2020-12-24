import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-confirm-box',
  templateUrl: './confirm-box.component.html',
  styleUrls: ['./confirm-box.component.css']
})
export class ConfirmBoxComponent implements OnInit {
  deleteTxt = ""
  constructor(private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ConfirmBoxComponent>) { }

  ngOnInit(): void {
    console.log(this.data.from);
  }

  confirmAction(){
    if(this.data.from == 'person') {
      this.authService.deletePerson(this.data._id);
    } else {
      if(this.data.from == 'company') {
        this.authService.deleteCompany(this.data._id);
      }
    }
  }
}
