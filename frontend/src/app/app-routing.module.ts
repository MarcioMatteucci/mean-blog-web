import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent // The Default Route
  },
  {
    path: 'dashboard',
    component: DashboardComponent // The Dashboard Route
  },
  {
    path: 'register',
    component: RegisterComponent // The Register Route
  },
  {
    path: 'login',
    component: LoginComponent // The Login Route
  },
  {
    path: 'profile',
    component: ProfileComponent // The Login Route
  },
  { 
    path: '**',
    component: HomeComponent // The "Catch-All" Route
  } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
