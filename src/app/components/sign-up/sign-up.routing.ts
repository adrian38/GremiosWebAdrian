
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SignUpCustomerComponent } from './sign-up-customer/sign-up-customer.component';
import { CompanyDataComponent } from './sign-up-provider/company-data/company-data.component';
import { SignUpProviderComponent } from './sign-up-provider/sign-up-provider.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'customer', component: SignUpCustomerComponent },
      { path: 'provider', component: SignUpProviderComponent,children:[
        { path: '', component: CompanyDataComponent },
      ]}
    ])
  ],
  exports: [RouterModule]
})
export class SignUpRoutingModule {

}