import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { Admin } from './admin.model';
import { errorFeatureKey, ErrorMessage, showError } from '../store/error';
import { Role } from './role';

import { logUser, logoutUser, User, authFeatureKey } from '../store/auth';
import { Store } from '@ngrx/store';
import { IsLoading, stopLoading, startLoading } from '../store/isLoading';

const BACKEND_URL = environment.apiUrl + '/auth';
const localStorageTokenName = 'token';
const localStorageUserRoleName = 'userRole';
const localStorageDepartmentIdName = 'departmentId';
const localStoragePositionsIdName = 'positionsId';
const localStorageEmployeesIdName = 'employeesId';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tokenTimer: any;
  private employeesId: number[];
  private positionsId: number[];

  constructor(
    private http: HttpClient,
    private router: Router,
    private storeAuth: Store<User>,
    private storeErrorMessage: Store<{ [errorFeatureKey]: ErrorMessage }>,
    private storeLoading: Store<IsLoading>
  ) {
    // get the data from the localStorage
    const token = localStorage.getItem(localStorageTokenName);
    const role = localStorage.getItem(localStorageUserRoleName);
    const departmentId = +localStorage.getItem(localStorageDepartmentIdName);
    const positionsIdString: string = localStorage.getItem(localStoragePositionsIdName);
    let positionsId: number[];
    let employeesId: number[];
    if (positionsIdString) {
      const positionsIdStringArray: string[] = positionsIdString.split(',');
      positionsId = positionsIdStringArray.map(positionId => +positionId);
    } else {
      positionsId = null;
    }
    const employeesIdString: string = localStorage.getItem(localStorageEmployeesIdName);
    if (employeesIdString) {
      const employeesIdStringArray: string[] = employeesIdString.split(',');
      employeesId = employeesIdStringArray.map(employeeId => +employeeId);
    } else {
      employeesId = null;
    }
    storeAuth.dispatch(logUser({ payload: { token, role, departmentId, positionsId, employeesId } }));
  }

  setPositionsId(array: number[]) {
    this.positionsId = array;
  }

  setEmployeesId(array: number[]) {
    this.employeesId = array;
  }

  isLoggedIn() {
    return !!this.getToken();
  }

  isAuthorized(departmentId: number | string) {
    if (typeof departmentId === 'string') {
      return +departmentId === +localStorage.getItem(localStorageDepartmentIdName);
    }
    return departmentId === +localStorage.getItem(localStorageDepartmentIdName);
  }

  isAuthorizedForPosition(positionId: number) {
    return this.positionsId.indexOf(positionId) !== -1;
  }

  isAuthorizedForEmployee(employeeId: number) {
    return this.employeesId.indexOf(employeeId) !== -1;
  }

  isAuthenticated(token: string | null) {
    return typeof token === 'string';
  }

  isSuperAdmin() {
    const localStorageRole = localStorage.getItem(localStorageUserRoleName);
    return localStorageRole === Role.SuperAdmin;
  }

  getToken() {
    return localStorage.getItem(localStorageTokenName);
  }


  login(emailUser: string, passwordUser: string) {
    this.http.post<{
      token: string,
      expiresIn: number,
      departmentId: number,
      role: string,
      positionsId: number[],
      employeesId: number[]
    }>
      (BACKEND_URL, { email: emailUser, password: passwordUser })
      .subscribe(
        res => {
          this.storeLoading.dispatch(startLoading());
          this.setToken(
            res.token,
            res.expiresIn,
            res.departmentId,
            res.role,
            res.positionsId,
            res.employeesId
          );
        },
        err => {
          this.storeErrorMessage.dispatch(showError({ payload: { message: err.message } }));
        }
      );
  }

  loginSuperAdmin(emailUser: string, passwordUser: string) {
    this.http
      .post<{
        token: string,
        expiresIn: number,
        departmentId: number,
        role: string,
        positionsId: number[],
        employeesId: number[]
      }>
      (BACKEND_URL + '/super-admin', { email: emailUser, password: passwordUser })
      .subscribe(
        res => {
          this.storeLoading.dispatch(stopLoading())
          this.setToken(
            res.token,
            res.expiresIn,
            res.departmentId,
            res.role,
            res.positionsId,
            res.employeesId
          );
        },
        err => this.storeErrorMessage.dispatch(showError({ payload: { message: err.message } }))
      );
  }


  private setToken(
    token: string,
    expiresIn: number,
    departmentId: number,
    role: string,
    positionsId: number[],
    employeesId: number[]
  ) {
    localStorage.setItem(localStorageTokenName, token);
    localStorage.setItem(localStorageDepartmentIdName, '' + departmentId);
    localStorage.setItem(localStorageUserRoleName, role);
    if (positionsId) {
      localStorage.setItem(localStoragePositionsIdName, positionsId.toString());
    } else {
      localStorage.setItem(localStoragePositionsIdName, null);
    }
    if (employeesId) {
      localStorage.setItem(localStorageEmployeesIdName, employeesId.toString());
    } else {
      localStorage.setItem(localStorageEmployeesIdName, null);
    }
    this.storeAuth.dispatch(logUser({ payload: { token, role, departmentId, positionsId, employeesId } }));

    const expireDuration = expiresIn;
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, expireDuration * 1000);
    this.router.navigate(['/home']);
  }

  logout() {
    localStorage.removeItem(localStorageTokenName);
    localStorage.removeItem(localStorageUserRoleName);
    localStorage.removeItem(localStorageDepartmentIdName);
    localStorage.removeItem(localStoragePositionsIdName);
    localStorage.removeItem(localStorageEmployeesIdName);

    this.storeAuth.dispatch(logoutUser());

    clearTimeout(this.tokenTimer);
  }

  createUser(
    userName: string,
    userSurname: string,
    userEmail: string,
    userPassword: string,
    departmentID: number
  ) {
    const admin: Admin = {
      id: null,
      name: userName,
      surname: userSurname,
      email: userEmail,
      password: userPassword,
      departmentId: departmentID
    };
    this.http
      .post<{ token: string, expiresIn: number, departmentId: number, role: string }>
      (BACKEND_URL + '/create-user', admin)
      .subscribe(
        res => {
          this.storeLoading.dispatch(stopLoading());
          this.router.navigate(['/']);
        },
        err => this.storeErrorMessage.dispatch(showError({ payload: { message: err.message } }))
      );
  }

  getAdmins(departmentId: number): Observable<any> {
    return this.http.get<{ message: string; admins?: Admin[] }>
      (BACKEND_URL + '/users/' + departmentId);
  }

  getAdmin(adminId: number): Observable<any> {
    return this.http.get<{ message: string; admin?: Admin }>
      (BACKEND_URL + '/user/' + adminId);
  }

  updateAdmin(
    id: number,
    name: string,
    surname: string,
    email: string,
    password: string,
    departmentId: number
  ) {
    const admin: Admin = { id, name, surname, email, password, departmentId };
    this.http
      .post<{ message: string; }>(BACKEND_URL + '/edit-user', admin)
      .subscribe(
        res => {
          this.storeLoading.dispatch(stopLoading());
          console.log(res.message);
          this.router.navigate(['/']);
        },
        err => this.storeErrorMessage.dispatch(showError({ payload: { message: err.message } }))
      );
  }

  deleteAdmin(adminId: number): Observable<any> {
    return this.http.delete<{ message: string }>(BACKEND_URL + '/user/' + adminId);
  }

}
