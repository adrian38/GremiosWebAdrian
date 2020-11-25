import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StepsModule } from 'primeng/steps';
import { SignUpRoutingModule } from './sign-up.routing';
import { DialogModule } from 'primeng/dialog';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SignUpProviderComponent } from './sign-up-provider/sign-up-provider.component';
import { CompanyDataComponent } from './sign-up-provider/company-data/company-data.component';
import { SignUpCustomerComponent } from './sign-up-customer/sign-up-customer.component';
import { CalendarModule } from 'primeng/calendar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';


@NgModule({
    imports: [
        CommonModule,
        SignUpRoutingModule,
        StepsModule,
        DialogModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        ButtonModule,
        InputTextModule,

        ButtonModule,
        DialogModule,
        InputTextModule,
        StepsModule,
        CalendarModule,
        ProgressSpinnerModule

    ],
    exports: [
        SignUpRoutingModule,
        SignUpProviderComponent,
        CompanyDataComponent,
        SignUpCustomerComponent
    ],
    declarations: [
        SignUpProviderComponent,
        CompanyDataComponent,
        SignUpCustomerComponent

    ],
    providers: [],
})
export class SignUpModule { }
