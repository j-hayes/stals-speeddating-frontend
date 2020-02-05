import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { UserAdminService } from '../admin/user-admin.service';
import { EventDate, Event } from '../event/event';
import * as _ from 'lodash';
import { Account } from '../account/account'
import { FormGroup, FormControl } from '@angular/forms';
import { MatchService } from '../matches/match.service';
import { Match } from '../matches/match';
import { EventAdminService } from '../admin/event-admin.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  users: Account[];

  events = [];
  userId: string;
  user: Account;
  userIsMale: boolean;
  initiatedMatches: Match[];
  myMatches: Match[];
  openEvents: Event[];
  constructor(private router: Router, private userAdminService: UserAdminService, private matchService: MatchService, private eventService: EventAdminService) { }

  ngOnInit() {
    this.userId = sessionStorage.getItem('userId');
    this.eventService.getEvents().then(allEvents => {
      this.openEvents = allEvents.filter(x => x.open);
      this.matchService.getUserMatches()
        .then(matches => {
          this.initiatedMatches = matches.filter(x => x.initiatingUserId == this.userId);
          this.myMatches = matches.filter(x => x.matchUserId == this.userId);

          this.userAdminService.getUsers().then(users => {
            this.users = users;
            this.user = users.find(u => u.Id === this.userId);

            this.userIsMale = this.user.sex === 'male';
            this.userAdminService.getUserDates().then(userDates => {
              var eventsDict = _.groupBy(userDates, "eventId");
              Object.keys(eventsDict).forEach(key => {

                if (!this.openEvents.find(x => x.Id === key)) {
                  return;
                }

                const eventHasBeenSubmitted = this.initiatedMatches.filter(x => x.eventId === key).length > 0;

                var eventMatches: Account[] = [];
                this.myMatches
                  .filter(x => x.eventId === key && x.matchUserId === this.userId)
                  .forEach(match => {
                    const matchUser = this.users.find(x => x.Id === match.initiatingUserId);
                    if (matchUser) {
                      eventMatches.push(matchUser);
                    }
                  });

                var eventDates = eventsDict[key];
                var users = [];
                const formGroup = new FormGroup({});
                eventDates.forEach(date => {
                  let dateUser: Account;
                  if (this.userIsMale) {
                    dateUser = this.users.find(x => x.Id === date.womanId);
                  }
                  else {
                    dateUser = this.users.find(x => x.Id === date.manId);
                  }
                  users.push(dateUser);
                  formGroup.addControl(`${dateUser.Id}`, new FormControl());
                });

                this.events.push({
                  Id: key,
                  users: users,
                  formGroup: formGroup,
                  eventDates: eventDates,
                  eventHasBeenSubmitted: eventHasBeenSubmitted,
                  eventMatches: eventMatches
                });
              });
            });
          });
        });
    });
  }



  submitEventMatches(event) {
    let matchesToSubmit = [];
    Object.keys(event.formGroup.controls).forEach(key => {
      if (event.formGroup.controls[key].value === true) {
        let date: EventDate;
        if (this.userIsMale) {
          date = event.eventDates.find(x => x.womanId === key);
        }
        else {
          date = event.eventDates.find(x => x.manId === key);
        }
        const match = new Match();
        match.dateId = date.Id;
        match.eventId = event.Id;
        match.matchUserId = key;
        matchesToSubmit.push(match);
      }
    });
    this.matchService.submitMatches(matchesToSubmit)
      .then(x => { location.reload(); })
      .catch(x => { event.errorMessage = 'Failed to upload matches. Please try again'; });
  }
}