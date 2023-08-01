import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, PatternValidator, Validators } from '@angular/forms';

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
  horarios: { [key: string]: FormControl } = {};
  //pagina inicial de la paginación
  currentPage = 1;
  formData: any = {}; // Aquí almacenaremos los datos del formulario
  totalPages = 6; // Total de páginas en el formulario

  //url regex expression
  urlRegex =/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
  //phone number regex
  phoneRegex=/^\+?[1-9]\d{1,14}$/
  //cp Regex
  cpRegex=/^\d{5}(?:[-\s]\d{4})?$/


  //variables para guardar informacion
  guardar1: boolean=false;
  guardar2: boolean=false;
  guardar3: boolean=false;
  guardar4: boolean=false;
  guardar5: boolean=false;
  guardar6: boolean=false;

  //variable para verificar si el negocio cuenta con una direccion fisica
  tieneDireccion: boolean = false;


  //formulario reactivo
  //datos generales formulario
  nuevoForm = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(150)]),
    categoria: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]),
  });

  //productos y/o servicios fomrulario
  nuevoForm2 = new FormGroup({
    productosservicios: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(60)]),
  })

  nuevoForm3:FormGroup;

  nuevoForm4= new FormGroup({
    img_logo: new FormControl('', [Validators.required, Validators.pattern(this.urlRegex)]),
    imagenes: new FormControl('', [Validators.required, Validators.pattern(this.urlRegex)]),
    facebook: new FormControl('', [Validators.pattern(this.urlRegex)]),
    instagram: new FormControl('', [Validators.pattern(this.urlRegex)]),
    whatsapp: new FormControl('', [Validators.pattern(this.phoneRegex)]),
  })

  constructor(private http: HttpClient, private formBuilder: FormBuilder) {
    //crear formulario 3
    this.nuevoForm3=this.formBuilder.group({
      calle: new FormControl(''),
      num_calle: new FormControl(''),
      colonia: new FormControl(''),
      interior: new FormControl(''),
      cp: new FormControl(''),
      horario: new FormControl(''),
    });


      // Crear un FormControl para cada día y agregarlos al FormGroup
      this.diasSemana.forEach(dia => {
        this.horarios[dia] = new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(30)]);
        this.nuevoForm3.addControl(dia, this.horarios[dia]);
      });
  }

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
      this.imagenesError="Limite alcanzado!"
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

  //cambiar de pagina en la paginación
  goToPage(pageNumber: number) {
    this.currentPage = pageNumber;
  }

  //guardar1
  Guardar3(number: number){
  }
      //guardar1
  Guardar4(number: number){
    this.guardar4=true;
    this.goToPage(number)
  }
  //guardar1
  Guardar5(number: number){
    this.guardar5=true;
    this.goToPage(number)
  }
      //guardar1
  Guardar6(number: number){
    this.guardar6=true;
    this.goToPage(number)
  }

  //formulario parte 1
  nuevoSubmitted1() {
    console.log(this.nuevoForm.value.nombre)
    console.log(this.nuevoForm.value.descripcion)
    console.log(this.nuevoForm.value.categoria)

    this.guardar1=true;
    this.goToPage(2)
  }

  //formulario parte 2
  nuevoSubmitted2() {
    this.productosError="";
    this.nuevoForm2.value.productosservicios = this.inputList
    console.log(this.inputList)
    this.nuevoForm2.value.productosservicios.forEach((x:any) => {
      if(x['value'].length < 4 || x['value'].length > 60){
        this.productosError='Algun campo se encuentra vacio o no cumple con la norma de contener al menos 4 caracteres y un maximo de 60 caracteres'
      }
    });
    if(this.productosError == ""){
        //console.log(this.inputList)
        this.guardar2=true;
        this.goToPage(3)
    }
  }

  //formulario parte 3
  nuevoSubmitted3() {
    console.log(this.nuevoForm3.value)
    this.guardar3=true;
    this.goToPage(4)
  }

  //ver campos de direccion fisica
  verCamposDireccion1(){
    this.tieneDireccion=true;

    this.Calle.setValidators([Validators.required, Validators.minLength(4), Validators.maxLength(60)]);
    this.Colonia.setValidators([Validators.required, Validators.minLength(4), Validators.maxLength(60)]);
    this.Num_Calle.setValidators([Validators.required, Validators.minLength(2), Validators.maxLength(8)]);
    this.Cp.setValidators([Validators.required, Validators.pattern(this.cpRegex)]);
    this.Interior.setValidators([Validators.minLength(1), Validators.maxLength(4)]);
  
    this.Calle.updateValueAndValidity();
    this.Colonia.updateValueAndValidity();
    this.Num_Calle.updateValueAndValidity();
    this.Cp.updateValueAndValidity();
    this.Interior.updateValueAndValidity();

  }
  //ocultar campos de direccion fisica
  ocultarCamposDireccion2(){
    this.tieneDireccion=false;

    this.Calle.clearValidators();
    this.Calle.updateValueAndValidity();

    this.Colonia.clearValidators();
    this.Colonia.updateValueAndValidity();

    this.Num_Calle.clearValidators();
    this.Num_Calle.updateValueAndValidity();

    this.Cp.clearValidators();
    this.Cp.updateValueAndValidity();

    this.Interior.clearValidators();
    this.Interior.updateValueAndValidity();
  }

  //get de mis campos del formulario
  get Nombre(): FormControl {
    return this.nuevoForm.get('nombre') as FormControl;
  }
  get Descripcion(): FormControl {
    return this.nuevoForm.get('descripcion') as FormControl;
  }
  get Categoria(): FormControl {
    return this.nuevoForm.get('categoria') as FormControl;
  }
  get ProductosServicios(): FormControl {
    return this.nuevoForm2.get('productosservicios') as FormControl;
  }
  get Calle(): FormControl {
    return this.nuevoForm3.get('calle') as FormControl;
  }
  get Num_Calle(): FormControl {
    return this.nuevoForm3.get('num_calle') as FormControl;
  }
  get Colonia(): FormControl {
    return this.nuevoForm3.get('colonia') as FormControl;
  }
  get Interior(): FormControl {
    return this.nuevoForm3.get('interior') as FormControl;
  }
  get Cp(): FormControl {
    return this.nuevoForm3.get('cp') as FormControl;
  }
  get Horario(): FormControl {
    return this.nuevoForm3.get('horario') as FormControl;
  }
  get Img_Logo(): FormControl {
    return this.nuevoForm.get('img_logo') as FormControl;
  }
  get Imagenes(): FormControl {
    return this.nuevoForm.get('imagenes') as FormControl;
  }
}

