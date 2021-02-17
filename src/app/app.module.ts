//Angular
import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { app_routing } from './app.routes';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';

//Otros
import { AgmCoreModule } from '@agm/core';

//NgPrime
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { TabViewModule } from 'primeng/tabview';
import { FieldsetModule } from 'primeng/fieldset';
import { StepsModule } from 'primeng/steps';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RatingModule } from 'primeng/rating';
import { ToastModule } from 'primeng/toast';
//import { LightboxModule } from 'primeng/lightbox';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { AvatarModule } from 'primeng/avatar';
import { GalleriaModule } from 'primeng/galleria';
import { ProgressBarModule } from 'primeng/progressbar';

//pipes
import { DatePipe } from '@angular/common';
import localeEsAr from '@angular/common/locales/es-AR';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeEsAr, 'es');

// Services
import { AuthOdooService } from './services/auth-odoo.service';
import { AuthGuardService } from './services/auth-guard.service';
import { TaskOdooService } from './services/task-odoo.service';
import { SignUpOdooService } from './services/signup-odoo.service';

// Components
import { AppComponent } from './app.component';
import { LoginComponent } from './components/home-gremio/login/login.component';
import { HomeGremioComponent } from './components/home-gremio/home-gremio.component';
import { PlaceHolderDirective } from './components/shared/placeholder/placeholder.directive';
import { NavbarGremioComponent } from './components/shared/navbar-gremio/navbar-gremio.component';
import { NewRequestComponent } from './components/new-request/new-request.component';
import { SignUpModule } from './components/sign-up/sign-up.module';
import { DashboardGremioComponent } from './components/dashboard-gremio/dashboard-gremio.component';
import { HireSubCardComponent } from './components/common/hire-card/hire-sub-card/hire-sub-card.component';
import { HireCardComponent } from './components/common/hire-card/hire-card.component';
import { HistoryCardComponent } from './components/common/history-card/history-card.component';
import { HistorySubCardComponent } from './components/common/history-card/history-sub-card/history-sub-card.component';
import { RequestCardComponent } from './components/common/request-card/request-card.component';
import { RequestSubCardComponent } from './components/common/request-card/request-sub-card/request-sub-card.component';
import { NewChatComponent } from './components/new-chat/new-chat.component';

//Otros
import { PaymentStripeComponent } from './components/payment-stripe/payment-stripe.component';

@NgModule({
	declarations: [
		AppComponent,
		NavbarGremioComponent,
		LoginComponent,
		HomeGremioComponent,
		PlaceHolderDirective,
		NewRequestComponent,
		DashboardGremioComponent,

		////////////////////

		RequestCardComponent,
		RequestSubCardComponent,
		HireCardComponent,
		HireSubCardComponent,
		HistoryCardComponent,
		HistorySubCardComponent,
		NewChatComponent,
		PaymentStripeComponent
	],
	imports: [
		AgmCoreModule.forRoot({
			apiKey: 'AIzaSyBXq33cjYMCezL6xP-vo3m-qWQ5U9gRTfQ',
			libraries: [ 'places' ]
		}),
		BrowserModule,
		FormsModule,
		ReactiveFormsModule,
		BrowserAnimationsModule,
		FlexLayoutModule,
		FieldsetModule,
		TooltipModule,
		ToggleButtonModule,

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
		SignUpModule,
		RadioButtonModule,
		InputTextareaModule,
		RatingModule,
		ToastModule,
		//LightboxModule,
		AvatarModule,
		GalleriaModule,
		ProgressBarModule
	],
	providers: [
		AuthOdooService,
		HttpClientModule,
		DatePipe,
		AuthGuardService,
		TaskOdooService,
		MessageService,
		SignUpOdooService,
		{ provide: LOCALE_ID, useValue: 'es' }
	],
	bootstrap: [ AppComponent ]
})
export class AppModule {}
