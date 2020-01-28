import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Event, EventDate } from '../event/event';
import { Account } from '../Account/Account';


@Injectable({
  providedIn: 'root'
})
export class EventAdminService {
  
  
 
  constructor(private httpClient: HttpClient) { }
  getEvents() {
    let promise = new Promise<Event[]>((resolve, reject) => {
      let apiURL = `${environment.apiUrl}`;
      this.httpClient.get(apiURL + '/event').toPromise()
        .then(
          res => {
            resolve(res as Event[]);
          }
        ).catch(ex => {
          reject('Error getting users')
        });
    });
    return promise;
  }
  getEventSchedule(eventId:string) {
    let promise = new Promise<EventDate[]>((resolve, reject) => {
      let apiURL = `${environment.apiUrl}`;
      this.httpClient.get(`${apiURL}/schedule/event/${eventId}`).toPromise()
        .then(
          res => {
            resolve(res as EventDate[]);
          }
        ).catch(ex => {
          reject('Error getting users')
        });
    });
    return promise;
  }


  removeUsersFromEvent(selectedEvent: Event, usersToRemove: Account[]) {
    let promise = new Promise<Event[]>((resolve, reject) => {
      let apiURL = `${environment.apiUrl}`;
      const httpOptions = {
        body: {
          id: selectedEvent.Id,
          users: usersToRemove.map(x => x.Id)
        }
      }
      this.httpClient.request('delete', apiURL + '/event/users', httpOptions
      ).toPromise()
        .then(
          res => {
            resolve(res as Event[]);
          }
        ).catch(ex => {
          reject('Error removing users from event')
        });
    });
    return promise;
  }
  addUsersToEvent(selectedEvent: Event, usersToAdd: Account[]) {
    let promise = new Promise<Event[]>((resolve, reject) => {
      let apiURL = `${environment.apiUrl}`;
      this.httpClient.put(apiURL + '/event/users',
        {
          id: selectedEvent.Id,
          users: usersToAdd.map(x => x.Id)
        }).toPromise()
        .then(
          res => {
            resolve(res as Event[]);
          }
        ).catch(ex => {
          reject('Error adding users to event')
        });
    });
    return promise;
  }
  createEventSchedule(eventId: string) {
    let promise = new Promise<EventDate[]>((resolve, reject) => {
      let apiURL = `${environment.apiUrl}`;
      this.httpClient.post(`${apiURL}/schedule/event/${eventId}`, null).toPromise()
        .then(
          res => {
            resolve();
          }
        ).catch(ex => {
          reject('Error creating event schedule')
        });
    });
    return promise;
  }

  finalizeSchedule(eventId: string) {
    let promise = new Promise<EventDate[]>((resolve, reject) => {
      let apiURL = `${environment.apiUrl}`;
      this.httpClient.put(`${apiURL}/schedule/event/${eventId}/finalize`, null).toPromise()
        .then(
          res => {
            resolve();
          }
        ).catch(ex => {
          reject('Error finalizing event schedule')
        });
    });
    return promise;
  }

  openEvent(eventId: string) {
    let promise = new Promise<EventDate[]>((resolve, reject) => {
      let apiURL = `${environment.apiUrl}`;
      this.httpClient.put(`${apiURL}/event/${eventId}/open`, null).toPromise()
        .then(
          res => {
            resolve();
          }
        ).catch(ex => {
          reject('Error opening event')
        });
    });
    return promise;
  }
 
}
