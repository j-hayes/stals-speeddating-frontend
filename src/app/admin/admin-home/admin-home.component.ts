import { Component, OnInit } from '@angular/core';
import { UserAdminService } from '../user-admin.service';
import { EventAdminService } from '../event-admin.service';
import { Event } from '../../event/event';
import { Account } from '../../account/account';
import { promise } from 'protractor';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {
  users: Account[];

  events: Event[];
  selectedEvent: Event;

  selectEventForm: FormGroup = new FormGroup({});
  eventUsersRemoveForm: FormGroup = new FormGroup({});
  eventUsersAddForm: FormGroup = new FormGroup({});

  usersNotInEvent: Account[];
  usersInEvent: Account[];



  private readonly selectedEventFieldName = 'selectedEvent';

  constructor(private userAdminServiceService: UserAdminService, private eventAdminService: EventAdminService) {
    const formControl = new FormControl();
    formControl.valueChanges.subscribe(x => this.eventSelected(x));
    this.selectEventForm.addControl(this.selectedEventFieldName, formControl);
  }

  ngOnInit() {
    const userPromise = this.userAdminServiceService.getUsers();
    const eventPromise = this.eventAdminService.getEvents();

    userPromise.then(users => this.users = users);
    eventPromise.then(events => this.events = events);

    Promise.all([userPromise, eventPromise]).then();//if I need to do something to set everything up

  }

  eventSelected(eventId: string) {
    if (!eventId) {
      return; // blank selected;
    }
    this.eventUsersAddForm = new FormGroup({});
    this.eventUsersRemoveForm = new FormGroup({});
    const usersNotInEvent = new Array<Account>();
    const usersInEvent = new Array<Account>();

    this.selectedEvent = this.events.find(x => x.Id === eventId);
    this.users.forEach(user => {
      const userId = this.selectedEvent.users.find(x => x === user.Id);
      if (userId) {
        usersInEvent.push(user);
      } else {
        usersNotInEvent.push(user);
      }
    });

    usersInEvent.forEach(user => {
      this.eventUsersRemoveForm.addControl(user.Id, new FormControl());
    });

    usersNotInEvent.forEach(user => {
      this.eventUsersAddForm.addControl(user.Id, new FormControl());
    });

    this.usersInEvent = usersInEvent;
    this.usersNotInEvent = usersNotInEvent;


  }

  submitChanges() {

    const usersToAdd = new Array<Account>();
    const usersToRemove = new Array<Account>();
    Object.keys(this.eventUsersAddForm.controls).forEach(key => {
      const userToAdd = this.getUserIfFormValueIsTrue(this.eventUsersAddForm, key);
      if (userToAdd) {
        usersToAdd.push(userToAdd);
      }
    });

    Object.keys(this.eventUsersRemoveForm.controls).forEach(key => {
      const userToRemove = this.getUserIfFormValueIsTrue(this.eventUsersRemoveForm, key);
      if (userToRemove) {
        usersToRemove.push(userToRemove);
      }
    });

    this.eventAdminService.addUsersToEvent(this.selectedEvent, usersToAdd)
      .then(x => {
        this.eventAdminService.removeUsersFromEvent(this.selectedEvent, usersToRemove)
          .then(z => { location.reload(); })
      });

  }
  getUserIfFormValueIsTrue(eventUsersAddForm: FormGroup, key: string): Account {
    if (eventUsersAddForm.controls[key].value === true) {
      return this.users.find(x => x.Id === key);
    }
    return null;
  }

}