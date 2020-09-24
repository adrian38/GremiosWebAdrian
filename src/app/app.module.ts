import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {app_routing} from './app.routes';
import {FormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

//pipes


// Services
import {AuthOdooService} from './services/auth-odoo.service';

// Components
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ChatComponent } from './components/chat/chat.component';
import { TaskCardComponent } from './components/task-card/task-card.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    SignUpComponent,
    DashboardComponent,
    ChatComponent,
    TaskCardComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    app_routing
  ],
  providers: [
    AuthOdooService,
    HttpClientModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

