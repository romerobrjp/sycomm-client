// Angular
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

// Components
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { LeftSidebarComponent } from './shared/left-sidebar/left-sidebar.component';
import { ContentComponent } from './shared/content/content.component';
import { FooterComponent } from './shared/footer/footer.component';
import { ControlSidebarComponent } from './shared/control-sidebar/control-sidebar.component';
import { UsersComponent } from './users/users.component';
import { DataTablesModule } from 'angular-datatables';

// Services
import { UserService } from './users/shared/user.service';

// Modules
import { AppRoutingModule } from './app-routing.module';

// rxjs operators: são usados no subscribe
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
// rxjs extensions
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

import * as $ from 'jquery';
import * as datetimepicker from 'eonasdan-bootstrap-datetimepicker';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LeftSidebarComponent,
    ContentComponent,
    FooterComponent,
    ControlSidebarComponent,
    UsersComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    DataTablesModule
  ],
  providers: [ UserService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
