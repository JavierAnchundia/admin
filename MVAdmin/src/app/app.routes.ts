import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from './pages/pages.component';

import { LoginComponent } from './login/login/login.component';
 import{ } from './pages/pages.module'
import { ErrorpageComponent } from './errorpage/errorpage.component';
import { AuthGuard } from './guards/auth/auth.guard';

const appRoutes: Routes = [
    { path: 'login', component: LoginComponent },
    {
        path: 'inicio',
        component: PagesComponent,
        loadChildren: './pages/pages.module#PagesModule'
    },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    {path: '404', component: ErrorpageComponent},
    {path: '**', redirectTo: '/404'}
   
];

//scrollPositionRestoration: 'enabled' sirve para que cuando se cambie de componente vaya hacia arriba
export const APP_ROUTES = RouterModule.forRoot( appRoutes, { useHash: true, scrollPositionRestoration: 'enabled' } );