import { HttpClient } from '@angular/common/http';
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

  //mensaje de error cuando se agreguen imagenes
  imagenesError: string="";

  //input image
  input_imagenes:{imagen: string}[]=[];

  //latitude
  latitude: number=21.88186547214265;
  //longitude
  longitude: number=-102.29118377006671;  
  //localizacion elegida
  locationChosen = false;

  //dias de la semana
  diasSemana: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  //horarios del negocio
  horarios: { [key: string]: string } = {};

  currentPage = 1;
  formData: any = {}; // Aquí almacenaremos los datos del formulario
  totalPages = 5; // Total de páginas en el formulario


  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  crear(){
    Swal.fire({
      icon: 'success',
      title: 'Negocio creado',
      imageHeight: 100,
      showConfirmButton: false,
      width: 400,
      timer: 2000,
    })
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
    // Realiza la solicitud a la API de oEmbed de Instagram
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
    console.log(this.horarios);
  }

  imprimirImagenes(){
    console.log(this.input_imagenes)
  }

  
  goToPage(pageNumber: number) {
    this.currentPage = pageNumber;
  }
  onFormSubmitPage1() {
    // Aquí puedes manejar los datos del formulario de la página 1
    console.log('Datos del formulario - Página 1:', this.formData);
  }

  onFormSubmitPage2() {
    // Aquí puedes manejar los datos del formulario de la página 2
    console.log('Datos del formulario - Página 2:', this.formData);
  }
}

