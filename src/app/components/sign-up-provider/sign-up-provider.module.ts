import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StepsModule } from 'primeng/steps';
import { CompanyDataComponent } from './company-data/company-data.component';
import { SignUpProviderComponent } from './sign-up-provider.component';
import { SignUpProviderRoutingModule } from './sign-up-provider.routing';
import { DialogModule } from 'primeng/dialog';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';


@NgModule({
    imports: [
        CommonModule,
        SignUpProviderRoutingModule,
        StepsModule,
        DialogModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        ButtonModule,
        InputTextModule,

    ],
    exports: [
        SignUpProviderRoutingModule,
        SignUpProviderComponent,
        CompanyDataComponent,
    ],
    declarations: [
        SignUpProviderComponent,
        CompanyDataComponent
    ],
    providers: [],
})
export class SignUpProviderModule { }
