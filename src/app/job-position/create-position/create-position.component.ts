import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';

import { PositionService } from '../position.service';
import { DepartmentService } from 'src/app/department/department.service';
import { Department } from 'src/app/department/department.model';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/store/auth';
import { Store } from '@ngrx/store';
import { IsLoading, startLoading, stopLoading } from 'src/app/store/isLoading';

@Component({
  selector: 'app-create-position',
  templateUrl: './create-position.component.html',
  styleUrls: ['./create-position.component.css']
})
export class CreatePositionComponent implements OnInit {

  // variable for the validation of the form
  positionForm: FormGroup;
  // message after sending request to the server
  messageFromServer: string;
  // check if an error occurred
  error: boolean;
  // check if we are editing a department not creating new one
  editMode: boolean;
  // department id in the url, in case we are editing
  positionId: string;
  // array of departments, to get their 'id'
  departments: Department[];

  constructor(
    private departmentService: DepartmentService,
    private positionService: PositionService,
    private router: ActivatedRoute,
    private _router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private store: Store<{ user: User }>,
    private loadingStore: Store<IsLoading>
  ) {
    this.creteForm();
  }

  creteForm() {
    this.positionForm = this.formBuilder.group({
      name: '',
      description: '',
      departmentId: ''
    });
  }

  get name() { return this.positionForm.get('name'); }

  get description() { return this.positionForm.get('description'); }


  ngOnInit() {
    // set loading
    this.loadingStore.dispatch(startLoading());
    // check if we are editing not creating a job position
    this.router.paramMap
      .subscribe((paramMap: ParamMap) => {
        // check if the router has the id of job position
        if (paramMap.has('id')) {
          this.editMode = true;
          this.positionId = paramMap.get('id');
          this.positionService
            .getById(this.positionId)
            .subscribe(
              res => {
                this.loadingStore.dispatch(stopLoading());
                const position = res.position;
                // initialize the form
                // with the position data to be edited
                this.positionForm = new FormGroup({
                  name: new FormControl(position.name, [
                    Validators.required,
                    Validators.minLength(4)
                  ]),
                  description: new FormControl(position.description, [
                    Validators.required,
                    Validators.minLength(50)
                  ]),
                  departmentId: new FormControl(position.departmentId, [
                    Validators.required
                  ])
                });
              },
              err => {
                this.loadingStore.dispatch(stopLoading());
                this.messageFromServer =  err.error.message;
                this.error = true;
              }
            );
        } else {
          this.loadingStore.dispatch(stopLoading());
          // initialize the form
          this.positionForm = new FormGroup({
            name: new FormControl('', [
              Validators.required,
              Validators.minLength(4)
            ]),
            description: new FormControl('', [
              Validators.required,
              Validators.minLength(50)
            ]),
            departmentId: new FormControl('', [
              Validators.required
            ])
          });
        }
      });

    // get all available id of the departments
    this.departmentService
      .getAll(null, null)
      .subscribe(
        res => {
          this.departments = res.departments;

          // in case a department admin is logged in
          // add job only for the department he belongs

          if (!this.authService.isSuperAdmin()) {
            this.store.subscribe(
              storeRes => {
                const adminDepartment = storeRes.user.departmentId;
                this.departments = this.departments.filter(department => +department.id === adminDepartment);
              },
              err => {
                this.messageFromServer = err.error.message;
                this.error = true;
              }
            );
          }
        },
        err => {
          this.error = true;
          this.messageFromServer = err.error.message;
        }
      );

  }

  onSubmit() {
    if (!this.positionForm.valid) {
      return;
    }

    this.loadingStore.dispatch(startLoading());
    if (this.editMode) {
      // send request to the server to update
      // the value of the position form
      return this.positionService
        .updatePosition(
          this.positionForm.value.departmentId,
          this.positionId,
          this.positionForm.value.name,
          this.positionForm.value.description
        )
        .subscribe(
          res => {
            this.loadingStore.dispatch(stopLoading());
            // display server in the console log
            console.log(res.message);
            // navigate back to the department view
            this._router.navigate([
              '/departments/view-department',
              this.positionForm.value.departmentId
            ]);
          },
          err => {
            this.loadingStore.dispatch(stopLoading());
            this.error = true;
            this.messageFromServer = err.error.message;
            return;
          }
        );
    }
    // if we are not in edit mode
    // create a new position
    const name = this.positionForm.value.name;
    const description = this.positionForm.value.description;
    const departmentId = this.positionForm.value.departmentId;

    this.positionService
      .postPosition(name, description, departmentId)
      .subscribe(
        res => {
          this.loadingStore.dispatch(stopLoading());
          this.error = false;
          this.messageFromServer = res.message;
          this.positionForm.reset();
        },
        err => {
          this.loadingStore.dispatch(stopLoading());
          this.error = true;
          this.messageFromServer = err.error.message;
        }
      );
  }

}
