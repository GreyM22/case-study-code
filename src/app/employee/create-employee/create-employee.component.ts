import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Store } from '@ngrx/store';

import { DepartmentService } from 'src/app/department/department.service';
import { PositionService } from 'src/app/job-position/position.service';
import { EmployeeService } from '../employee.service';
import { AuthService } from 'src/app/auth/auth.service';

import { Employee } from '../employee.model';
import { Department } from 'src/app/department/department.model';
import { Position } from 'src/app/job-position/position.model';
import { User } from 'src/app/store/auth';
import { IsLoading, startLoading, stopLoading } from 'src/app/store/isLoading';
import { mimeType } from './mineType.validator';



@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit, OnDestroy {

  // to scroll on top after getting message from server
  @ViewChild('TopCard', { static: true }) TopCard: ElementRef;
  @ViewChild('htmlForm', { static: true }) htmlForm: NgForm;
  employee: Employee;
  departmentEmployees: Employee[];
  employeeForm: FormGroup;
  messageFromServer: string;
  editMode: boolean;
  departments: Department[];
  jobPositions: Position[];
  error: boolean;
  updatedPositions: Subscription;
  imagePreview: string;
  date: Date;
  employeeID: string;
  // for cropping the image
  imageChangedEvent: any = '';
  croppedImage: any = '';
  file: File;

  constructor(
    private departmentService: DepartmentService,
    private positionService: PositionService,
    private employeeService: EmployeeService,
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
    this.employeeForm = this.formBuilder.group({
      name: '',
      surname: '',
      address: '',
      email: '',
      phone: '',
      age: 0,
      birthday: '',
      jobExperience: '',
      photo: [null, Validators.required],
      cv: [null, Validators.required],
      departmentId: 0,
      positionId: 0
    });
  }

  get name() { return this.employeeForm.get('name'); }

  get surname() { return this.employeeForm.get('surname'); }

  get address() { return this.employeeForm.get('address'); }

  get email() { return this.employeeForm.get('email'); }

  get phone() { return this.employeeForm.get('phone'); }

  get age() { return this.employeeForm.get('age'); }

  get birthday() { return this.employeeForm.get('birthday'); }

  get jobExperience() { return this.employeeForm.get('jobExperience'); }

  get photo() { return this.employeeForm.get('photo'); }

  get cv() { return this.employeeForm.get('cv'); }

  get personalID() { return this.employeeForm.get('personalID'); }

  get departmentId() { return this.employeeForm.get('departmentId'); }

  get positionId() { return this.employeeForm.get('positionId'); }




  ngOnInit() {
    // set the loading
    this.loadingStore.dispatch(startLoading());
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
              err => console.log(err)
            );
          }

        },
        err => {
          this.error = true;
          this.messageFromServer = err.error.message;
        }
      );

    // set the minimum of age for the employee to be added
    this.date = new Date();
    this.date.setFullYear(this.date.getFullYear() - 18);
    // initialize the form
    this.employeeForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(4)
      ]),
      surname: new FormControl('', [
        Validators.required,
        Validators.minLength(4)
      ]),
      address: new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ]),
      personalID: new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      phone: new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ]),
      age: new FormControl(18, [
        Validators.required,
        Validators.min(18)
      ]),
      birthday: new FormControl(null, {
        validators: [
          Validators.required,
          this.adultCheck()
        ]
      }),
      jobExperience: new FormControl('', [
        Validators.required,
        Validators.minLength(50)
      ]),
      departmentId: new FormControl('', [
        Validators.required
      ]),
      positionId: new FormControl('', [
        Validators.required
      ]),
      photo: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      }),
      cv: new FormControl(null, {})
    });

    // check if we are editing not creating a job position
    this.router.paramMap
      .subscribe((paramMap: ParamMap) => {
        // check if the router has the id of job position
        if (paramMap.has('id')) {
          this.editMode = true;
          this.employeeID = paramMap.get('id');
          this.employeeService
            .getById(this.employeeID)
            .subscribe(
              res => {
                this.employee = res.employee;
                this.employeeForm.setValue({
                  name: this.employee.name,
                  surname: this.employee.surname,
                  address: this.employee.address,
                  personalID: this.employee.personalID,
                  email: this.employee.email,
                  phone: this.employee.phone,
                  age: this.employee.age,
                  birthday: this.employee.birthday,
                  jobExperience: this.employee.jobExperience,
                  departmentId: this.employee.departmentId,
                  positionId: '',
                  photo: this.employee.photo,
                  cv: this.employee.cv
                });
                this.getJobPositionsOfDepartment();
                this.loadingStore.dispatch(stopLoading());
              },
              err => {
                this.loadingStore.dispatch(stopLoading());
                this.messageFromServer = err.error.message;
              }
            );
        } else {
          this.editMode = false;
          this.employeeID = null;
          this.loadingStore.dispatch(stopLoading());
          this.error = true;
        }
      });
  }

  // check if the employee is an adult
  adultCheck() {
    return (): { [key: string]: any } => {
      // check if value of date is empty
      if (this.employeeForm.controls.birthday.value === '' || !this.employeeForm.controls.birthday.value) {
        return {};
      }
      // get the the chosen date
      const dateToString = this.employeeForm.controls.birthday.value;
      const selectedDate = new Date(dateToString);
      // get the year of the employee
      const employeeYearOfBirth = selectedDate.getFullYear();
      // set the age limit
      const today = new Date();
      const thisYear = today.getFullYear();
      const ageLimit = thisYear - 18;
      // check if the employee is older than 18
      if (ageLimit >= employeeYearOfBirth) {
        return {};
      }
      return { dates: 'The employee should be older than 18' };
    };
  }

  getJobPositionsOfDepartment() {
    // get only the number
    const id = this.employeeForm.get('departmentId').value;
    // get all the job position of the department
    // using the department id
    this.positionService.getPositions('' + id);
    // subscribe to service in order to update automatically
    // in case one position is added or deleted
    this.updatedPositions = this.positionService.getUpdatedPositions()
      .subscribe(
        // update the position in the view department component
        (positions: Position[]) => {
          this.jobPositions = positions;
          if (this.editMode) {
            this.employeeForm.controls['positionId'].setValue(this.jobPositions[0].id);
          }
        },
        // inform the user in case of any error
        err => {
          this.messageFromServer = err.error.message;
          this.error = true;
        }
      );
  }

  onSubmit() {
    console.log(this.htmlForm);
    if (this.employeeForm.invalid) {
      console.log(this.employeeForm);
      this.messageFromServer = 'The information filed is invalid to be submitted!';
      this.error = true;
      this.TopCard.nativeElement.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    console.log(this.editMode)
    const employeeData = this.employeeForm.value;
    this.loadingStore.dispatch(startLoading());
    if (this.editMode) {
      this.employeeService.editEmployee(
        this.employee.id,
        employeeData.name,
        employeeData.surname,
        employeeData.address,
        employeeData.email,
        employeeData.phone,
        employeeData.age,
        employeeData.birthday,
        employeeData.jobExperience,
        employeeData.photo,
        employeeData.cv,
        employeeData.departmentId,
        employeeData.positionId,
        employeeData.personalID
      )
        .subscribe(
          res => {
            console.log('editEmployee was called!')
            this.loadingStore.dispatch(stopLoading());
            console.log(res);
            this._router.navigate(['departments/view-department', this.employee.departmentId]);
            return;
          },
          err => {
            this.loadingStore.dispatch(stopLoading());
            this.messageFromServer = err.error.message;
            this.error = true;
            return;
          }
        );
    } else {

      this.employeeService.postEmployee(
        employeeData.name,
        employeeData.surname,
        employeeData.address,
        employeeData.email,
        employeeData.phone,
        employeeData.age,
        employeeData.birthday,
        employeeData.jobExperience,
        employeeData.photo,
        employeeData.cv,
        employeeData.departmentId,
        employeeData.positionId,
        employeeData.personalID
      )
        .subscribe(
          res => {
            console.log('postEmployee was called!')
            this.loadingStore.dispatch(stopLoading());
            this.messageFromServer = res.message;
            this.employeeForm.reset();
            // reset the values of the form in the front-end
            this.htmlForm.form.reset();
            // remove the cropped images
            this.croppedImage = null;
            this.imageChangedEvent = null;
            this.TopCard.nativeElement.scrollIntoView({ behavior: 'smooth' });
            if (this.error) {
              this.error = false;
            }
          },
          err => {
            this.loadingStore.dispatch(stopLoading());
            this.messageFromServer = err.error.message;
            this.error = true;
          }
        );
    }
  }

  onPhotoUpload(event: Event) {
    this.imageChangedEvent = event;
    // get the file from the form
    this.file = (event.target as HTMLInputElement).files[0];

  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    const blob = this.dataURItoBlob(this.croppedImage);
    let finalFile: File = new File([blob], this.file.name, {type: this.file.type});
    // check the type of file
    const fileType = this.file.name.split('.')[1];
    // if type image, save it in the employeeForm
    if (fileType === 'jpg' || fileType === 'png') {
      this.employeeForm.patchValue({
        photo: finalFile
      });
      this.employeeForm.get('photo').updateValueAndValidity();

      const fileReader: FileReader = new FileReader();
      fileReader.readAsDataURL(blob);
      fileReader.onload = () => {
      }
      // if not image, throw error in the form
    } else {
      this.employeeForm.controls['photo'].setErrors({ 'incorrect': true });
    }

  }

  dataURItoBlob(dataURI) {
    const binary = atob(dataURI.split(',')[1]);
    const array = [];
    for (let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {
      type: 'image/png'
    });
  }


  imageLoaded() {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }



  onFileUpload(event: Event) {
    // get the file from the form
    const file: File = (event.target as HTMLInputElement).files[0];
    // check the type of file
    const fileType = file.name.split('.')[1];
    // if type pdf, save it in the employeeForm
    if (fileType === 'pdf') {
      console.log(fileType);
      const fileReader: FileReader = new FileReader();
      this.employeeForm.patchValue({
        cv: file
      });
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
      }
      // if not image, throw error in the form
    } else {
      this.employeeForm.controls['cv'].setErrors({ 'incorrect': true });
    }
  }


  ngOnDestroy() {
    if (this.updatedPositions) {
      this.updatedPositions.unsubscribe();
    }
  }
}
