import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NegocioService } from 'src/app/services/negocio/negocio.service';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent implements OnInit {
  //variable del loading mientras carga la pagina
  isCargando:boolean=true;
  //variable que recibe que categoria buscar
  categoria:string="";
  //mensaje de que no hay negocios con esta categoria
  message =""
  //aqui se almacenaran los negocios obtenidos por la categoria dada
  listNegocios:any;
  //maximo de caracteres que desplegar en la descripcion del negocio
  maxCharacters: number = 100; 



  constructor(private activateRouter: ActivatedRoute, private router: Router, private negocioService: NegocioService) { }


  ngOnInit(): void {
    //obtener la categoria
    this.activateRouter.params.subscribe( async (params) => {
      this.categoria = await params["categoria"]; 

        this.negocioService.getPorCategoria(this.categoria).subscribe((res:any)=>{
          //console.log(res)
          this.isCargando=false;
          if(res != null){
            this.listNegocios=res
          }else{
            this.listNegocios=null;
            this.message="No hay negocios con esta categoria"
          }
        })
    });
  }


  //limitar la descripcion que aparece en el negocio
  trimmedMessage(index: number): string {
    if (this.listNegocios[index].descripcion.length <= this.maxCharacters) {
      return this.listNegocios[index].descripcion;
    } else {
      return this.listNegocios[index].descripcion.substring(0, this.maxCharacters) + '...';
    }
  }

  scrollToTop() {
    // Lleva al usuario hasta arriba de la pantalla
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
