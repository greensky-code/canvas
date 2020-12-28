import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service'

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  displayedColumns: string[] = [ 
    'name', 
    'email',
    'pr_name',
    'pr_createdAt',
    'pr_updatedAt',
    'options'
  ];
  dataSource: any;
  spans = [];

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.getProjects();
  }

  getProjects() {
    this.authService.getProjects().subscribe((res:any)=> {
      console.log(res)
      let newDataSource = [];
      res.data.forEach(element => {
        if(element.projectList.length>0) {
          newDataSource.push(element);
        }
      });
      this.dataSource = newDataSource.reduce((current, next) => {
        next.projectList.forEach(b => {
          current.push({ 
            name: next.name, 
            email: next.email, 
            pr_name: b.name, 
            pr_createdAt: b.createdAt, 
            pr_updatedAt: b.updatedAt 
          })
        });
        return current;
      }, []);
      console.log(this.dataSource)
      this.cacheSpan('name', d => d.name);
      this.cacheSpan('email', d => d.email);
      console.log(this.spans);
    });
  }

    /**
   * Evaluated and store an evaluation of the rowspan for each row.
   * The key determines the column it affects, and the accessor determines the
   * value that should be checked for spanning.
   */
  cacheSpan(key, accessor) {
    for (let i = 0; i < this.dataSource.length;) {
      let currentValue = accessor(this.dataSource[i]);
      let count = 1;

      // Iterate through the remaining rows to see how many match
      // the current value as retrieved through the accessor.
      for (let j = i + 1; j < this.dataSource.length; j++) {
        if (currentValue != accessor(this.dataSource[j])) {
          break;
        }

        count++;
      }

      if (!this.spans[i]) {
        this.spans[i] = {};
      }

      // Store the number of similar values that were found (the span)
      // and skip i to the next unique row.
      this.spans[i][key] = count;
      i += count;
    }
  }

  getRowSpan(col, index) {    
    return this.spans[index] && this.spans[index][col];
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
