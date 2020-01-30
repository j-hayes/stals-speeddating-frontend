import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Account } from '../account/account';
import { Match } from './match';

@Injectable({
  providedIn: 'root'
})
export class MatchService {

  constructor(private httpClient: HttpClient) {

  }

  submitMatches(matches: Match[]) {
    let promises = [];
    matches.forEach(match => {
      let promise = new Promise((resolve, reject) => {
        let apiURL = `${environment.apiUrl}`;
        this.httpClient.post(apiURL + '/match', match).toPromise()
          .then(
            res => {
              resolve();
            }
          ).catch(ex => {
            reject('Error getting users')
          });
      });
      promises.push(promise);
    });
    return Promise.all(promises);
  }

  
  getUserMatches(){
    let promise = new Promise<Match[]>((resolve, reject) => {
      let apiURL = `${environment.apiUrl}`;
      this.httpClient.get(apiURL + `/match/mine`).toPromise()
        .then(
          res => {
            resolve(res as Match[]);
          }
        ).catch(ex => {
          reject('Error getting matches initiated by user')
        });
    });
    return promise;
  }
}
