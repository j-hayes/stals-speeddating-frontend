import { Component, OnInit } from '@angular/core';
import { LoginServiceService } from './login/login-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isAdmin: boolean;

  constructor(private loginServiceService: LoginServiceService) {

  }

  ngOnInit(): void {
    this.loginServiceService.loginEvent.subscribe(_ => {
      this.loginServiceService.isAdmin().then(isAdmin => this.isAdmin = isAdmin);
    })
  }
  title = 'speed-dating';



}
