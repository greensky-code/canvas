import { Component, OnInit } from '@angular/core';
import { CompanyService } from 'src/app/services/company.service';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.css']
})
export class CompaniesComponent implements OnInit {

  displayedColumns: string[] = [ 
    'name', 
    'email',
    'cp_name',
    'cp_email',
    'cp_createdAt',
    'cp_updatedAt'
  ];
  dataSource: any;
  spans = [];

  constructor(
    private companyService: CompanyService
  ) { }

  ngOnInit(): void {
    this.getCompanies();
  }

  getCompanies() {
    this.companyService.getCompanies().subscribe((res:any)=> {
      console.log(res);
      let newDataSource = [];
      res.data.forEach(element => {
        if(element.companyList.length>0) {
          newDataSource.push(element);
        }
      });
      this.dataSource = newDataSource.reduce((current, next) => {
        next.companyList.forEach(b => {
          current.push({ 
            name: next.name, 
            email: next.email, 
            cp_name: b.name, 
            cp_email: b.email, 
            cp_createdAt: b.createdAt, 
            cp_updatedAt: b.updatedAt 
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
