
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CompanyDataComponent } from './company-data/company-data.component';
import { SignUpProviderComponent } from './sign-up-provider.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: SignUpProviderComponent,children:[
        { path: '', component: CompanyDataComponent },
      ]}
    ])
  ],
  exports: [RouterModule]
})
export class SignUpProviderRoutingModule {

}