import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  
  //url
  url = 'https://zoonicoo-001-site1.htempurl.com/api/Categorias';
  urlLocal = 'https://localhost:44387/api/Categorias';

  constructor(private http: HttpClient) { }

    //obtener categorias
    cargarCategorias() {
      var response = this.http.get(this.url);
      return response;
    }
    
}
