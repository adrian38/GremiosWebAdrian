import {RouterModule, Routes} from '@angular/router';

// import {HomeComponent} from "./components/home/home.component";
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ChatComponent } from './components/chat/chat.component';
import { AuthGuardService } from './services/auth-guard.service'
import { HomeGremioComponent } from './components/home-gremio/home-gremio.component';
import { SignUpCustomerComponent } from './components/sign-up-customer/sign-up-customer.component';
import { SignUpProviderComponent } from './components/sign-up-provider/sign-up-provider.component';
import { NewRequestComponent } from './components/new-request/new-request.component';

const app_routes: Routes = [
    {path:'home', component: HomeGremioComponent},
    {path:'signup-customer', component: SignUpCustomerComponent},
    {
        path: 'signup-provider',
        loadChildren: () => import('./components/sign-up-provider/sign-up-provider.module').then(m => m.SignUpProviderModule)
    },

    {path:'new-request', component:NewRequestComponent},
    {path:'dashboard', component:DashboardComponent, canActivate:[AuthGuardService]},
    {path:'chat/:id', component: ChatComponent,  canActivate:[AuthGuardService]},
    {path:'', pathMatch:'full', redirectTo:'home'}
];

export const app_routing = RouterModule.forRoot(app_routes, {useHash: true});
