import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { UserAdminService } from '../admin/user-admin.service';
import { EventDate } from '../event/event';
import * as _ from 'lodash';
import { Account } from '../account/account'
import { FormGroup, FormControl } from '@angular/forms';

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
  constructor(private router: Router, private userAdminService: UserAdminService) { }

  ngOnInit() {
    this.userId = sessionStorage.getItem('userId');
    this.userAdminService.getUsers().then(users => {
      this.users = users;
      this.user = users.find(x => x.Id === this.userId);

      var userIsMale = this.user.sex === 'male';
      this.userAdminService.getUserDates().then(x => {
        var eventsDict = _.groupBy(x, "eventId");
        Object.keys(eventsDict).forEach(key => {
          var eventDates = eventsDict[key];
          var users = [];
          const formGroup = new FormGroup({});
          eventDates.forEach(date => {
            let dateUser: Account;

            if (userIsMale) {
              dateUser = this.users.find(x => x.Id === date.womanId);

            }
            else {
              dateUser = this.users.find(x => x.Id === date.manId);
            }
            users.push(dateUser);
            formGroup.addControl(dateUser.Id, new FormControl());

          });

          this.events.push({
            name: key,
            users: users,
            formGroup: formGroup
          });

        });
      });
    });
  }



  submitEventMatches(event) {
    console.log('submit!')
  }
}