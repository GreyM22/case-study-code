import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { DepartmentService } from 'src/app/department/department.service';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Department } from 'src/app/department/department.model';
import { CustomValidators } from '../../validators/custom-validators';
import { Admin } from '../admin.model';

@Component({
  selector: 'app-create-admin',
  templateUrl: './create-admin.component.html',
  styleUrls: ['./create-admin.component.css']
})
export class CreateAdminComponent implements OnInit {
  createAdmin: FormGroup;
  messageFromServer: string;
  departmentsList: Department[];
  // in case we are editing
  // the data of one admin
  editMode: boolean;
  adminId: number;

  constructor(
    private authService: AuthService,
    private departmentService: DepartmentService,
    private router: ActivatedRoute,
    private _router: Router,
    private formBuilder: FormBuilder
  ) {
    this.creteForm();
  }

  ngOnInit() {

    this.departmentService
      .getAll(null, null)
      .subscribe(
        res => {
          this.departmentsList = res.departments;
          console.log(res.message);
        },
        err => {
          console.log(err.message);
        }
      );

    this.router.paramMap
      .subscribe((paramMap: ParamMap) => {
        if (paramMap.has('id')) {
          this.editMode = true;
          this.adminId = +paramMap.get('id');
          this.authService
            .getAdmin(this.adminId)
            .subscribe(
              res => {
                const admin: Admin = res.admin;
                this.createAdmin = new FormGroup({
                  name: new FormControl(admin.name, [Validators.required, Validators.minLength(4)]),
                  surname: new FormControl(admin.surname, [Validators.required, Validators.minLength(4)]),
                  email: new FormControl(admin.email, [Validators.required, Validators.email]),
                  password: new FormControl(null, [
                    // check whether the entered password has a number
                    CustomValidators.patternValidator(/\d/, {
                      hasNumber: true
                    }),
                    // check whether the entered password has upper case letter
                    CustomValidators.patternValidator(/[A-Z]/, {
                      hasCapitalCase: true
                    }),
                    // check whether the entered password has a lower case letter
                    CustomValidators.patternValidator(/[a-z]/, {
                      hasSmallCase: true
                    }),
                    // check whether the entered password has a special character
                    CustomValidators.patternValidator(
                      /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
                      {
                        hasSpecialCharacters: true
                      }
                    ),
                    Validators.minLength(8)
                  ]),
                  confirmPassword: new FormControl(null, [Validators.minLength(8)]),
                  departmentId: new FormControl(admin.departmentId, Validators.required)
                });
              },
              err => console.log(err.message)
            );
        } else {
          this.createAdmin = new FormGroup({
            name: new FormControl(null, [Validators.required, Validators.minLength(4)]),
            surname: new FormControl(null, [Validators.required, Validators.minLength(4)]),
            email: new FormControl(null, [Validators.required, Validators.email]),
            password: new FormControl(null, [Validators.required,
            // check whether the entered password has a number
            CustomValidators.patternValidator(/\d/, {
              hasNumber: true
            }),
            // check whether the entered password has upper case letter
            CustomValidators.patternValidator(/[A-Z]/, {
              hasCapitalCase: true
            }),
            // check whether the entered password has a lower case letter
            CustomValidators.patternValidator(/[a-z]/, {
              hasSmallCase: true
            }),
            // check whether the entered password has a special character
            CustomValidators.patternValidator(
              /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
              {
                hasSpecialCharacters: true
              }
            ),
            Validators.minLength(8)
            ]),
            confirmPassword: new FormControl(null, [Validators.required, Validators.minLength(8)]),
            departmentId: new FormControl(null, Validators.required)
          });
        }
      });

  }

  creteForm() {
    this.createAdmin = this.formBuilder.group({
      name: '',
      surname: '',
      email: '',
      password: '',
      confirmPassword: '',
      departmentId: 0
    });
  }

  get name() { return this.createAdmin.get('name'); }

  get surname() { return this.createAdmin.get('surname'); }

  get email() { return this.createAdmin.get('email'); }

  get password() { return this.createAdmin.get('password'); }

  get confirmPassword() { return this.createAdmin.get('confirmPassword'); }

  get departmentId() { return this.createAdmin.get('departmentId'); }

  onSubmit() {
    if (this.createAdmin.invalid) {
      this.messageFromServer = 'Data entered is invalid';
      return;
    }
    const adminData = this.createAdmin.value;
    if (this.editMode) {
      this.authService.updateAdmin(
        this.adminId,
        adminData.name,
        adminData.surname,
        adminData.email,
        adminData.password,
        adminData.departmentId
      );
      return;
    }
    this.authService.createUser(
      adminData.name,
      adminData.surname,
      adminData.email,
      adminData.password,
      adminData.departmentId
    );
  }

}
