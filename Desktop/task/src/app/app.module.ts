import { BrowserModule } from '@angular/platform-browser';
import { NgModule, InjectionToken } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { StoreModule, ActionReducerMap } from '@ngrx/store';
import { NgxPaginationModule } from 'ngx-pagination';
import { NoopAnimationsModule, BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import authReducer from './store/auth';
import { authFeatureKey } from './store/auth';
import errorReducer from './store/error';
import { errorFeatureKey } from './store/error';
import loadReducer from './store/isLoading';
import { loadingFeatureKey } from './store/isLoading';

import { UtilModule } from './util/util.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AuthInterceptor } from './auth/auth-interceptor';

import { HeaderComponent } from './header/header.component';
import { NgbdModalContentComponent } from './modal/ngbd-modal-content/ngbd-modal-content.component';
import { ConfirmationModalComponent } from './modal/confirmation-modal/confirmation-modal.component';
import { DepartmentListComponent } from './department/department-list/department-list.component';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DepartmentListComponent,
    NgbdModalContentComponent,
    ConfirmationModalComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    MatIconModule,
    NgxPaginationModule,
    NoopAnimationsModule,
    NgbModule,
    UtilModule,
    StoreModule.forRoot({
      user: authReducer,
      error: errorReducer,
      loading: loadReducer
    }),
    StoreDevtoolsModule.instrument({})
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
  ],
  entryComponents: [NgbdModalContentComponent, ConfirmationModalComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
