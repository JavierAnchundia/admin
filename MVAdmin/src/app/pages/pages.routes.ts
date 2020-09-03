import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from './pages.component';
import { SadminCrearCementerioComponent } from './sadmin-crear-cementerio/sadmin-crear-cementerio.component';
import { PerfilCementerioComponent } from './perfil-cementerio/perfil-cementerio.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { PerfilConfiguracionComponent } from './perfil-configuracion/perfil-configuracion.component'
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegistroDifuntoComponent } from './registro-difunto/registro-difunto.component';
import { DifuntosPanelComponent } from './difuntos-panel/difuntos-panel.component';
import { CrearAdminComponent } from './crear-admin/crear-admin.component';



// Guards



const pagesRoutes: Routes = [
    {
        path: 'perfil/:id', component: PerfilCementerioComponent, data: { titulo: 'Perfil' }
    },
    {
        path: 'configuracion', component: PerfilConfiguracionComponent, data: { titulo: 'Configuración Perfil' }
    },
    {
        path: 'crear', component: SadminCrearCementerioComponent, data: { titulo: 'CrearCementerio' }
    },
    {
        path: 'administradores', component: AdminPanelComponent, data: { titulo: 'Administradores' }
    },
    {
        path: 'registrodifunto', component: RegistroDifuntoComponent, data: { titulo: 'RegistroDifuntos' }
    },
    {
        path: 'difuntos', component: DifuntosPanelComponent, data: { titulo: 'Difuntos' }
    },
    {
        path: 'create', component: CrearAdminComponent, data: { titulo: 'Crear Administrador' }
    },
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard' , component:DashboardComponent, data:{ titulo:' DashBoard '} }
];


export const PAGES_ROUTES = RouterModule.forChild(pagesRoutes); 