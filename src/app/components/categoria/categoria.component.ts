import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent implements OnInit {
  //variable que recibe que categoria buscar
  categoria:any;


  constructor(private activateRouter: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    //obtener la categoria
    this.activateRouter.params.subscribe(async (params) => {
      this.categoria = await params["categoria"];  

      console.log(this.categoria);
    });
  }
}
