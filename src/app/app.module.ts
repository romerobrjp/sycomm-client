import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { AsideComponent } from './shared/aside/aside.component';
import { ContentComponent } from './shared/content/content.component';
import { FooterComponent } from './shared/footer/footer.component';
import { ControlSidebarComponent } from './shared/control-sidebar/control-sidebar.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AsideComponent,
    ContentComponent,
    FooterComponent,
    ControlSidebarComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
