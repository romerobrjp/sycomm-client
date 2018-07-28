import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';

import {UsersComponent} from './users/users.component';
import {UserDetailComponent} from './users/user-detail/user-detail.component';
import {ActivitiesComponent} from './activities/activities.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {SignInComponent} from './sign-in/sign-in.component';
import {ProfileComponent} from './profile/profile.component';
import {ActivityDetailComponent} from './activities/activity-detail/activity-detail.component';
import {AgendasComponent} from './agendas/agendas.component';
import {AgendaDetailComponent} from './agendas/agenda-detail/agenda-detail.component';

const ROUTES = RouterModule.forRoot([
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'sign-in',
    component: SignInComponent
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'users/:id',
    component: UserDetailComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'users/new',
    component: UserDetailComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'agendas',
    component: AgendasComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'agendas/:id',
    component: AgendaDetailComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'activities',
    component: ActivitiesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'activities/:id',
    component: ActivityDetailComponent,
    canActivate: [AuthGuard]
  },
]);

@NgModule({
  declarations: [],
  imports: [ ROUTES ],
  exports: [ RouterModule ],
  providers: [],
})

export class AppRoutingModule {}
