import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../employee.service';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { SearchResult } from '../search-result.model';

@Component({
  selector: 'app-search-employee',
  templateUrl: './search-employee.component.html',
  styleUrls: ['./search-employee.component.css']
})
export class SearchEmployeeComponent implements OnInit {

  searchParam: string;
  searchResult: SearchResult[] = [];
  // message for the user
  message: string;
  // data for pagination
  totalNumberOfEmployees: number;
  pageNumber = 1;
  pageSize = 4;

  constructor(
    private employeeService: EmployeeService,
    private router: ActivatedRoute,
    private _router: Router,
  ) { }

  ngOnInit() {
    this.router.paramMap
      .subscribe((paramMap: ParamMap) => {
        if (
          paramMap.has('searchTerm')
          &&
          paramMap.has('pageNumber')
          &&
          paramMap.has('pageSize')
        ) {
          this.searchParam = paramMap.get('searchTerm');
          this.pageNumber = +paramMap.get('pageNumber');
          this.pageSize = +paramMap.get('pageSize');
          this.employeeService
            .searchEmployee(this.searchParam, this.pageNumber, this.pageSize)
            .subscribe(
              res => {
                this.searchResult = res.searchResult;
                this.totalNumberOfEmployees = res.totalNumber;
                console.log(res.message);
              },
              err => console.log(err.message)
            );
        } else if (paramMap.has('searchTerm')) {
          this.searchParam = paramMap.get('searchTerm');
          this.employeeService
          .searchEmployee(this.searchParam, this.pageNumber, this.pageSize)
          .subscribe(
            res => {
              this.searchResult = res.searchResult;
              this.totalNumberOfEmployees = res.totalNumber;
              console.log(res.message);
            },
            err => console.log(err.message)
          );
        } else {
          this.message = 'Pleas find the employee you want by providing a word!';
        }
      });
  }

  nextPage(page: number, previousOrNext: boolean) {
    const offset = (this.pageNumber + page) * this.pageSize;
    if (previousOrNext) {
      if (
        offset > this.totalNumberOfEmployees
        ||
        this.pageNumber + page <= 0
      ) {
        return;
      }
      this.pageNumber += page;
    } else {
      this.pageNumber = page;
    }
    this._router.navigate(['search-employee',
      {
        searchTerm: this.searchParam,
        pageNumber: this.pageNumber,
        pageSize: this.pageSize
      }]);
  }

}
