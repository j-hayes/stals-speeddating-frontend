import { Injectable } from '@angular/core';
import { HttpClient } from '../../../node_modules/@angular/common/http';
import { Observable } from '../../../node_modules/rxjs';
import { environment } from '../../environments/environment';
import { Account } from '../account/account';
import { UUID } from 'angular2-uuid';

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
    let promise = new Promise<Account>((resolve, reject) => {
      let apiURL = `${environment.apiUrl}`;
      account.Id = account.email;
      this.httpClient.post(apiURL + '/user', account, { headers: {} }).toPromise()
        .then(
          res => {
            resolve(account);
          }
        ).catch(ex => {
          reject('Error Creating Account')
        });
    });
    return promise;

  }
}
