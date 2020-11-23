import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { app_routing } from './app.routes';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms'

import {CarouselModule} from 'primeng/carousel';
import {ButtonModule} from 'primeng/button';
import {DialogModule} from 'primeng/dialog';
import {CardModule} from 'primeng/card';
import {DropdownModule} from 'primeng/dropdown';
import {CalendarModule} from 'primeng/calendar';
import {TabViewModule} from 'primeng/tabview';
import {FieldsetModule} from 'primeng/fieldset';
import {StepsModule} from 'primeng/steps';
import {RadioButtonModule} from 'primeng/radiobutton';

//pipes


// Services
import { AuthOdooService } from './services/auth-odoo.service';
import { AuthGuardService } from './services/auth-guard.service';
import { TaskOdooService } from './services/task-odoo.service';

// Components
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ChatComponent } from './components/chat/chat.component';
import { TaskCardComponent } from './components/task-card/task-card.component';
import { LoginComponent } from './components/home-gremio/login/login.component';
import { HomeGremioComponent } from './components/home-gremio/home-gremio.component';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {InputTextModule} from 'primeng/inputtext';
import { PlaceHolderDirective } from './components/shared/placeholder/placeholder.directive';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import { NavbarGremioComponent } from './components/shared/navbar-gremio/navbar-gremio.component';

import { FlexLayoutModule } from '@angular/flex-layout';
import { SignUpCustomerComponent } from './components/sign-up-customer/sign-up-customer.component';
import { SignUpProviderComponent } from './components/sign-up-provider/sign-up-provider.component';
import { CompanyDataComponent } from './components/sign-up-provider/company-data/company-data.component';
import { SignUpProviderRoutingModule } from './components/sign-up-provider/sign-up-provider.routing';
import { SignUpProviderModule } from './components/sign-up-provider/sign-up-provider.module';
import { NewRequestComponent } from './components/new-request/new-request.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    NavbarGremioComponent,
    SignUpComponent,
    DashboardComponent,
    ChatComponent,
    TaskCardComponent,
    LoginComponent,
    HomeGremioComponent,
    PlaceHolderDirective,
    SignUpCustomerComponent,
    NewRequestComponent


  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    FieldsetModule,

    app_routing,

    ///////////////////
    CarouselModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    CardModule,
    ProgressSpinnerModule,
    DropdownModule,
    CalendarModule,
    TabViewModule,
    StepsModule,
    SignUpProviderModule,
    RadioButtonModule

  ],
  providers: [
    AuthOdooService,
    HttpClientModule,
    AuthGuardService,
    TaskOdooService,



  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
