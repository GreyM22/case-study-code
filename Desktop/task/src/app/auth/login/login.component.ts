import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { IsLoading, startLoading } from 'src/app/store/isLoading';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required, Validators.minLength(5)])
  });
  messageFromServer: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingStore: Store<IsLoading>
  ) { }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }

  ngOnInit() {
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.messageFromServer = 'The data entered is invalid';
      return;
    }
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
    const url = this.router.url;
    this.loadingStore.dispatch(startLoading());
    if (url === '/auth/login/super-admin') {
      this.authService.loginSuperAdmin(email, password);
    } else {
      this.authService.login(email, password);
    }

  }

}
