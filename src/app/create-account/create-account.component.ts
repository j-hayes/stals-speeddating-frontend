import { Component, OnInit } from '@angular/core';
import { Account } from '../account/account';
import { CreateAccountService } from './create-account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {

  account: Account;
  errorMessage: string;
  confirmPasswordValue: string
  constructor(private createAccountService: CreateAccountService, private router: Router) { }

  ngOnInit() {
    this.account = new Account();
  }

  create() {
    var allFieldsFilledOut = this.account.allFieldsFilledOut();
    if (!allFieldsFilledOut) {
      this.errorMessage = 'please fill out all required fields'
      return;
    }
    if(this.account.age < this.account.minDateAge){
      this.errorMessage = 'Min date age can not be greater than your age.';
      return;
    }
    if(this.account.age > this.account.maxDateAge){
      this.errorMessage = 'Max date age can not be less than your age.';
      return;
    }
    if (this.confirmPasswordValue !== this.account.password) {
      this.errorMessage = 'password and confirmation do not match';
      return;
    }
    if(this.account.password.length < 10){
      this.errorMessage = 'password must be 10 or more characters';
      return;
    }
    this.createAccountService.createAccount(this.account).then(x => {
      this.router.navigateByUrl('/login?accountCreation=true');
    }  // navigate to home
    ).catch(msg => {
      this.errorMessage = msg;
    }
    );
  }
}
