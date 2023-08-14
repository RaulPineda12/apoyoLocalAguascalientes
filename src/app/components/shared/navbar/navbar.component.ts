import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoriaService } from 'src/app/services/categoria/categoria.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  categorias:any;

  constructor(private router: Router, private categoriasService: CategoriaService) { }

  ngOnInit(): void {
    this.getCategorias();
  }

  getCategorias(){
    this.categoriasService.cargarCategorias().subscribe((res:any)=>{
      this.categorias=res
      console.log(res)
    })
  }
  //funcionar para cerrar el menu despues de un click
  CloseMenu() {
    this.scrollToTop();
    let element: HTMLElement = document.getElementsByClassName( 'navbar-toggler' )[ 0 ] as HTMLElement;
    if ( element.getAttribute( 'aria-expanded' ) == 'true' ) {
        element.click();
    }
  }

  CloseMenu2() {
    this.scrollToTop();
    let element: HTMLElement = document.getElementsByClassName( 'navbar-toggler' )[ 0 ] as HTMLElement;
    if ( element.getAttribute( 'aria-expanded' ) == 'true' ) {
        element.click();
    }
  }

  //funcion para enviar la categoria seleccionada
  navegarACategoria(categoria: string) {
    this.CloseMenu(); // Cierra el menú si es necesario
    this.scrollToTop();
    this.router.navigate(['/categoria', categoria]);
  }

  scrollToTop() {
    // Lleva al usuario hasta arriba de la pantalla
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deshabilitado(){
    this.CloseMenu()
    Swal.fire({
      title: 'Opción deshabilitada por el momento',
      icon: 'warning',
      showConfirmButton: false,
      timer: 2000,
    });
  }
}
