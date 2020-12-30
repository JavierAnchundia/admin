import { NgModule } from '@angular/core';
import { AgmCoreModule } from '@agm/core';
import { environment } from '../../environments/environment';
import { PAGES_ROUTES } from './pages.routes';
import { SharedModule } from '../shared/shared.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

//servicios
import { ComunicateNavSiderService } from '../services/comunicatens/comunicate-nav-sider.service';
import { CargarGeolocalizacionSadminService } from '../services/cargar-geolocalizacion-sadmin/cargar-geolocalizacion-sadmin.service';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { MatPaginatorModule } from '@angular/material/paginator';

// import { PagesComponent } from './pages.component';

import { PerfilCementerioComponent } from './perfil-cementerio/perfil-cementerio.component';
import { NgZorroAntdModule, es_ES, NZ_I18N } from 'ng-zorro-antd';
import { HttpClientModule } from '@angular/common/http';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { SadminCrearCementerioComponent } from './sadmin-crear-cementerio/sadmin-crear-cementerio.component';
import { PerfilConfiguracionComponent } from './perfil-configuracion/perfil-configuracion.component';
import { PoligonoMapComponent } from './sadmin-crear-cementerio/poligono-map/poligono-map.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BotonCrearComponent } from './dashboard/boton-crear/boton-crear.component';
import { RegistroDifuntoComponent } from './registro-difunto/registro-difunto.component';
import { DifuntosPanelComponent } from './difuntos-panel/difuntos-panel.component';
import { CrearAdminComponent } from './crear-admin/crear-admin.component';
import { VerMapaComponent } from './perfil-cementerio/ver-mapa/ver-mapa.component';
import { EditarMapaComponent } from './perfil-cementerio/editar-mapa/editar-mapa.component';
import { ServicioModules } from '../services/servicios.module';
import { DetalleDifuntoComponent } from './difuntos-panel/detalle-difunto/detalle-difunto.component';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
registerLocaleData(es);
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { PaquetesComponent } from './paquetes/paquetes.component';
import { ActualizarPaqueteComponent } from './paquetes/actualizar-paquete/actualizar-paquete.component';
import { CrearPaqueteComponent } from './paquetes/crear-paquete/crear-paquete.component';
import { DatePipe } from '@angular/common';
import { NotificacionesComponent } from './notificaciones/notificaciones.component';
import { CrearNotificacionComponent } from './notificaciones/crear-notificacion/crear-notificacion.component';
import { ActualizarNotificacionComponent } from './notificaciones/actualizar-notificacion/actualizar-notificacion.component';
import { HomenajesComponent } from './homenajes/homenajes.component';
import { CrearHomenajeComponent } from './homenajes/crear-homenaje/crear-homenaje.component';
import {MatSelectModule} from '@angular/material/select';
import { EditarHomenajeComponent } from './homenajes/editar-homenaje/editar-homenaje.component';
import { SugerenciasComponent } from './sugerencias/sugerencias.component';

@NgModule({
  declarations: [
    //PagesComponent,
    PerfilCementerioComponent,
    AdminPanelComponent,
    SadminCrearCementerioComponent,
    PerfilConfiguracionComponent,
    PoligonoMapComponent,
    DashboardComponent,
    BotonCrearComponent,
    RegistroDifuntoComponent,
    DifuntosPanelComponent,
    CrearAdminComponent,
    VerMapaComponent,
    EditarMapaComponent,
    DetalleDifuntoComponent,
    PaquetesComponent,
    ActualizarPaqueteComponent,
    CrearPaqueteComponent,
    NotificacionesComponent,
    CrearNotificacionComponent,
    ActualizarNotificacionComponent,
    HomenajesComponent,
    CrearHomenajeComponent,
    EditarHomenajeComponent,
    SugerenciasComponent,
  ],
  exports: [
    PerfilCementerioComponent,
    SadminCrearCementerioComponent,
    RegistroDifuntoComponent,
    MatTableModule,
    MatSortModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatAutocompleteModule,
  ],
  imports: [
    MatAutocompleteModule,
    CommonModule,
    NgxSkeletonLoaderModule,
    SharedModule,
    ServicioModules,
    PAGES_ROUTES,
    FormsModule,
    NgZorroAntdModule,
    HttpClientModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    MatSlideToggleModule,
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    MatDialogModule,
    MatSortModule,
    MatInputModule,
    MatAutocompleteModule,
    MatPaginatorModule,
    MatSelectModule,
    AgmCoreModule.forRoot({
      apiKey: environment.api_key,
      libraries: ['places', 'drawing', 'geometry'],
    }),
  ],
  providers: [
    DatePipe,
    ComunicateNavSiderService,
    CargarGeolocalizacionSadminService,
    { provide: NZ_I18N, useValue: es_ES },
  ],
})
export class PagesModule {}
