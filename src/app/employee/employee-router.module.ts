import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateEmployeeComponent } from './create-employee/create-employee.component';
import { AuthGuard } from '../auth/auth.guard';
import { AuthorizedForEmployeeGuard } from '../auth/authorized-for-employee.guard';
import { ViewEmployeeComponent } from './view-employee/view-employee.component';
import { SearchEmployeeComponent } from './search-employee/search-employee.component';
import { ExEmployeesComponent } from './ex-employees/ex-employees.component';


const routes: Routes = [
  {path: 'add-employee', component: CreateEmployeeComponent, canActivate: [AuthGuard]},
  {path: 'edit-employee/:id', component: CreateEmployeeComponent, canActivate: [AuthGuard, AuthorizedForEmployeeGuard]},
  {path: 'view-employee/:id', component: ViewEmployeeComponent},
  {path: 'search-employee/:searchTerm/:pageNumber/:pageSize', component: SearchEmployeeComponent},
  {path: 'search-employee/:searchTerm', component: SearchEmployeeComponent},
  {path: 'ex-employees/:searchTerm/:pageNumber/:pageSize', component: ExEmployeesComponent},
  {path: 'ex-employees', component: ExEmployeesComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule { }
