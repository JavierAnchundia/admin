import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SadminCrearCementerioComponent } from './pages/sadmin-crear-cementerio/sadmin-crear-cementerio.component';


const routes: Routes = [
  {path: '', component: SadminCrearCementerioComponent, pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
