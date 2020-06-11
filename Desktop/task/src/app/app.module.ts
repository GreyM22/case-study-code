import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { StoreModule } from '@ngrx/store';
import {NgxPaginationModule} from 'ngx-pagination';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import reducer from './store/auth';
import { authFeatureKey } from './store/auth';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateDepartmentComponent } from './department/create-department/create-department.component';
import { DepartmentListComponent } from './department/department-list/department-list.component';
import { HeaderComponent } from './header/header.component';
import { ViewDepartmentComponent } from './department/view-department/view-department.component';
import { CreatePositionComponent } from './job-position/create-position/create-position.component';
import { PositionsListComponent } from './job-position/positions-list/positions-list.component';
import { CreateEmployeeComponent } from './employee/create-employee/create-employee.component';
import { EmployeesListComponent } from './employee/employees-list/employees-list.component';
import { ViewEmployeeComponent } from './employee/view-employee/view-employee.component';
import { SearchEmployeeComponent } from './employee/search-employee/search-employee.component';
import { ExEmployeesComponent } from './employee/ex-employees/ex-employees.component';
import { NumberToArrayPipe } from './util/number-to-array.pipe';
import { LoginComponent } from './auth/login/login.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import { CreateAdminComponent } from './auth/create-admin/create-admin.component';
import { ConfirmEqualValidatorDirective } from './util/confirm-equal-validator.directive';
import { SpecialCharacterDirective } from './validators/special-character.directive';
import { SpecialCharacterNoWhiteSpaceDirective } from './validators/special-character-no-white-space.directive';

@NgModule({
  declarations: [
    AppComponent,
    CreateDepartmentComponent,
    DepartmentListComponent,
    HeaderComponent,
    ViewDepartmentComponent,
    CreatePositionComponent,
    PositionsListComponent,
    CreateEmployeeComponent,
    EmployeesListComponent,
    ViewEmployeeComponent,
    SearchEmployeeComponent,
    ExEmployeesComponent,
    NumberToArrayPipe,
    LoginComponent,
    CreateAdminComponent,
    ConfirmEqualValidatorDirective,
    SpecialCharacterDirective,
    SpecialCharacterNoWhiteSpaceDirective
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    MatIconModule,
    NgxPaginationModule,
    NoopAnimationsModule,
    StoreModule.forRoot({ [authFeatureKey]: reducer}),
    StoreDevtoolsModule.instrument({})
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
