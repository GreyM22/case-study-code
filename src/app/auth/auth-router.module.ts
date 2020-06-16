import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateAdminComponent } from './create-admin/create-admin.component';
import { AuthGuard } from './auth.guard';
import { SuperAdminGuard } from './super-admin.guard';
import { LoginComponent } from './login/login.component';


const routes: Routes = [
  {path: 'create-admin', component: CreateAdminComponent, canActivate: [AuthGuard, SuperAdminGuard]},
  {path: 'edit-admin/:id', component: CreateAdminComponent, canActivate: [AuthGuard, SuperAdminGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'login/super-admin', component: LoginComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRouterModule { }
