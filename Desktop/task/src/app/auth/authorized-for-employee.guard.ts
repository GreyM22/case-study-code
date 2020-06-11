import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthorizedForEmployeeGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const isSuperAdmin = this.authService.isSuperAdmin();
    if (isSuperAdmin) { return isSuperAdmin; }


    const employeeId = +next.params.id;
    const isAuthorized = this.authService.isAuthorizedForEmployee(employeeId);
    if (!isAuthorized) { this.router.navigate(['/']); }
    return isAuthorized;
  }

}
