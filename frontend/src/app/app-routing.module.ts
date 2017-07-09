import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterComponent } from './components/register/register.component';

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
    path: '**',
    component: HomeComponent // The "Catch-All" Route
  } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
