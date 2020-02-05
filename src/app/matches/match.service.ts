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

  //recursive call, could get problematic if there are too many pages but should be fine. 
  //todo look into how to do this without recursion.
  getUserMatches(matches: Match[] = [], lastEvaludatedKey: string = '') {

    let apiURL = `${environment.apiUrl}`;
    let lastEvaludatedKeyParam = '';
    if (lastEvaludatedKey) {
      lastEvaludatedKeyParam = `?exclusiveStartKey=${lastEvaludatedKey}`
    }
    return this.httpClient.get(`${apiURL}/match/mine${lastEvaludatedKeyParam}`).toPromise()
      .then(
        (res: any) => {
          res.matches.forEach(date => { matches.push(date) });

          if (res.LastEvaluatedKey) {
            return this.getUserMatches(matches, res.LastEvaluatedKey.Id);
          }
          else {
            return matches;
          }
        }
      );
  }
}
