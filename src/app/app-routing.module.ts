import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { UsersComponent } from './users/users.component';

const ROUTES = RouterModule.forRoot([
  {
    path: 'users',
    component: UsersComponent
  },
  {
    path: '',
    redirectTo: '/users',
    pathMatch: 'full'
  }
]);

@NgModule({
  declarations: [],
  imports: [ ROUTES ],
  exports: [ RouterModule ],
  providers: [],
})

export class AppRoutingModule {}
