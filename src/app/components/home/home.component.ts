import { Component, OnInit } from '@angular/core';
import { NegocioService } from 'src/app/services/negocio/negocio.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  negociosList:any
  isCargando:boolean=true

  constructor(private negociosService: NegocioService) { }

  ngOnInit(): void {
    this.obtenerNegocios();
  }

  obtenerNegocios(){
    this.negociosService.getNegocios().subscribe(async (res:any)=>{
      this.isCargando=false;
      this.negociosList=res;
    })
  }

  scrollToTop() {
    // Lleva al usuario hasta arriba de la pantalla
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

}
