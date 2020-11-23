import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from './pages/pages.component';

import { LoginComponent } from './login/login/login.component';
 import{ } from './pages/pages.module'
import { ErrorpageComponent } from './errorpage/errorpage.component';
import { AuthGuard } from './guards/auth/auth.guard';
import { DashboardComponent } from 'src/app/pages/dashboard/dashboard.component';
import { SadminCrearCementerioComponent } from 'src/app/pages/sadmin-crear-cementerio/sadmin-crear-cementerio.component'
import { PasswordRecoveryComponent } from './password-recovery/password-recovery.component';

const appRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    {
        path: 'inicio',
        component: PagesComponent,
        loadChildren: './pages/pages.module#PagesModule'
    },
    {path: 'recuperarContrasena', component:PasswordRecoveryComponent},
    {
        path: 'dashboard' , component:DashboardComponent, data:{ titulo:' DashBoard '},
        canActivate: [AuthGuard] 
    },
    { path: 'crear', component: SadminCrearCementerioComponent, data: { titulo: 'CrearCementerio' }},
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    {path: '404', component: ErrorpageComponent},
    {path: '**', redirectTo: '/404'}
   
];

//scrollPositionRestoration: 'enabled' sirve para que cuando se cambie de componente vaya hacia arriba
export const APP_ROUTES = RouterModule.forRoot( appRoutes, { useHash: true, scrollPositionRestoration: 'enabled' } );