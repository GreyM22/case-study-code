import { Component, OnInit } from '@angular/core';
import { Employee } from '../employee.model';
import { Department } from 'src/app/department/department.model';
import { Position } from 'src/app/job-position/position.model';
import { EmployeeService } from '../employee.service';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { DepartmentService } from 'src/app/department/department.service';
import { PositionService } from 'src/app/job-position/position.service';
import { JobHistory } from '../job-history.model';

@Component({
  selector: 'app-view-employee',
  templateUrl: './view-employee.component.html',
  styleUrls: ['./view-employee.component.css']
})
export class ViewEmployeeComponent implements OnInit {
  employee: Employee ;
  department: Department;
  jobHistory: JobHistory[] = [];
  messageFromServer: string;
  currentJobPosition: JobHistory[] = [];

  constructor(
    private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private positionService: PositionService,
    private router: ActivatedRoute,
    private _router: Router
  ) { }

  ngOnInit() {
    // get the id of the employee from the router
    this.router.paramMap
      .subscribe((paramMap: ParamMap) => {
        const employeeID = paramMap.get('id');
        // get the employee
        this.employeeService
          .getById(employeeID)
          .subscribe(
            res => {
              // store the employee data inside
              // the component
              this.employee = res.employee;
              console.log(res.message);

              // get the employee's department
              this.departmentService
                .getById('' + this.employee.departmentId)
                .subscribe(
                  res => {
                    // store the department data
                    // in the component
                    this.department = res.department;
                    console.log(res.message);

                    // get the employee's job history
                    // that has been in
                    this.employeeService
                      .getEmployeeJobHistory(this.employee.id)
                      .subscribe(
                        res => {
                          this.jobHistory = res.jobHistory
                          // convert the value createdAt
                          // into a date
                            .map(job => {
                              job.createdAt = new Date(job.createdAt);
                              return job;
                            })
                          // sort the values of the array
                          // from the most recent
                          //  to least recent job position
                            .sort((firstJob, secondJob) => {
                              return secondJob.createdAt - firstJob.createdAt;
                            });
                          this.currentJobPosition = this.jobHistory.filter(
                            job => {
                              return job.current === 1;
                            }
                          );
                        },
                        err => console.log(err.message)
                      );

                  },
                  err => this.messageFromServer = err.message
                )
            },
            err => this.messageFromServer = err.message
          )
      })
  }

}
