import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ImageCropperModule } from 'ngx-image-cropper';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';


import { EmployeeRoutingModule } from './employee-router.module';
import { UtilModule } from '../util/util.module';

import { CreateEmployeeComponent } from './create-employee/create-employee.component';
import { ExEmployeesComponent } from './ex-employees/ex-employees.component';
import { SearchEmployeeComponent } from './search-employee/search-employee.component';
import { ViewEmployeeComponent } from './view-employee/view-employee.component';
import { ValidatorsModule } from '../validators/validators.module';



@NgModule({
  declarations: [
    CreateEmployeeComponent,
    ExEmployeesComponent,
    SearchEmployeeComponent,
    ViewEmployeeComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ImageCropperModule,
    RouterModule,
    EmployeeRoutingModule,
    UtilModule,
    MatIconModule,
    ValidatorsModule,
  ]
})
export class EmployeeModule { }
