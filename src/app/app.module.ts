import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {app_routing} from './app.routes';
import {FormsModule} from '@angular/forms'

//Services
import {OdooService} from './services/auth-odoo.service'

//Components
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    FormsModule, 
    app_routing
  ],
  providers: [
    OdooService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
