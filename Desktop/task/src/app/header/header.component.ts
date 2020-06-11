import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

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
    public authService: AuthService
  ) {

  }

  ngOnInit() {
  }

  searchEmployee() {
    if (this.searchForm.invalid) {
      this.message = 'Pleas write something before searching!';
      return;
    }
    this.router.navigate(['/search-employee', this.searchForm.value.searchParam]);
  }

  ngOnDestroy() {
  }
}
