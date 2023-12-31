import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
//google maps
import { AgmCoreModule } from '@agm/core'; // Importa el módulo AGM
//reactive forms
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { NegocioComponent } from './components/negocio/negocio.component';
import { HttpClientModule } from '@angular/common/http';
import { AgregarNegocioComponent } from './components/agregar-negocio/agregar-negocio.component';
import { FormsModule } from '@angular/forms';
import { CategoriaComponent } from './components/categoria/categoria.component';
import { LoadingComponent } from './components/shared/loading/loading.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    FooterComponent,
    NegocioComponent,
    AgregarNegocioComponent,
    CategoriaComponent,
    LoadingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDoUXXJkFY4Yg7BsNC5bkO7Bj5zB--y5PU',
    })

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
