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
    if (this.confirmPasswordValue !== this.account.password) {
      this.errorMessage = 'password and confirmation do not match';
      return;
    }
    this.createAccountService.createAccount(this.account).then(x => {
      this.router.navigateByUrl('/login');
    }  // navigate to home
    ).catch(msg => {
      this.errorMessage = msg;
    }
    );
  }
}
