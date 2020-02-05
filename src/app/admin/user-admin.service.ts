import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Account } from '../account/account';
import { EventDate } from '../event/event';

@Injectable({
  providedIn: 'root'
})
export class UserAdminService {


  constructor(private httpClient: HttpClient) {

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

  getUserDates() {
    let promise = new Promise<EventDate[]>((resolve, reject) => {
      let apiURL = `${environment.apiUrl}`;
      this.httpClient.get(apiURL + `/dates/mine`).toPromise()
        .then(
          res => {
            resolve(res as EventDate[]);
          }
        ).catch(ex => {
          reject('Error getting dates for user')
        });
    });
    return promise;
  }

  resetPassword(username: string, password: string): Promise<any> {
    let promise = new Promise<any>((resolve, reject) => {
      let apiURL = `${environment.apiUrl}`;
      const body = { username: username, newPassword: password }
      this.httpClient.put(apiURL + `/user/admin/resetPassword`, body).toPromise()
        .then(
          res => {
            resolve();
          }
        ).catch(ex => {
          reject('Error getting dates for user')
        });
    });
    return promise;
  }

}
