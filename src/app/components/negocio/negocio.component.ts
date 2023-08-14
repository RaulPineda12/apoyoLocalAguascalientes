import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NegocioService } from 'src/app/services/negocio/negocio.service';
import { Splide } from '@splidejs/splide';
import { AutoScroll } from '@splidejs/splide-extension-auto-scroll';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-negocio',
  templateUrl: './negocio.component.html',
  styleUrls: ['./negocio.component.css'],
})
export class NegocioComponent implements OnInit {
  //global variables
  colorprueba = '#FFFFF';
  //aqui se guardar el negocio que se llamo
  negocio: any;
  //meensaje de error si no se encontro el negocio
  encontrado = false;
  //variable para guardar las redes sociales
  redes_sociales:any;
  //para guardra los productos y/o servicios en un array
  productosServicios :Array<string> =[]
  //para guardar la direcion
  direccion:any
  //para guardar los horarios
  horarios:any
  //para guardar la ubicacion de google maps
  ubicacion:any
  //obtener ubicacion despues de usar DOM sanitizer
  getUbicacion:any
  //bandera para saber cuando cargo la ubicacion
  cargoUbicacion:boolean=false;
  //para guardar las imagenes
  imagenes:any
  //id del negocio que llega
  id:any
  //nombre del negocio que llega
  nombre:any


  constructor(
    private negocioService: NegocioService,
    private activateRouter: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {}

  ngOnInit(): void {
    //obtener negocio
    this.activateRouter.params.subscribe(async (params) => {
      this.nombre = await params['nombre'];
      this.id = params['id'];
      this.nombre = params['nombre'];

      this.negocioService.getNegocio(this.id).subscribe(async (res: any) => {
        //console.log(res);
        this.encontrado=true;
        if (res == null) {
          this.negocio=null
        } else if(res){
          this.negocio = res;

          //obtener redes sociales
          this.redes_sociales = JSON.parse(this.negocio.redes_sociales);
          //obtener productos
          this.productosServicios =  this.negocio.productos_servicios.split(",");
          //obtener direccion
          this.direccion = JSON.parse(this.negocio.direccion);
          //obtener horarios
          this.horarios= JSON.parse(this.negocio.horarios)
          //obtener ubciacion de google maps
          this.ubicacion = JSON.parse(this.negocio.ubicacion)
          //prueba
          this.getUbicacion = this.getMapUrl(this.ubicacion.latitude, this.ubicacion.longitude)
          //obtener imagenes
          this.imagenes = this.negocio.productos_imagenes.split(",")


        //iniciacion del carusel
        setTimeout(() => {
          const splide = new Splide('.splide', {
            type: 'loop',
            drag: 'free',
            focus: 'center',
            perPage: 3,
            autoScroll: {
              speed: 0.5,
            },
            }).mount({ AutoScroll });
            //fin de iniciacion
        }, 0);
        }
      });
    });
  }

    //obtener ubciacion de google maps
    getMapUrl(latitude: number, longitude: number): SafeResourceUrl {
      setTimeout(() => {
        
      }, 9000);
      const mapUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyDoUXXJkFY4Yg7BsNC5bkO7Bj5zB--y5PU&q=${latitude},${longitude}`;
      this.cargoUbicacion = true;
      return this.sanitizer.bypassSecurityTrustResourceUrl(mapUrl);
    }

    //eliminar negocio
    Eliminar(id:any){
      this.negocioService.eliminar(id).subscribe((res:any)=>{
        console.log(res)
        if(res !=null){
          Swal.fire({
            icon: 'success',
            title: 'Negocio eliminado',
            imageHeight:100,
            timer: 2500,
            showConfirmButton: false
          });
          this.router.navigate(['home']); 
        }else if(res==null){
          Swal.fire({
            icon: 'error',
            title: 'Error al eliminar',
            imageHeight:100,
            timer: 2500,
            showConfirmButton: false
          });
        }
      })
    }
}
