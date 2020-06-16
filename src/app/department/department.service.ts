import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Department } from './department.model';


const BACKEND_URL = environment.apiUrl + '/departments';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {


  constructor(private http: HttpClient, private router: Router) { }

  // create a new department
  post(nameData: string, descriptionData: string): Observable<any> {
    // create department object
    const department: Department = {
      id: null,
      name: nameData,
      description: descriptionData,
      creatAt: null,
      updateAt: null,
      employeeId: null
    };
    // pas the data to the server
    return this.http.post<{message: string}>(BACKEND_URL, department);
  }

  getAll(pageNumber: number, pageSize: number): Observable<any> {
    console.log(BACKEND_URL + '?pageNumber=' + pageNumber + '&pageSize=' + pageSize);
    return this.http.get<{message: string, departments: Department[], totalNumber: number}>
    (BACKEND_URL + '?pageNumber=' + pageNumber + '&pageSize=' + pageSize);
  }

  getById(id: string): Observable<any> {
    return this.http.get<{message: string, department: Department}>(BACKEND_URL + '/' + id);
  }

  update(updatedId: string, updatedName: string, updatedDescription: string): Observable<any> {
    const department = {
      id: updatedId,
      name: updatedName,
      description: updatedDescription,
      employeeId: null
    };
    return this.http.post<{message: string}>(BACKEND_URL + '/' + updatedId, department);
  }

  deleteById(id: string): Observable<any> {
    return this.http.delete<{message: string}>(BACKEND_URL + '/' + id);
  }

}
