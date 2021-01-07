import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapaComponent } from './componentes/mapa/mapa.component';
import { GraficosComponent } from './componentes/graficos/graficos.component';
import { CncytComponent } from './componentes/cncyt/cncyt.component';


const routes: Routes = [{
  path: '',
  redirectTo: 'mapa',
  pathMatch: 'full'
},
{
  path: 'mapa',
  component: MapaComponent,
},
{
  path: 'cncyt',
  component: CncytComponent,
},
{
  path: 'graficos',
  component: GraficosComponent,
},
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
