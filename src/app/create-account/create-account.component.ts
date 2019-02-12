import { Component, OnInit } from '@angular/core';
import { Account } from '../../account/account';
import { CreateAccountService } from './create-account.service';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {

  account: Account;
  errorMessage: string;
  constructor(private createAccountService: CreateAccountService) { }

  ngOnInit() {
    this.account = new Account();
  }

  create() {
    this.createAccountService.createAccount(this.account).then(x =>  
    { 
      this.errorMessage = 'successfully created account' }  // navigate to home
    ).catch(msg => {
      this.errorMessage = msg;
    }
    );
  }
}
