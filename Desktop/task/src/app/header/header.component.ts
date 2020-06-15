import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { IsLoading, startLoading } from '../store/isLoading';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  // message for the user
  message: string;
  // validation for the search form
  searchForm = new FormGroup({
    searchParam: new FormControl('', [
      Validators.required
    ])
  });

  constructor(
    private router: Router,
    public authService: AuthService,
    private loadingStore: Store<IsLoading>
  ) {

  }

  ngOnInit() {
  }

  searchEmployee() {
    if (this.searchForm.invalid) {
      this.message = 'Pleas write something before searching!';
      return;
    }
    const searchParam = this.searchForm.value.searchParam;
    // check if it has only white spaces
    if (!searchParam.replace(/\s/g, '').length) { return; }
    this.loadingStore.dispatch(startLoading());
    this.router.navigate(['/employees/search-employee', searchParam]);
  }

  ngOnDestroy() {
  }
}
