import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import {Account} from '../../account/account';

@Injectable({
  providedIn: 'root'
})
export class UserAdminServiceService {

  constructor(private httpClient: HttpClient){

  }
  getUsers() {
    let promise = new Promise<Account[]>((resolve, reject) => {
      let apiURL = `${environment.apiUrl}`;
      this.httpClient.get(apiURL + '/user').toPromise()
        .then(
          res => {
            resolve(res as Account[]);
          }
        ).catch(ex => {
          reject('Error getting users')
        });
    });
    return promise;
  }
}
