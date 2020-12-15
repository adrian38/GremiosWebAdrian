import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './components/chat/chat.component';
import { AuthGuardService } from './services/auth-guard.service'
import { HomeGremioComponent } from './components/home-gremio/home-gremio.component';
import { NewRequestComponent } from './components/new-request/new-request.component';
import { DashboardGremioComponent } from './components/dashboard-gremio/dashboard-gremio.component';

const app_routes: Routes = [
    { path: 'home', component: HomeGremioComponent },
    {
        path: 'signup',
        loadChildren: () => import('./components/sign-up/sign-up.module').then(m => m.SignUpModule)
    },

    { path: 'new-request', component: NewRequestComponent, canActivate: [AuthGuardService] },
    { path: 'dashboard', component: DashboardGremioComponent, canActivate: [AuthGuardService] },
    { path: 'chat/:id', component: ChatComponent, canActivate: [AuthGuardService] },
    { path: '', pathMatch: 'full', redirectTo: 'home' }
];

export const app_routing = RouterModule.forRoot(app_routes, { useHash: true });
