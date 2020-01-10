import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {

  loginEvent : EventEmitter<string>;
  constructor(private httpClient: HttpClient){
    this.loginEvent = new EventEmitter<string>();
  }

  isAdmin(){
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
            resolve(res['token']);
            this.loginEvent.next('');
          }
        ).catch(ex => {
          reject('Error logging in')
        });
    });
    return promise;
  }
}
