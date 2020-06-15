import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { ConfirmationModalComponent } from '../../modal/confirmation-modal/confirmation-modal.component';
import { DepartmentService } from '../department.service';
import { Department } from '../department.model';
import { AuthService } from 'src/app/auth/auth.service';
import { IsLoading, startLoading, stopLoading } from 'src/app/store/isLoading';

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrls: ['./department-list.component.css']
})
export class DepartmentListComponent implements OnInit, OnDestroy {

  departments: Department[] = [];
  messageFromServer: string;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  totalNumberOfDepartments: number;
  pageNumber = 1;
  pageSize = 8;

  constructor(
    private departmentService: DepartmentService,
    private router: ActivatedRoute,
    private _router: Router,
    public authService: AuthService,
    private loadingStore: Store<IsLoading>,
    private confirmationModalService: NgbModal
  ) {
  }

  ngOnInit() {
    this.loadingStore.dispatch(startLoading());
    this.router.paramMap
      .subscribe((paramMap: ParamMap) => {
        if (paramMap.has('pageNumber')) {
          this.pageNumber = +paramMap.get('pageNumber');
        }
        console.log('page number ' + this.pageNumber + ' and page size ' + this.pageSize);
        this.departmentService
          .getAll(this.pageNumber, this.pageSize)
          .subscribe(
            res => {
              this.loadingStore.dispatch(stopLoading());
              console.log(res.message);
              this.departments = res.departments;
              this.totalNumberOfDepartments = res.totalNumber;
            },
            err => {
              this.loadingStore.dispatch(stopLoading());
              this.messageFromServer = err.error.message;
            }
          );
      });
  }



  ngOnDestroy() {
  }

  delete(id: string, departmentName: string) {
    const modalRef = this.confirmationModalService.open(ConfirmationModalComponent);
    modalRef.componentInstance.name = 'delete ' + departmentName + ' Department';
    modalRef
    .componentInstance
    .passEntry
    .subscribe(
      confirmationForDeletion => {
        if (confirmationForDeletion) {
          // call the service to delete the selected department
          this.departmentService
            .deleteById(id)
            .subscribe(
              res => {
                // after deleting the department in the backend
                // remove the department for the array in the frontend
                this.departments = this.departments.filter(
                  department => department.id !== id
                );
                console.log(res.message);
              },
              err => this.messageFromServer = err.message
            );
        }
      }
    )
  }

  nextPage(page: number, previousOrNext: boolean) {
    const offset = (this.pageNumber + page) * this.pageSize;
    if (previousOrNext) {
      if (
        offset > this.totalNumberOfDepartments + 1
        ||
        this.pageNumber + page <= 0
      ) {
        return;
      }
      this.pageNumber += page;
    } else {
      this.pageNumber = page;
    }
    this._router.navigate(['/home', this.pageNumber]);
  }



}
