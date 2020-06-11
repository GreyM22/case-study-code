import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DepartmentListComponent } from './department/department-list/department-list.component';
import { CreateDepartmentComponent } from './department/create-department/create-department.component';
import { ViewDepartmentComponent } from './department/view-department/view-department.component';
import { CreatePositionComponent } from './job-position/create-position/create-position.component';
import { CreateEmployeeComponent } from './employee/create-employee/create-employee.component';
import { ViewEmployeeComponent } from './employee/view-employee/view-employee.component';
import { SearchEmployeeComponent } from './employee/search-employee/search-employee.component';
import { ExEmployeesComponent } from './employee/ex-employees/ex-employees.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { CreateAdminComponent } from './auth/create-admin/create-admin.component';
import { SuperAdminGuard } from './auth/super-admin.guard';
import { AuthorizedGuard } from './auth/authorized.guard';
import { AuthorizationForPositionGuard } from './auth/authorization-for-position.guard';
import { AuthorizedForEmployeeGuard } from './auth/authorized-for-employee.guard';
import { AuthorizationForDepartmentGuard } from './auth/authorization-for-department.guard';


const routes: Routes = [
  {path: 'home', component: DepartmentListComponent},
  {path: 'create-department', component: CreateDepartmentComponent, canActivate: [AuthGuard, SuperAdminGuard]},
  {path: 'create-admin', component: CreateAdminComponent, canActivate: [AuthGuard, SuperAdminGuard]},
  {path: 'edit-admin/:id', component: CreateAdminComponent, canActivate: [AuthGuard, SuperAdminGuard]},
  {path: 'edit-department/:id', component: CreateDepartmentComponent, canActivate: [AuthGuard, AuthorizationForDepartmentGuard]},
  {path: 'view-department/:id', component: ViewDepartmentComponent},
  {path: 'create-position', component: CreatePositionComponent, canActivate: [AuthGuard]},
  {path: 'edit-position/:id', component: CreatePositionComponent, canActivate: [AuthGuard, AuthorizationForPositionGuard]},
  {path: 'add-employee', component: CreateEmployeeComponent, canActivate: [AuthGuard]},
  {path: 'edit-employee/:id', component: CreateEmployeeComponent, canActivate: [AuthGuard, AuthorizedForEmployeeGuard]},
  {path: 'view-employee/:id', component: ViewEmployeeComponent},
  {path: 'search-employee/:searchTerm/:pageNumber/:pageSize', component: SearchEmployeeComponent},
  {path: 'search-employee/:searchTerm', component: SearchEmployeeComponent},
  {path: 'ex-employees/:searchTerm/:pageNumber/:pageSize', component: ExEmployeesComponent},
  {path: 'ex-employees', component: ExEmployeesComponent},
  {path: 'home/:pageNumber', component: DepartmentListComponent},
  {path: 'login', component: LoginComponent},
  {path: 'login/super-admin', component: LoginComponent},
  {path: '', component: DepartmentListComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
