import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router'
import { LoginComponent } from '../login/login.component';
import { CreateAccountComponent } from '../create-account/create-account.component';
import { HomeComponent } from '../home/home.component';
import { AdminHomeComponent } from '../admin/admin-home/admin-home.component';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'createAccount', component: CreateAccountComponent },
  { path: 'home', component: HomeComponent },
  { path: 'admin', component: AdminHomeComponent },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    [RouterModule.forRoot(appRoutes)]],
  exports: [RouterModule]
})


export class RoutingModule { }
