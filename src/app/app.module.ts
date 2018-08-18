// Angular
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// 3rd party modules
import { TextMaskModule } from 'angular2-text-mask';
import {Ng2BRPipesModule} from 'ng2-brpipes';
// Primefaces modules
import { TableModule } from 'primeng/table';
import { GrowlModule } from 'primeng/growl';
import { MessageModule } from 'primeng/message';
import {ConfirmDialogModule, MessagesModule, CardModule, TooltipModule} from 'primeng/primeng';
import { DataViewModule } from 'primeng/dataview';

// Components
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { LeftSidebarComponent } from './shared/left-sidebar/left-sidebar.component';
import { ContentComponent } from './shared/content/content.component';
import { FooterComponent } from './shared/footer/footer.component';
import { ControlSidebarComponent } from './shared/control-sidebar/control-sidebar.component';
import { UsersComponent } from './users/users.component';
import { UserDetailComponent } from './users/user-detail/user-detail.component';
import { PublicOfficesComponent } from './public-offices/public-offices.component';
import { PublicAgenciesComponent } from './public-agencies/public-agencies.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { ProfileComponent } from './profile/profile.component';
import { ActivitiesComponent } from './activities/activities.component';
import { ActivityDetailComponent } from './activities/activity-detail/activity-detail.component';
import { AgendasComponent } from './agendas/agendas.component';
import { AgendaDetailComponent } from './agendas/agenda-detail/agenda-detail.component';
import { PublicAgencyDetailComponent } from './public-agencies/public-agency-detail/public-agency-detail.component';
import { PublicOfficeDetailComponent } from './public-offices/public-office-detail/public-office-detail.component';

// Services
import { UserService } from './users/shared/user.service';
import { PublicOfficeService } from './public-offices/shared/public-office.service';
import { PublicAgencyService } from './public-agencies/shared/public-agency.service';
import { ActivityService } from './activities/shared/activity.service';
import { AgendaService } from './agendas/shared/agenda.service';
import { AuthService } from './shared/auth.service';
import { HttpClient } from './shared/token.service';
import { Dictionary } from './shared/dictionary';
import { ErrorHandlerService } from './shared/error-handler.service';
// Primefaces Services
import { MessageService } from 'primeng/components/common/messageservice';
import { ConfirmationService } from 'primeng/api';

// Guards
import { AuthGuard } from './guards/auth.guard';

// Modules
import { AppRoutingModule } from './app-routing.module';
import { AppHttpInterceptor } from './shared/http.interceptor';
import { AngularTokenModule } from 'angular-token';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LeftSidebarComponent,
    ContentComponent,
    FooterComponent,
    ControlSidebarComponent,
    UsersComponent,
    UserDetailComponent,
    PublicOfficesComponent,
    PublicAgenciesComponent,
    DashboardComponent,
    SignInComponent,
    ProfileComponent,
    ActivitiesComponent,
    ActivityDetailComponent,
    AgendasComponent,
    AgendaDetailComponent,
    PublicAgencyDetailComponent,
    PublicOfficeDetailComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularTokenModule.forRoot({
      apiBase: 'http://api.sycomm.com:3000',
    }),
    AppRoutingModule,
    TableModule,
    GrowlModule,
    MessageModule,
    MessagesModule,
    ConfirmDialogModule,
    CardModule,
    TooltipModule,
    DataViewModule,
    TextMaskModule,
    Ng2BRPipesModule,
  ],
  providers: [
    UserService,
    PublicOfficeService,
    PublicAgencyService,
    ActivityService,
    AgendaService,
    MessageService,
    ConfirmationService,
    AngularTokenModule,
    AuthService,
    HttpClient,
    AuthGuard,
    Dictionary,
    ErrorHandlerService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppHttpInterceptor,
      multi: true,
    },
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
