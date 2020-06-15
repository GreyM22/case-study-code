import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';


import { LoginComponent } from './login/login.component';
import { CreateAdminComponent } from './create-admin/create-admin.component';
import { AuthRouterModule } from './auth-router.module';



@NgModule({
  declarations: [
    LoginComponent,
    CreateAdminComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AuthRouterModule
  ]
})
export class AuthModule { }
