import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { Observable, Subject } from 'rxjs';
import { Employee } from './employee.model';
import { Position } from '../job-position/position.model';
import { JobHistory } from './job-history.model';
import { SearchResult } from './search-result.model';

const BACKEND_URL = environment.apiUrl + '/employees';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService { authorized

  private employees: Employee[] = [];
  public employeesUpdated = new Subject<Employee[]>();
  private totalNumberOfEmployees: number;

  constructor(private http: HttpClient, private router: Router) { }

  getTotalNumberOfEmployees() {
    return this.totalNumberOfEmployees;
  }

  postEmployee(
    employeeName: string,
    employeeSurname: string,
    employeeAddress: string,
    employeeEmail: string,
    employeePhone: string,
    employeeAge: number,
    employeeBirthday: Date,
    employeeJobExperience: string,
    employeePhoto: File,
    employeeCV: File,
    employeeDepartmentId: string,
    employeeJobPosition: string,
    employeePersonalID: string
  ): Observable<any> {
    const formData = new FormData();
    formData.append('name', employeeName);
    formData.append('surname', employeeSurname);
    formData.append('address', employeeAddress);
    formData.append('email', employeeEmail);
    formData.append('phone', employeePhone);
    formData.append('age', employeeAge.toString());
    formData.append('birthday', employeeBirthday.toString());
    formData.append('jobExperience', employeeJobExperience);
    formData.append('personalID', employeePersonalID);
    formData.append('files', employeePhoto);
    formData.append('files', employeeCV);
    formData.append('departmentId', employeeDepartmentId);
    formData.append('jobPosition', employeeJobPosition);
    return this.http.post<{message: string}>(BACKEND_URL, formData);
  }

  editEmployee(
    employeeID: string,
    employeeName: string,
    employeeSurname: string,
    employeeAddress: string,
    employeeEmail: string,
    employeePhone: string,
    employeeAge: number,
    employeeBirthday: Date,
    employeeJobExperience: string,
    employeePhoto: File | string,
    employeeCV: File | string,
    employeeDepartmentId: string,
    employeeJobPosition: string,
    employeePersonalID: string
  ): Observable<any> {
    const formData = new FormData();
    formData.append('employeeID', employeeID);
    formData.append('employeeName', employeeName);
    formData.append('employeeSurname', employeeSurname);
    formData.append('employeeAddress', employeeAddress);
    formData.append('employeeEmail', employeeEmail);
    formData.append('employeePhone', employeePhone);
    formData.append('employeeAge', employeeAge.toString());
    formData.append('employeeBirthday', employeeBirthday.toString());
    formData.append('employeeJobExperience', employeeJobExperience);
    formData.append('personalID', employeePersonalID);
    // if there is no change in the photo
    // pass the data as a string
    if (typeof(employeePhoto) === 'string') {
      formData.append('photo', employeePhoto);
    } else {
      formData.append('files', employeePhoto);
    }
    if (typeof(employeeCV) === 'string') {
      formData.append('cv', employeeCV);
    } else {
      formData.append('files', employeeCV);
    }
    formData.append('departmentId', employeeDepartmentId);
    formData.append('jobPosition', employeeJobPosition);
    return this.http.post<{message: string}>(BACKEND_URL + '/edit', formData);
  }

  getEmployees(departmentID: string, pageNumber: number, pageSize) {
    this.http
      .get<{message: string, employees?: Employee[], totalNumber: number}>
      (BACKEND_URL + '/' + departmentID + '?pageNumber=' + pageNumber + '&pageSize=' + pageSize)
      .subscribe(
        res => {
          console.log(res.message);
          this.employees = res.employees;
          this.totalNumberOfEmployees = res.totalNumber;
          this.employeesUpdated.next([...this.employees]);
        }
      );
  }

  getUpdatedEmployees(): Observable<any> {
    return this.employeesUpdated.asObservable();
  }

  getEmployeeJobPosition(employeeID: string): Observable<any> {
    return this.http.get<{message: string, position?: Position}>(BACKEND_URL + '/jobPosition/' + employeeID)
  }

  getById(id: string): Observable<any> {
    return this.http.get<{message: string; employee?: Employee}>(BACKEND_URL + '/edit/' + id);
  }

  getEmployeeJobHistory(id: string): Observable<any> {
    return this.http
      .get<{message: string; jobHistory: JobHistory[]}>
      (BACKEND_URL + '/job-history/' + id);
  }

  fireEmployee(id: string) {
     this.http
      .get<{message: string}>(BACKEND_URL + '/fire-employee/' + id)
      .subscribe(
        res => {
          this.employees = this.employees.filter(employee => {
            return employee.id !== id
          });
          this.employeesUpdated.next([...this.employees]);
        },
        err => console.log(err.message)
      );
  }

  searchEmployee(searchTerm: string, pageNumber?: number, pageSize?: number): Observable<any> {
    return this.http.get<{message: string; searchResult?: SearchResult[], totalNumber: number}>
    (
      BACKEND_URL +
      '/search/' + searchTerm +
      '?pageNumber=' + pageNumber +
      '&pageSize=' + pageSize
    );
  }

  findFiredEmployee(searchTerm: string, pageNumber?: number, pageSize?: number): Observable<any> {
    console.log      (BACKEND_URL +
      '/search-fired-employees/' + searchTerm +
      '?pageNumber=' + pageNumber +
      '&pageSize=' + pageSize);

    return this.http.get<{message: string; searchResult?: SearchResult[], totalNumber?: number}>
      (BACKEND_URL +
        '/search-fired-employees/' + searchTerm +
        '?pageNumber=' + pageNumber +
        '&pageSize=' + pageSize);
  }

}
