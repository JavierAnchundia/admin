import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from './pages.component';
import { SadminCrearCementerioComponent } from './sadmin-crear-cementerio/sadmin-crear-cementerio.component';
import { PerfilCementerioComponent } from './perfil-cementerio/perfil-cementerio.component';
import { SugerenciasComponent } from './sugerencias/sugerencias.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { PerfilConfiguracionComponent } from './perfil-configuracion/perfil-configuracion.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegistroDifuntoComponent } from './registro-difunto/registro-difunto.component';
import { DifuntosPanelComponent } from './difuntos-panel/difuntos-panel.component';
import { CrearAdminComponent } from './crear-admin/crear-admin.component';
import { AuthGuard } from '../guards/auth/auth.guard';
import { PerfilCementerioGuard } from '../guards/perfil-cementerio/perfil-cementerio.guard';
import { CrearAdminGuard } from '../guards/crear-admin/crear-admin.guard';
import { PagPermisosGuard } from '../guards/pag-permisos/pag-permisos.guard';
import { PaquetesComponent } from 'src/app/pages/paquetes/paquetes.component';
import { NotificacionesComponent } from './notificaciones/notificaciones.component';
import { HomenajesComponent } from './homenajes/homenajes.component';

// Guards

const pagesRoutes: Routes = [
  {
    path: 'perfil/:id',
    component: PerfilCementerioComponent,
    data: { titulo: 'Perfil Cementerio' },
    canActivate: [PerfilCementerioGuard, AuthGuard],
  },
  {
    path: 'configuracion',
    component: PerfilConfiguracionComponent,
    data: { titulo: 'Configuración Perfil' },
    canActivate: [AuthGuard],
  },
  {
    path: 'crear',
    component: SadminCrearCementerioComponent,
    data: { titulo: 'Crear Cementerio' },
    canActivate: [AuthGuard, PagPermisosGuard],
  },
  {
    path: 'administradores',
    component: AdminPanelComponent,
    data: { titulo: 'Ver Administradores' },
    canActivate: [AuthGuard, PagPermisosGuard],
  },
  {
    path: 'registrodifunto',
    component: RegistroDifuntoComponent,
    data: { titulo: 'Crear/Editar Difuntos' },
    canActivate: [AuthGuard, PagPermisosGuard],
  },
  {
    path: 'difuntos',
    component: DifuntosPanelComponent,
    data: { titulo: 'Ver Difuntos' },
    canActivate: [AuthGuard, PagPermisosGuard],
  },
  {
    path: 'create',
    component: CrearAdminComponent,
    data: { titulo: 'Crear/Editar Administrador' },
    //canActivate: [CrearAdminGuard, AuthGuard, PagPermisosGuard]
    canActivate: [AuthGuard, PagPermisosGuard],
  },

  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

  {
    path: 'dashboard',
    component: DashboardComponent,
    data: { titulo: ' DashBoard ' },
    canActivate: [AuthGuard, PagPermisosGuard],
  },

  {
    path: 'paquetes',
    component: PaquetesComponent,
    data: { titulo: 'Paquetes' },
    canActivate: [AuthGuard, PagPermisosGuard],
  },
  {
    path: 'notificaciones',
    component: NotificacionesComponent,
    data: { titulo: 'Notificaciones' },
    canActivate: [AuthGuard, PagPermisosGuard],
  },
  {
    path: 'homenajes',
    component: HomenajesComponent,
    data: { titulo: 'Homenajes'},
    canActivate: [AuthGuard, PagPermisosGuard],

  }
  ,
  {
    path: 'sugerencias',
    component: SugerenciasComponent,
    data: { titulo: 'Sugerencias' },
    canActivate: [AuthGuard, PagPermisosGuard],
  },
];

export const PAGES_ROUTES = RouterModule.forChild(pagesRoutes);
