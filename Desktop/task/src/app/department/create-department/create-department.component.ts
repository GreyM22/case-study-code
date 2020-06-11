import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { DepartmentService } from '../department.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Employee } from 'src/app/employee/employee.model';

@Component({
  selector: 'app-create-department',
  templateUrl: './create-department.component.html',
  styleUrls: ['./create-department.component.css']
})
export class CreateDepartmentComponent implements OnInit {

  // variable for the validation of the form
  departmentForm: FormGroup;
  // message after sending request to the server
  messageFromServer: string;
  // check if we are editing a department not creating new one
  editMode: boolean;
  // department id in the url, in case we are editing
  departmentId: string;

  constructor(
    private departmentService: DepartmentService,
    private router: ActivatedRoute,
    private _router: Router,
    private formBuilder: FormBuilder
    ) {
    this.creteForm();
  }

  creteForm() {
    this.departmentForm = this.formBuilder.group({
      name: '',
      description: ''
    });
  }

  ngOnInit() {
    this.router.paramMap
      .subscribe((paramMap: ParamMap) => {
        if (paramMap.has('id')) {
          this.editMode = true;
          this.departmentId = paramMap.get('id');
          this.departmentService
            .getById(this.departmentId)
            .subscribe(
              res => {
                this.departmentForm = new FormGroup({
                  name: new FormControl(res.department.name, [
                    Validators.required,
                    Validators.minLength(4)
                  ]),
                  description: new FormControl(res.department.description, [
                    Validators.required,
                    Validators.minLength(50)
                  ])
                });
              },
              err => console.log(err)
            );
        } else {
          this.departmentForm = new FormGroup({
            name: new FormControl('', [
              Validators.required,
              Validators.minLength(4)
            ]),
            description: new FormControl('', [
              Validators.required,
              Validators.minLength(50)
            ])
          });
        }
      });
  }

  get name() { return this.departmentForm.get('name'); }

  get description() { return this.departmentForm.get('description'); }


  onSubmit() {
    if (this.departmentForm.valid) {
      // check if it is being edit a new department
      if (this.editMode) {
        return this.departmentService
          .update(
            this.departmentId,
            this.departmentForm.value.name,
            this.departmentForm.value.description
          )
          .subscribe(
            res => {
              console.log(res.message);
              this._router.navigate(['/']);
            },
            err => this.messageFromServer = err.message
          );
      }
      // pass the data te the service
      this.departmentService.post(
        this.departmentForm.value.name,
        this.departmentForm.value.description
      )
        // subscribe to check if succeeded
        .subscribe(
          res => {
            this.messageFromServer = res.message;
            this.departmentForm.reset();
          },
          err => this.messageFromServer = err.message
        );
    }
  }
}
