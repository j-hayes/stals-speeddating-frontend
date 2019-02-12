import { Injectable } from '@angular/core';
import { HttpClient } from '../../../node_modules/@angular/common/http';
import { Observable } from '../../../node_modules/rxjs';
import { environment } from '../../environments/environment';
import {Account} from '../../account/account';
import {UUID} from 'angular2-uuid';

@Injectable({
  providedIn: 'root'
})
export class CreateAccountService {

  constructor(private httpClient: HttpClient) {

  }


  /**
   * createAccount
account:Account    */
  public createAccount(account: Account): Promise<Account> {
    console.log(account);
    console.log('about to send to the the new account');
    let promise = new Promise<Account>((resolve, reject) => {
      let apiURL = `${environment.apiUrl}`;
      account.id = UUID.UUID();
      this.httpClient.post(apiURL + '/user', account, {headers:{}}).toPromise()
        .then(
          res => { 
            console.log('success');
            resolve(account);
          }
        ).catch(ex => 
          {
            console.log(ex);
            reject('Error Creating Account')
          });
    });
    return promise;

  }
}
