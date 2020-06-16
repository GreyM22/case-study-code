import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { DepartmentService } from 'src/app/department/department.service';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Department } from 'src/app/department/department.model';
import { CustomValidators } from '../../validators/custom-validators';
import { Admin } from '../admin.model';
import { Store } from '@ngrx/store';
import { ErrorMessage, showError } from 'src/app/store/error';
import { IsLoading, stopLoading, startLoading } from 'src/app/store/isLoading';

@Component({
  selector: 'app-create-admin',
  templateUrl: './create-admin.component.html',
  styleUrls: ['./create-admin.component.css']
})
export class CreateAdminComponent implements OnInit {
  @ViewChild('TopCard', { static: true }) TopCard: ElementRef;
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
    private formBuilder: FormBuilder,
    private errorStore: Store<ErrorMessage>,
    private loadingStore: Store<IsLoading>
  ) {
    this.creteForm();
  }

  ngOnInit() {

    this.loadingStore.dispatch(startLoading());

    this.departmentService
      .getAll(null, null)
      .subscribe(
        res => {
          this.departmentsList = res.departments;
          console.log(res.message);
        },
        err => {
          this.errorStore.dispatch(showError({ payload: { message: err.error.message } } ))
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
                this.loadingStore.dispatch(stopLoading());
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
              err => this.errorStore.dispatch(showError({ payload: { message: err.error.message } } ))
            );
        } else {
          this.loadingStore.dispatch(stopLoading());
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
      this.TopCard.nativeElement.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    this.loadingStore.dispatch(startLoading());
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
