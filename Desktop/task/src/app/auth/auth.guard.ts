import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, Subscription, Subject } from 'rxjs';
import { AuthService } from './auth.service';
import { Store } from '@ngrx/store';
import { User } from '../store/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  isAuth: boolean;
  constructor(
    private authService: AuthService,
    private router: Router
  ) {
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    this.isAuth = false;
    const token = this.authService.getToken();

    if (token) { this.isAuth = true; }
    if (!this.isAuth) { this.router.navigate(['/login']); }

    return this.isAuth;
  }

}
