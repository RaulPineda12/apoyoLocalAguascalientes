import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Form } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class NegocioService {

  constructor(private http: HttpClient) { }

  //url
  url = 'https://localhost:44387/api/Negocios/';

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

  //agregar articulo
  agregar(form1: any, form2:any,form3:any,form4:any,form5:any, latitude:number, longitude:number) {
    let  _nombre = form1['nombre']
    let  _descripcion= form1['descripcion']
    let  _categoria= form1['categoria']
    let _img_logo = form1['img_logo']

    let csvProductosServicios: string = form2['productosservicios'].join(',');
    let _productosservicios: string = csvProductosServicios;


    let _direccionJson={
      'calle': ''+form3['calle'],
      'numero': ''+form3['num_calle'],
      'interior': ''+form3['interior'],
      'colonia' : ''+form3['colonia'],
      'cp' : form3['cp'],
    }
    let _direccionString: string = JSON.stringify(_direccionJson);


    let _horariosJson={
      lunes: form3['Lunes'],
      martes: form3['Martes'],
      miercoles: form3['Miercoles'],
      jueves: form3['Jueves'],
      viernes: form3['Viernes'],
      sabado: form3['Sabado'],
      domingo: form3['Domingo'],
    }
    let _horariosString: string = JSON.stringify(_horariosJson);

    
    let _ubicacionJson ={
      'latitude': latitude,
      'longitude': longitude
    }
    let _ubicacionStirng: string = JSON.stringify(_ubicacionJson);


    let _redes_sociales={
      'facebook' : form4['facebook'],
      'instagram': form4['instagram'],
      'whatsapp': form4['whatsapp']
    }
    let _redesString: string = JSON.stringify(_redes_sociales);


    let csvimg_productos: string = form5['productosimagenes'].join(',');
    let _img_productos: string = csvimg_productos;

    return this.http.post(this.url + 'Agregar',
      {
        nombre: _nombre,
        descripcion: _descripcion,
        categoria: _categoria,
        img_logo: _img_logo,
        productos_servicios: _productosservicios,
        direccion: _direccionString,
        horarios: _horariosString,
        ubicacion: _ubicacionStirng,
        redes_sociales: _redesString,
        productos_imagenes: _img_productos
      },
      {
        responseType: 'text',
      }
    );
  }
}
