import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EmployeeService } from '../employee.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { SearchResult } from '../search-result.model';

@Component({
  selector: 'app-ex-employees',
  templateUrl: './ex-employees.component.html',
  styleUrls: ['./ex-employees.component.css']
})
export class ExEmployeesComponent implements OnInit {
  searchExEmployeeFrom: FormGroup;
  exEmployeeList: SearchResult[];
  errorFromServer: string;
  totalNumberOfEmployees: number;
  pageNumber = 1;
  pageSize = 3;

  constructor(
    private employeeService: EmployeeService,
    private _router: Router,
    private router: ActivatedRoute
  ) { }

  ngOnInit() {
    this.router.paramMap
      .subscribe((paramMap: ParamMap) => {
        if (
          paramMap.get('searchTerm')
          &&
          paramMap.get('pageNumber')
          &&
          paramMap.get('pageSize')
        ) {
          // get the data from the router;
          const searchTerm = paramMap.get('searchTerm');
          this.pageNumber = +paramMap.get('pageNumber');
          this.pageSize = +paramMap.get('pageSize');
          this.searchExEmployeeFrom = new FormGroup({
            searchTerm: new FormControl(searchTerm, Validators.required)
          });
          this.employeeService
            .findFiredEmployee(searchTerm, this.pageNumber, this.pageSize)
            .subscribe(
              res => {
                this.exEmployeeList = res.searchResult;
                this.totalNumberOfEmployees = res.totalNumber;
                console.log(res.message);
              },
              err => {
                console.log(err.message);
                this.errorFromServer = err.message;
              }
            );
        } else {
          this.searchExEmployeeFrom = new FormGroup({
            searchTerm: new FormControl(null, Validators.required)
          });
        }
      });
  }

  onSubmit() {
    if (this.searchExEmployeeFrom.invalid) {
      return;
    }

    this._router.navigate(['ex-employees',
      {
        searchTerm: this.searchExEmployeeFrom.value.searchTerm,
        pageNumber: this.pageNumber,
        pageSize: this.pageSize
      }]);
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
    const searchTerm = this.searchExEmployeeFrom.value.searchTerm;
    this._router.navigate(['ex-employees',
      {
        searchTerm: searchTerm,
        pageNumber: this.pageNumber,
        pageSize: this.pageSize
      }]);
  }

}
