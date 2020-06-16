import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DepartmentListComponent } from './department/department-list/department-list.component';
import { AuthGuard } from './auth/auth.guard';


const routes: Routes = [
  {path: 'home', component: DepartmentListComponent, data: { animation: 'home'}},
  {path: 'home/:pageNumber', component: DepartmentListComponent},
  {path: 'auth', loadChildren: './auth/auth.module#AuthModule'},
  {path: 'departments', loadChildren: './department/department.module#DepartmentModule'},
  {path: 'employees', loadChildren: './employee/employee.module#EmployeeModule'},
  {path: '', component: DepartmentListComponent, data: { animation: 'home'}}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
