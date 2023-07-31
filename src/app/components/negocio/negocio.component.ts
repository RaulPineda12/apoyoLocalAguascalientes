import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NegocioService } from 'src/app/services/negocio/negocio.service';
import { Splide } from '@splidejs/splide';
import { AutoScroll } from '@splidejs/splide-extension-auto-scroll';

@Component({
  selector: 'app-negocio',
  templateUrl: './negocio.component.html',
  styleUrls: ['./negocio.component.css']
})
export class NegocioComponent implements OnInit {

  //global variables

  //variable que guarda el nombre del negocio que se mando a obtener
  nombre: string="";
  colorprueba="#FFFFF"


  constructor(private negocioService: NegocioService, private activateRouter: ActivatedRoute) { }

  ngOnInit(): void {
    const splide = new Splide( '.splide', {
      type   : 'loop',
      drag   : 'free',
      focus  : 'center',
      perPage: 3,
      autoScroll: {
        speed: 0.5,
      },
    }).mount({AutoScroll});
  }
}
