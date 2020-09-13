import {RouterModule, Routes} from '@angular/router';

import {HomeComponent} from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ChatComponent } from './components/chat/chat.component';

const app_routes: Routes = [
    {path:'home', component: HomeComponent},
    {path:'login', component: LoginComponent},
    {path:'signup', component: SignUpComponent},
    {path:'dashboard/:id', component:DashboardComponent},
    {path:':id/chat', component: ChatComponent},
    {path:'', pathMatch:'full', redirectTo:'home'}
];

export const app_routing = RouterModule.forRoot(app_routes, {useHash: true});