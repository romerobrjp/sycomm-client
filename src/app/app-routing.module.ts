import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { UsersComponent } from './users/users.component';
import { UserDetailComponent } from './users/user-detail/user-detail.component';
import { EmployeesComponent } from './employees/employees.component';
import { EmployeeDetailComponent } from './employees/employee-detail/employee-detail.component';
import {CustomerDetailComponent} from './customers/customer-detail/customer-detail.component';
import {CustomersComponent} from './customers/customers.component';

const ROUTES = RouterModule.forRoot([
  {
    path: '',
    redirectTo: '/users',
    pathMatch: 'full'
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
    path: 'employees',
    component: EmployeesComponent
  },
  {
    path: 'employees/new',
    component: EmployeeDetailComponent
  },
  {
    path: 'employees/:id',
    component: EmployeeDetailComponent
  },
  {
    path: 'customers',
    component: CustomersComponent
  },
  {
    path: 'customers/new',
    component: CustomerDetailComponent
  },
  {
    path: 'customers/:id',
    component: CustomerDetailComponent
  },
]);

@NgModule({
  declarations: [],
  imports: [ ROUTES ],
  exports: [ RouterModule ],
  providers: [],
})

export class AppRoutingModule {}
