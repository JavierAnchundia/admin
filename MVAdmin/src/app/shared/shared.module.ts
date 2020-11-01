import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';


import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';


import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { ComunicateNavSiderService } from '../services/comunicatens/comunicate-nav-sider.service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { es_ES } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import es from '@angular/common/locales/es';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
    imports: [
        RouterModule,
        CommonModule,
        NgZorroAntdModule,
        FormsModule,
        HttpClientModule,
        NzDropDownModule,
        FontAwesomeModule
    ],
    declarations: [
        NavbarComponent,
        SidebarComponent,
    ],
    exports: [
        NavbarComponent,
        SidebarComponent,
        NzDropDownModule
    ],
  providers: [
    ComunicateNavSiderService, 
    { provide: NZ_I18N, useValue: es_ES }],
})
export class SharedModule { }