import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NegocioService {

  constructor(private http: HttpClient) { }

  //url
  url = 'https://rulzpineda-001-site1.atempurl.com/api/Clientes/';

  //obtiene todos los negocios
  cargarNegocios() {
    try{
      return this.http.get("");
    }
    catch(e){
      return e;
    }
  }

  //obtener negocio por nombre
  getNegocio(nombre:string){
    return this.http.get(this.url+`Negocio/${nombre}`)
  }
}
