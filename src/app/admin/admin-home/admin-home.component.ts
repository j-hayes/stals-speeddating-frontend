import { Component, OnInit } from '@angular/core';
import { UserAdminServiceService } from '../user-admin-service.service';
import { Account } from '../../../account/account';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {
  users: Account[];

  constructor(private userAdminServiceService: UserAdminServiceService) { }

  ngOnInit() {
    this.userAdminServiceService.getUsers().then(users => this.users = users);
  }


}
