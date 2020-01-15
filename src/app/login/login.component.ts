import { Component, OnInit } from '@angular/core';
import { LoginServiceService } from './login-service.service';
import { Router, Route, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;
  errorMessage: string;
  constructor(private loginService: LoginServiceService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      var wasAnNewAccountCreation = params.get("accountCreation");
      if(wasAnNewAccountCreation){
        this.errorMessage = 'Account created successfully, you may now log in.';
      }
   
    });
  }
  logIn() {
    this.loginService.logIn(this.username, this.password)
      .then(token => {
        this.router.navigateByUrl('/home')
      }).catch(err => {
        this.errorMessage = 'Login Failure, try again';
      });
  }

}
