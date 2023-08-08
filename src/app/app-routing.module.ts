import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { NegocioComponent } from './components/negocio/negocio.component';
import { AgregarNegocioComponent } from './components/agregar-negocio/agregar-negocio.component';
import { CategoriaComponent } from './components/categoria/categoria.component';

const routes: Routes = [
  {path:'home', component: HomeComponent},
  {path:'negocio', component: NegocioComponent},
  {path:'agregar-negocio', component: AgregarNegocioComponent},
  {path:'categoria/:categoria', component: CategoriaComponent},

  {path:'**', component: HomeComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
