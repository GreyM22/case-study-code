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
import { Store } from '@ngrx/store';
import { ErrorMessage, showError } from 'src/app/store/error';
import { IsLoading, startLoading, stopLoading } from 'src/app/store/isLoading';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from 'src/app/modal/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-view-department',
  templateUrl: './view-department.component.html',
  styleUrls: ['./view-department.component.css']
})
export class ViewDepartmentComponent implements OnInit, OnDestroy {
  departmentId: string;
  departmentJobPositions: Position[] = [];
  departmentEmployees: Employee[] = [];
  departmentAdmins: Admin[] = [];
  updatedPositions: Subscription;
  updatedEmployees: Subscription;
  errorFromServerForDepartment: string;
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
    public authService: AuthService,
    private store: Store<ErrorMessage>,
    private loadingStore: Store<IsLoading>,
    private confirmationModalService: NgbModal
  ) { }

  ngOnInit() {
    // set the loading spinner
    this.loadingStore.dispatch(startLoading());
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
              err => this.errorFromServerForDepartment = err.error.message
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
              err => this.store.dispatch(showError({ payload: { message: err.error.message }}))
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
              err => this.store.dispatch(showError({ payload: { message: err.error.message }}))
            );
          this.authService
              .getAdmins(+this.departmentId)
              .subscribe(
                res => {
                  this.departmentAdmins = res.admins;
                  console.log(res.message);
                },
                err => this.store.dispatch(showError({ payload: { message: err.error.message }}))
              );
          this.loadingStore.dispatch(stopLoading());
        },
        // in case of error with angular
        err => this.store.dispatch(showError({ payload: { message: err }}))
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

  deleteAdmin(adminId: number, adminName: string, adminSurname: string) {
    const modalRef = this.confirmationModalService.open(ConfirmationModalComponent);
    modalRef.componentInstance.name = 'delete Admin ' + adminName + ' ' + adminSurname;
    modalRef
      .componentInstance
      .passEntry
      .subscribe(
        confirmation => {
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
      )


  }


}
