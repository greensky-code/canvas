import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service'

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
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.getProjects();
  }

  getProjects() {
    this.authService.getProjects().subscribe((res:any)=> {
      console.log(res)
      this.dataSource = res.data;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
