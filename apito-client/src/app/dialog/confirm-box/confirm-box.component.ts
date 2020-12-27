import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { PersonService } from 'src/app/services/person.service';
import { CompanyService } from 'src/app/services/company.service';

@Component({
  selector: 'app-confirm-box',
  templateUrl: './confirm-box.component.html',
  styleUrls: ['./confirm-box.component.css']
})
export class ConfirmBoxComponent implements OnInit {
  deleteTxt = ""
  constructor(
    private authService: AuthService,
    private personService: PersonService,
    private companyService: CompanyService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ConfirmBoxComponent>) { }

  ngOnInit(): void {
    console.log(this.data.from);
  }

  confirmAction(){
    if(this.data.from == 'person') {
      this.personService.deletePerson(this.data._id);
    } else {
      if(this.data.from == 'company') {
        this.companyService.deleteCompany(this.data._id);
      }
    }
  }
}
