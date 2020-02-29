import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass'],
})

export class LoginComponent implements OnInit {

  passwordForm = new FormGroup({
    password: new FormControl(''),
  })

  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit(): void {
  }

  onPasswordFormSubmit(): void {
    this.loginService.login(this.passwordForm.get("password").value)
    .pipe(catchError((error)=>{
      console.error('error getting password', error);
      return of();
    }))
    .subscribe((r) => this.router.navigate(["/admin"]));
  }
}
