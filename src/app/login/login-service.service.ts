import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {
  tokenSessionStorageConst = 'token';
  loggedOn = false;
  loginEvent: EventEmitter<string>;
  constructor(private httpClient: HttpClient) {
    this.loginEvent = new EventEmitter<string>();
    if (sessionStorage.getItem(this.tokenSessionStorageConst)) {
      this.loggedOn = true;
    }
  }

  isAdmin() {
    let promise = new Promise<boolean>((resolve, reject) => {
      let apiURL = `${environment.apiUrl}`;
      this.httpClient.get(apiURL + '/user/isAdmin').toPromise()
        .then(
          res => {
            resolve(res['isAdmin']);
          }
        ).catch(ex => {
          reject('Error logging in')
        });
    });
    return promise;
  }

  logIn(username: string, password: string) {
    const loginInfo = { username: username, password: password }
    let promise = new Promise<string>((resolve, reject) => {
      let apiURL = `${environment.apiUrl}`;
      this.httpClient.post(apiURL + '/user/login', loginInfo, { headers: {} }).toPromise()
        .then(
          res => {
            const token = res['token']
            sessionStorage.setItem('token', token);
            sessionStorage.setItem('userId', username);
            this.loginEvent.next('');
            resolve(token);

          }
        ).catch(ex => {
          reject('Error logging in')
        });
    });
    return promise;
  }
}
