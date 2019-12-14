import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {

  constructor(private httpClient: HttpClient){

  }
  logIn(username: string, password: string) {
    const loginInfo = { username: username, password: password }
    let promise = new Promise<string>((resolve, reject) => {
      let apiURL = `${environment.apiUrl}`;
      this.httpClient.post(apiURL + '/user/login', loginInfo, { headers: {} }).toPromise()
        .then(
          res => {
            resolve(res['token']);
          }
        ).catch(ex => {
          reject('Error logging in')
        });
    });
    return promise;
  }
}
