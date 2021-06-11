import { Component, OnInit } from '@angular/core';
import { UserAdminService } from '../user-admin.service';
import { EventAdminService } from '../event-admin.service';
import { Event, EventDate } from '../../event/event';
import { Account } from '../../account/account';
import { FormGroup, FormControl } from '@angular/forms';
import * as _ from 'lodash'
import { promise } from 'protractor';
import { EventPrintService } from '../event-print.service';

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
  selectedEventMenCsv: string[] = [];
  selectedEventWomenCsv: string[] = [];


  usersNotInEvent: Account[];
  usersInEvent: Account[];

  username = '';
  password = '';


  public readonly selectedEventFieldName = 'selectedEvent';
  userDateCsvLines: string[];
  passwordUpdateMessage: string;


  constructor(private userAdminServiceService: UserAdminService, private eventAdminService: EventAdminService, private eventPrintService: EventPrintService) {
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

    const eventSchedulePromise = this.eventAdminService.getEventSchedule(eventId);
    eventSchedulePromise.then(x => this.parseDatesForDisplay(x));

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
  parseDatesForDisplay(eventDates: EventDate[]): any {

    this.selectedEventWomenCsv = [];
    this.selectedEventMenCsv = [];
    if (eventDates.length < 1) {
      return;
    }
    this.users.forEach(x => x.dates = []);
    for (const date of eventDates) {
      const man = this.users.find(x => x.Id === date.manId);
      const woman = this.users.find(x => x.Id === date.womanId);
      if (man) {
        man.dates.push(date);
      }
      if (woman) {
        woman.dates.push(date);
      }
    }

    this.userDateCsvLines = [];
    this.users.forEach(user => {
      var isMan = user.sex.toLowerCase() === 'male';
      _.orderBy(user.dates, "round", "asc");
      let userInEvent = _.filter(this.selectedEvent.users, x => x === user.Id).length > 0;

      if (!userInEvent) {      
        return;
      }
      let tableNumber = '';
      if (!isMan) {
        const firstDate = user.dates.filter(x => x.tableNumber);
        if (firstDate && firstDate.length > 0) {
          tableNumber = `${firstDate[0].tableNumber}`
        }
      }
      let userDateCSV = `${user.firstName} ${user.lastName},${user.email},${tableNumber},${user.age},${user.minDateAge},${user.maxDateAge},`;
      for (let i = 1; i < 100; i++) {

        const date = user.dates.find(x => x.round === i);
        if (!date) {
          userDateCSV += "Break,"
        } else {
          var otherUser: Account;

          if (!isMan) {
            otherUser = this.users.find(u => u.Id === date.manId);
          } else {
            otherUser = this.users.find(u => u.Id === date.womanId);
          }
          let isInAngeRangeMark = '';
          if (!date.areInEachOthersDatingRange) {
            isInAngeRangeMark += `(O.R.)`;
          }
          if (otherUser) {
            userDateCSV += `${otherUser.firstName} ${otherUser.lastName}- ${date.tableNumber} -${isInAngeRangeMark},`;
          }

          else {
            userDateCSV += `Error couldn'nt find date in user list regenerate schedule!`;
          }
        }
      }
      if (isMan) {
        this.selectedEventMenCsv.push(userDateCSV);
      } else {
        this.selectedEventWomenCsv.push(userDateCSV);
      }
    }
    );

    this.selectedEvent.hasSchedule = true;
  }
  createEventSchedule() {
    if (this.selectedEvent) {
      this.eventAdminService.createEventSchedule(this.selectedEvent.Id)
        .then(x => this.eventAdminService.getEventSchedule(this.selectedEvent.Id)
          .then(x => this.parseDatesForDisplay(x)));
    }
  }

  finalizeSchedule() {
    if (this.selectedEvent && this.selectedEvent.hasSchedule) {
      this.eventAdminService.finalizeSchedule(this.selectedEvent.Id)
        .then(z => { location.reload(); })
    }
  }

  printEvent(){
    if (this.selectedEvent && this.selectedEvent.hasSchedule) {
      this.eventPrintService.printEvent(this.usersInEvent);       
    }
  }

  openEvent() {
    if (this.selectedEvent && this.selectedEvent.hasSchedule) {
      this.eventAdminService.openEvent(this.selectedEvent.Id)
        .then(z => { location.reload(); })
    }
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

  resetUserPassword() {
    this.userAdminServiceService.resetPassword(this.username, this.password)
      .then(x => this.passwordUpdateMessage = 'Password Updated Successfully')
      .catch(err => this.passwordUpdateMessage = 'Failed To Update Password');
  }
}
