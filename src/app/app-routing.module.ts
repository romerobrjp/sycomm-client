import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { UsersComponent } from './users/users.component';
import { UserDetailComponent } from './users/user-detail/user-detail.component';
import { EmployeesComponent } from './employees/employees.component';
import { EmployeeDetailComponent } from './employees/employee-detail/employee-detail.component';

const ROUTES = RouterModule.forRoot([
  {
    path: 'employees',
    component: EmployeesComponent
  },
  {
    path: 'employees/new',
    component: EmployeeDetailComponent
  },
  {
    path: 'users',
    component: UsersComponent
  },
  {
    path: 'users/:id',
    component: UserDetailComponent
  },
  {
    path: 'users/new',
    component: UserDetailComponent
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
