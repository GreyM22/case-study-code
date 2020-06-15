import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContentComponent } from './modal/ngbd-modal-content/ngbd-modal-content.component';

import { User } from './store/auth';
import { Store } from '@ngrx/store';
import { AuthService } from './auth/auth.service';
import { ErrorMessage, showError } from './store/error';
import { IsLoading, loadingFeatureKey } from './store/isLoading';
import { testAnimation } from './animations/flipInY.animation';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [testAnimation]
})
export class AppComponent {
  title = 'task';
  errorMessage: string;
  isLoading = false;
  constructor(
    private authStore: Store<{user: User}>,
    private authService: AuthService,
    private errorMessageStore: Store<{error: ErrorMessage}>,
    private loadingStore: Store<{[loadingFeatureKey]: IsLoading}>,
    private modalService: NgbModal,
    private cdRef: ChangeDetectorRef
  ) {
    authStore.subscribe(
      res => {
        const employeesId = res.user.employeesId;
        const positionsId = res.user.positionsId;
        authService.setPositionsId(positionsId);
        authService.setEmployeesId(employeesId);
      }
    );
    errorMessageStore.subscribe(
      res => {
        if (res.error.message) {
          const modalRef = this.modalService.open(NgbdModalContentComponent);
          modalRef.componentInstance.message = res.error.message;
        }
      },
      err => {
        if (err.message) {
          const modalRef = this.modalService.open(NgbdModalContentComponent);
          modalRef.componentInstance.message = err.message;
        } else {
          console.log(err);
        }
      }
    );

    loadingStore.subscribe(
      res => {
        this.cdRef.detectChanges();
        this.isLoading = res.loading.loading;
      },
      err => {
        errorMessageStore.dispatch(showError({ payload: { message: err } }))
      }
    )
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }}
