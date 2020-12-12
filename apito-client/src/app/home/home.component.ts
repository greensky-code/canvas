import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CreateComponent } from '../modal/create/create.component';
import { CanvasService } from '../services/canvas.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  images: any = [
    { src: "assets/images/fruitiza.png" },
    { src: "assets/images/paygain.png" },
    { src: "assets/images/house.png" },
    { src: "assets/images/tellver1.png" },
    { src: "assets/images/ncp.png" },
    { src: "assets/images/expeiria.png" },
  ]
  listStyles = [
    "list-group-item-primary",
    "list-group-item-secondary",
    "list-group-item-success",
    "list-group-item-danger",
    "list-group-item-warning",
    "list-group-item-info",
    "list-group-item-light",
    "list-group-item-dark",
  ]
  canvas;
  uploads = []
  constructor(private toastr: ToastrService, public dialog: MatDialog, public canvasService: CanvasService) { }

  ngOnInit(): void {
    this.getUserDesigns()
  }
  onImagePicked(event) {
    if (this.uploads.length >= 3) {
      return this.toastr.error("Maximum Template")
    }
    const file = (event.target as HTMLInputElement).files[0];
    if (file.type.split('/')[0] !== 'image') {
      return this.toastr.error("Images Only")
    }
    const reader = new FileReader();
    reader.onload = () => {
      this.uploads.push({ src: reader.result })
    };
    reader.readAsDataURL(file);
  }
  openDialog(event): void {
    const dialogRef = this.dialog.open(CreateComponent, {
      width: '600px',
      data: { image: event.target.src }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  getUserDesigns() {
    this.canvasService.getUserCanvas().subscribe((res:any)=>{
      
      this.canvas = res.data
    })
  }
  getColor(index){
    if (index%2==0) {
      return true
    }
  }
  getColor1(index){
    if (index%2==1) {
      return true
    }
  }
}
