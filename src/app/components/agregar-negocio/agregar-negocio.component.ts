import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-agregar-negocio',
  templateUrl: './agregar-negocio.component.html',
  styleUrls: ['./agregar-negocio.component.css']
})
export class AgregarNegocioComponent implements OnInit {

  //esta variable servira para manejar los inputs dinamicos para los productos
  inputList: { value: string }[] = [];
  //esta variable controlará que el usuario no agregue masde 10 productos
  productosError: string="";

  imagenesError: string="";

  //input image
  input_imagenes:{imagen: string}[]=[];

  //latitude
  latitude: number=21.88186547214265;
  //longitude
  longitude: number=-102.29118377006671;  
  //localizacion elegida
  locationChosen = false;

  diasSemana: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  horarios: { [key: string]: string } = {};

  constructor() { }

  ngOnInit(): void {
  }

  Agregar() {
  }

  //PRODUCTOS Y/O SERVICIOS
  //agregarProducto
  agregarProducto() {
    //condicion para que el ususario no agregue mas de 10 productos
    if(this.inputList.length<=7){
      this.inputList.push({ value: '' });
    }else{
      this.productosError="Ya no puedes agregar mas productos y/o servicios"
      Swal.fire({
        icon: 'error',
        title: this.productosError,
        imageHeight: 100,
      })
    }
  }

  //remover producto
  removerProducto(index: number) {
    this.inputList.splice(index, 1);
  }

  //productos
  onInputChange(event: any, index: number) {
    this.inputList[index].value = event.target.value;
  }

  //IMAGENES
  //agregar Imagen
  agregarImagen() {
    //condicion para que el ususario no agregue mas de 10 productos
    if(this.input_imagenes.length<=3){
      this.input_imagenes.push({ imagen: '' });
    }else{
      this.imagenesError="Ya no puedes agregar mas imagenes"
      Swal.fire({
        icon: 'error',
        title: this.imagenesError,
        imageHeight: 100,
      })
    }
  }

  //remover imagen
  removerImagen(index: number) {
    this.input_imagenes.splice(index, 1);
  }
  

  //imagenes
  onInputImageChange(event: any, index: number) {
    this.input_imagenes[index].imagen = event.target.value;
  }

  //elegir localizacion en maps
  onChoseLocation(event: any){
    this.latitude= event.coords.lat;
    this.longitude=event.coords.lng;
    this.locationChosen=true;
  }

  //obtener horarios
  guardarHorarios() {
    // Aquí puedes manejar la lógica para guardar los horarios en tu base de datos o donde sea necesario
    alert(this.horarios);
  }

  imprimirImagenes(){
    alert(this.input_imagenes)
  }

}

