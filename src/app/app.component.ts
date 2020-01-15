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
      this.loginServiceService.isAdmin().then(isAdmin => this.SetIsAdmin(isAdmin));
    });
    this.loginServiceService.isAdmin().then(isAdmin => this.SetIsAdmin(isAdmin));
  }
  title = 'speed-dating';




  private SetIsAdmin(isAdmin: boolean): boolean | PromiseLike<boolean> {
    return this.isAdmin = isAdmin;
  }
}
