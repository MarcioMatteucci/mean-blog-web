import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AuthGuard } from './guards/auth.guards';
import { NotAuthGuard } from './guards/notAuth.guards';
import { BlogComponent } from './components/blog/blog.component';
import { EditBlogComponent } from './components/blog/edit-blog/edit-blog.component';
import { DeleteBlogComponent } from './components/blog/delete-blog/delete-blog.component';
import { PublicProfileComponent } from './components/public-profile/public-profile.component';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent // The Default Route
  },
  {
    path: 'dashboard',
    component: DashboardComponent,  // The Dashboard Route
    canActivate: [AuthGuard]
  },
  {
    path: 'register',
    component: RegisterComponent, // The Register Route
    canActivate: [NotAuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent, // The Login Route
    canActivate: [NotAuthGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent, // The Login Route
    canActivate: [AuthGuard]
  },
  {
    path: 'blog',
    component: BlogComponent, // The Default Route
    canActivate: [AuthGuard]
  },
  {
    path: 'edit-blog/:id',
    component: EditBlogComponent, // The Default Route
    canActivate: [AuthGuard]
  },
  {
    path: 'delete-blog/:id',
    component: DeleteBlogComponent, // The Default Route
    canActivate: [AuthGuard]
  },
  {
    path: 'user/:username',
    component: PublicProfileComponent, // The Default Route
    canActivate: [AuthGuard]
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
