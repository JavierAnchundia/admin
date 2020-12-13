import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { environment } from './../environments/environment';
import { AgmCoreModule } from '@agm/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';

import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ComunicateNavSiderService } from './services/comunicatens/comunicate-nav-sider.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { es_ES } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';

import { APP_ROUTES } from './app.routes';

import { LoginComponent } from './login/login/login.component';
import { PagesComponent } from './pages/pages.component';
import { SharedModule } from './shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ErrorpageComponent } from './errorpage/errorpage.component';
import { PasswordRecoveryComponent } from './password-recovery/password-recovery.component';

import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';

registerLocaleData(es);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PagesComponent,
    ErrorpageComponent,
    PasswordRecoveryComponent

  ],
  imports: [
    BrowserModule,
    APP_ROUTES,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgZorroAntdModule,
    FontAwesomeModule,
    NzDropDownModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    AgmCoreModule.forRoot({
      apiKey: environment.api_key,
      libraries: ['places', 'drawing', 'geometry']
    }),
    
    LoadingBarHttpClientModule,
    LoadingBarRouterModule,
  ],
  providers: [
    ComunicateNavSiderService, 
    { provide: NZ_I18N, useValue: es_ES }],
  bootstrap: [AppComponent]
})
export class AppModule { }
