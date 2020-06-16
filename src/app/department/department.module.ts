import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';


import { DepartmentRoutingModule } from './department-routing.module';
import { UtilModule } from '../util/util.module';

import { CreateDepartmentComponent } from './create-department/create-department.component';
import { ViewDepartmentComponent } from './view-department/view-department.component';
import { EmployeesListComponent } from '../employee/employees-list/employees-list.component';
import { PositionsListComponent } from '../job-position/positions-list/positions-list.component';
import { CreatePositionComponent } from '../job-position/create-position/create-position.component';
import { ValidatorsModule } from '../validators/validators.module';




@NgModule({
  declarations: [
    CreateDepartmentComponent,
    ViewDepartmentComponent,
    EmployeesListComponent,
    PositionsListComponent,
    CreatePositionComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    DepartmentRoutingModule,
    MatIconModule,
    UtilModule,
    ValidatorsModule,
  ],
  exports: []
})
export class DepartmentModule { }
