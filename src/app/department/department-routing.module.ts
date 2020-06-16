import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateDepartmentComponent } from './create-department/create-department.component';
import { AuthGuard } from '../auth/auth.guard';
import { SuperAdminGuard } from '../auth/super-admin.guard';
import { AuthorizationForDepartmentGuard } from '../auth/authorization-for-department.guard';
import { ViewDepartmentComponent } from './view-department/view-department.component';
import { CreatePositionComponent } from '../job-position/create-position/create-position.component';
import { AuthorizationForPositionGuard } from '../auth/authorization-for-position.guard';


const routes: Routes = [
  {
    path: 'create-department',
    component: CreateDepartmentComponent,
    canActivate: [AuthGuard, SuperAdminGuard],
    data: { animation: 'createDepartment'}
  },
  {path: 'edit-department/:id', component: CreateDepartmentComponent, canActivate: [AuthGuard, AuthorizationForDepartmentGuard]},
  {path: 'view-department/:id', component: ViewDepartmentComponent},
  {path: 'create-position', component: CreatePositionComponent, canActivate: [AuthGuard]},
  {path: 'edit-position/:id', component: CreatePositionComponent, canActivate: [AuthGuard, AuthorizationForPositionGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepartmentRoutingModule { }
