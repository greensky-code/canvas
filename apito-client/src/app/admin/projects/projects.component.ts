import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CanvasService } from '../../services/canvas.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  displayedColumns: string[] = [ 
    'ownerName', 
    'ownerEmail',
    'name',
    'invitees',
    'createdAt',
    'updatedAt',
    'options'
  ];
  dataSource: any;

  constructor(
    private authService: AuthService,
    private canvasService: CanvasService

  ) { }

  ngOnInit(): void {
    this.getProjects();
  }

  getProjects() {
    this.authService.getProjects().subscribe((res:any)=> {
      console.log(res)
      let dtSourceArr = [];
      res.data.forEach(element => {
        let obj = {
          'ownerName': element.ownerDetails[0].name, 
          'ownerEmail': element.ownerDetails[0].email,
          'name': element.name,
          'invitees': [],
          'createdAt': element.createdAt,
          'updatedAt': element.updatedAt
        };

        if (element.invitees.length>0) {
          element.invitees.forEach(itv => {
            if(itv.email !== element.ownerDetails[0].email){
              obj.invitees.push(itv.email)
            }
          });
        } 
        dtSourceArr.push(obj)
      });
      this.dataSource = new MatTableDataSource(dtSourceArr);
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteProject(ele) {
    this.canvasService.deleteCanvas(ele._id)
  }
}
