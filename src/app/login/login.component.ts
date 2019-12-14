import { Component, OnInit } from '@angular/core';
import { LoginServiceService } from './login-service.service';
import { Router } from '@angular/router';

const tokenSessionStorageConst = 'token';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;
  errorMessage: string;
  constructor(private loginService: LoginServiceService, private router: Router) { }

  ngOnInit() {
  }
  logIn() {
    this.loginService.logIn(this.username, this.password)
      .then(token => {
        sessionStorage.setItem(tokenSessionStorageConst, token);
        this.router.navigateByUrl('/home')
      }).catch(err => {
        this.errorMessage = 'Login Failure, try again '
      });
  }

}
