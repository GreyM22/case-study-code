import { Component } from '@angular/core';
import { User } from './store/auth';
import { Store } from '@ngrx/store';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'task';
  constructor(
    private store: Store<{user: User}>,
    private authService: AuthService
  ) {
    store.subscribe(
      res => {
        const employeesId = res.user.employeesId;
        const positionsId = res.user.positionsId;
        authService.setPositionsId(positionsId);
        authService.setEmployeesId(employeesId);
      }
    )
  }
}
