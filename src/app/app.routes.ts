import {RouterModule, Routes} from '@angular/router';

import {HomeComponent} from "./components/home/home.component";
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ChatComponent } from './components/chat/chat.component';
import { AuthGuardService } from './services/auth-guard.service'

const app_routes: Routes = [
    {path:'home', component: HomeComponent},
    {path:'signup', component: SignUpComponent},
    {path:'dashboard', component:DashboardComponent, canActivate:[AuthGuardService]},
    {path:'chat/:id', component: ChatComponent,  canActivate:[AuthGuardService]},
    {path:'', pathMatch:'full', redirectTo:'home'}
];

export const app_routing = RouterModule.forRoot(app_routes, {useHash: true});
