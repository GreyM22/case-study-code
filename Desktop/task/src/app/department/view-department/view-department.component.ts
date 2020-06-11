import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { PositionService } from 'src/app/job-position/position.service';
import { DepartmentService } from '../department.service';
import { EmployeeService } from 'src/app/employee/employee.service';
import { AuthService } from 'src/app/auth/auth.service';

import { Department } from '../department.model';
import { Employee } from 'src/app/employee/employee.model';
import { Admin } from 'src/app/auth/admin.model';

@Component({
  selector: 'app-view-department',
  templateUrl: './view-department.component.html',
  styleUrls: ['./view-department.component.css']
})
export class ViewDepartmentComponent implements OnInit, OnDestroy {
  departmentId: string;
  departmentJobPositions: Position[];
  departmentEmployees: Employee[];
  departmentAdmins: Admin[];
  updatedPositions: Subscription;
  updatedEmployees: Subscription;
  errorFromServer: string;
  department: Department;
  // name of the department administrator
  adminName: string;
  // pagination for positions
  pagePositionNumber = 1;
  pagePositionSize = 3;
  totalNumberOfJobPositions: number;
  // pagination for employees
  pageEmployeesNumber = 1;
  pageEmployeesSize = 4;
  totalNumberOfJobEmployees: number;


  constructor(
    private positionService: PositionService,
    private router: ActivatedRoute,
    private _router: Router,
    private departmentService: DepartmentService,
    private employeeService: EmployeeService,
    public authService: AuthService
  ) { }

  ngOnInit() {
    // listen to the url of the site
    this.router.paramMap
      .subscribe(
        (paramMap: ParamMap) => {
          // get the id of the department from the url
          this.departmentId = paramMap.get('id');
          // get the information of the department
          this.departmentService
            .getById(this.departmentId)
            .subscribe(
              res => {
                this.department = res.department;
                console.log(res.message);
              },
              err => this.errorFromServer = err.message
            );
          // get all the job position of the department
          // using the department id
          this.positionService
            .getPositions(this.departmentId, this.pagePositionNumber, this.pagePositionSize);
          // subscribe to service in order to update automatically
          // in case one position is added or deleted
          this.updatedPositions = this.positionService.getUpdatedPositions()
            .subscribe(
              // update the position in the view department component
              (positions: Position[]) => {
                this.departmentJobPositions = positions;
                this.totalNumberOfJobPositions = this.positionService.getNumberOfPosition();
              },
              // inform the user in case of any error
              err => this.errorFromServer = 'Error with the Job Position Service!'
            );
          // get all the employees of the department
          // using the department id
          this.employeeService
            .getEmployees(this.departmentId, this.pageEmployeesNumber, this.pageEmployeesSize);
          // subscribe to service in order to update automatically
          // in case one position is added or deleted
          this.updatedEmployees = this.employeeService.getUpdatedEmployees()
            .subscribe(
              // update the position in the view department component
              (employees: Employee[]) => {
                this.departmentEmployees = employees;
                this.totalNumberOfJobEmployees = this.employeeService.getTotalNumberOfEmployees();
                // if the department has a admin
                // find it
                if (this.department.employeeId) {
                  const departmentAdmin: Employee[] = employees.filter(employee => {
                    return this.department.employeeId === employee.id;
                  });
                  this.adminName = departmentAdmin[0].name + ' ' + departmentAdmin[0].surname;
                }
              },
              // inform the user in case of any error
              err => this.errorFromServer = 'Error with the Employees Service!'
            );
          this.authService
              .getAdmins(+this.departmentId)
              .subscribe(
                res => {
                  this.departmentAdmins = res.admins;
                  console.log(res.message);
                },
                err => console.log(err.message)
              );
        },
        // in case of error with angular
        err => this.errorFromServer = err
      );
  }


  removeAdmin() {
    this.department.employeeId = null;
    this.adminName = null;
  }

  ngOnDestroy() {
    this.updatedPositions.unsubscribe();
    this.updatedEmployees.unsubscribe();
  }

  nextPage(page: number, previousOrNext: boolean) {
    const offset = (this.pagePositionNumber + page) * this.pagePositionSize;
    if (previousOrNext) {
      if (
        offset > this.totalNumberOfJobPositions + 1
        ||
        this.pagePositionNumber + page <= 0
      ) {
        return;
      }
      this.pagePositionNumber += page;
    } else {
      this.pagePositionNumber = page;
    }
    this.positionService
      .getPositions(this.departmentId, this.pagePositionNumber, this.pagePositionSize);
  }

  nextPageEmployees(page: number, previousOrNext: boolean) {
    const offset = (this.pageEmployeesNumber + page) * this.pageEmployeesSize;
    if (previousOrNext) {
      if (
        offset >= this.totalNumberOfJobEmployees + 1
        ||
        this.pageEmployeesNumber + page <= 0
      ) {
        return;
      }
      this.pageEmployeesNumber += page;
    } else {
      this.pageEmployeesNumber = page;
    }
    this.employeeService
      .getEmployees(this.departmentId, this.pageEmployeesNumber, this.pageEmployeesSize);
  }

  deleteAdmin(adminId: number) {
    this.authService
        .deleteAdmin(adminId)
        .subscribe(
          res => {
            this.departmentAdmins = this.departmentAdmins.filter(admin => admin.id !== adminId);
            console.log(res.message);
          },
          err => console.log(err.message)
        );

  }


}
