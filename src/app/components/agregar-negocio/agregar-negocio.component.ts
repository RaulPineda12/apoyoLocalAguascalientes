import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

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
  //mensaje de error cuando se cargue incorrectamente una imagen
  imagenError: string=""
  //input image
  input_imagenes: any[] = [];
  //latitude
  latitude: number=21.88186547214265;
  //longitude
  longitude: number=-102.29118377006671;  
  //localizacion elegida
  locationChosen = false;
  //dias de la semana
  diasSemana: string[] = ['Lunes','Martes','Miercoles','Jueves','Viernes','Sabado','Domingo'];  
  //horarios del negocio
  horarios: { [key: string]: FormControl } = {};
  //pagina inicial de la paginación
  currentPage = 1;
  formData: any = {}; // Aquí almacenaremos los datos del formulario
  totalPages = 6; // Total de páginas en el formulario

  //Expresiones regulares
  //url regex expression
  urlRegex =/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
  //phone number regex
  phoneRegex=/^\+?[1-9]\d{1,14}$/
  //cp Regex
  cpRegex=/^\d{5}(?:[-\s]\d{4})?$/
  //regex para url de instagram
  instagramUrlRegex = /^(https?:\/\/)?(?:www\.)?instagram\.com\/.*/;
  //regex para url de facebook
  facebookUrlRegex = /^(https?:\/\/)?(?:www\.)?facebook\.com\/.*/;

  //variables para la paginacion
  guardar1: boolean=false;
  guardar2: boolean=false;
  guardar3: boolean=false;
  guardar4: boolean=false;
  guardar5: boolean=false;
  guardar6: boolean=false;

  //variable para verificar si el negocio cuenta con una direccion fisica
  tieneDireccion: boolean = false;


  //formulario reactivo
  //DATOS GENERALES formulario
  nuevoForm = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100), this.noWhitespaceValidator()]),
    categoria: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(500), this.noWhitespaceValidator]),
  });

  //PRODUCTOS Y/O SERVICIOS fomrulario
  nuevoForm2 = new FormGroup({
    productosservicios: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(60)]),
  })

  //DIRECCION Y HORARIOS formulario
  nuevoForm3:FormGroup;

  //REDES SOCIALES Formulario
  nuevoForm4= new FormGroup({
    facebook: new FormControl('', [Validators.pattern(this.facebookUrlRegex)]),
    instagram: new FormControl('', [Validators.pattern(this.instagramUrlRegex)]),
    whatsapp: new FormControl('', [Validators.pattern(this.phoneRegex)]),
  });

  //IMAGENES DE PRODUCTOS Y/O SERVICIOS formulario
  nuevoForm5: FormGroup


  /*CONSTRUCTOR*/
  constructor(private http: HttpClient, private formBuilder: FormBuilder) {
    
    //crear formulario 3
    this.nuevoForm3=this.formBuilder.group({
      calle: new FormControl(''),
      num_calle: new FormControl(''),
      colonia: new FormControl(''),
      interior: new FormControl(''),
      cp: new FormControl(''),
      horarios: new FormControl(''),
    });

    //formulario Imagenes
    this.nuevoForm5 = this.formBuilder.group({
      // Puedes dejar esto vacío ya que los formGroups individuales se agregarán dinámicamente
    });

    // Crear un FormControl para cada día y agregarlos al FormGroup
    this.diasSemana.forEach(dia => {
      this.horarios[dia] = new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(50), this.noWhitespaceValidator()]);
      this.nuevoForm3.addControl(dia, this.horarios[dia]);
    });
  }

  /*NG ONINIT()*/
  ngOnInit(): void {
    this.agregarImagen();
  }

  /*------------------------------------FUNCIONES--------------------------------------------*/
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

  scrollToCenter() {
    window.scrollTo({
      top: window.innerHeight / 20,
      left: window.innerWidth / 20,
      behavior: 'smooth'
    });
  }

  //funcion para evitar espacios en blanco no deseables
  noWhitespaceValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (value && value.trim().length === 0) {
        return { 'noWhitespace': true };
      } else if (value && value !== value.trim()) {
        return { 'noWhitespace': true };
      } else {
        return null;
      }
    }
  }

  //prevenir espacios en blanco
  preventSpace(event: KeyboardEvent) {
    if (event.key === ' ') {
      event.preventDefault();
    }
  }

  //PRODUCTOS Y/O SERVICIOS ---------------
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

  //UBICACION GOOGLE MAPS--------------------
  //elegir localizacion en maps
  onChoseLocation(event: any){
    this.latitude= event.coords.lat;
    this.longitude= event.coords.lng;
    this.locationChosen=true;
  }

  //guardar ubicacion
  GuardarUbicacion(){
    this.guardar4=true;
    //console.log(this.latitude)
    //console.log(this.longitude)
    this.goToPage(5)
  }

  //IMAGENES DE PRODUCTOS --------------------
  //agregar Imagen
  agregarImagen(): void {
    if(this.input_imagenes.length <=9){
      //creamos el nuevo input con sus validaciones
      const imagenFormGroup = this.formBuilder.group({
        url: ['',[Validators.required, Validators.pattern(this.urlRegex)]] // Puedes agregar otras validaciones aquí
      });

      //agregamos el nuevo input
      this.input_imagenes.push(imagenFormGroup);
      this.nuevoForm5.addControl(`imagen_${this.input_imagenes.length}`, imagenFormGroup);
    }else{
      Swal.fire({
        icon: 'error',
        title: "Limite de imagenes alcanzado",
        imageHeight: 100,
      })
    }
  }

  removerImagen(index: number): void {
    this.input_imagenes.splice(index, 1);
    this.nuevoForm5.removeControl(`imagen_${index + 1}`);
  }

  //Actualizar imagenes in Image Previwe
  onInputChange2(event: any, index: number) {
    try{
      this.input_imagenes[index].imagen = event.target.value; 
    }catch(e){
    }
  }


  //PAGINACION --------------------------------------------
  goToPage(pageNumber: number) {
    this.currentPage = pageNumber;
    this.scrollToCenter()
  }

  /*FORMULARIOS-------------------------------------------*/
  //formulario de datos generales
  nuevoSubmitted1() {
    //console.log(this.nuevoForm.value.nombre)
    //console.log(this.nuevoForm.value.descripcion)
    //console.log(this.nuevoForm.value.categoria)

    this.guardar1=true;
    this.goToPage(2)
  }

  //formulario de productos y/o servicios
  nuevoSubmitted2() {
    this.productosError="";
    this.nuevoForm2.value.productosservicios = this.inputList
    //console.log(this.inputList)
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

  //formulario de direccion y horarios
  nuevoSubmitted3() {
    //agregamos un formato json a los horarios
    var horarios : any=[]
    this.diasSemana.forEach(dia => {
      let nuevo = {
        [dia] : this.nuevoForm3.get(dia)?.value
      }
      horarios.push(nuevo)
    });

    this.nuevoForm3.get('horarios')?.patchValue(horarios);
    //ahora eliminamos

    this.guardar3=true;
    this.goToPage(4)
  }

  //formulario de redes sociales
  nuevoSubmitted4() {
    //console.log(this.nuevoForm4.value)
    this.guardar4=true;
    this.guardar5=true;
    this.goToPage(6)
  }

  //formulario de imagenes de productos y/o servicios
  nuevoSubmitted5(): void {
    console.log(this.nuevoForm.value)
    console.log(this.nuevoForm2.value)
    console.log(this.nuevoForm3.value)
    console.log("Latitude: "+ this.latitude+" Longitude: "+this.longitude)
    console.log(this.nuevoForm4.value)
    console.log(this.nuevoForm5.value)


    this.diasSemana.forEach(dia => {
      this.nuevoForm3.removeControl(dia);      
    });

  }


  //Funcion para validar URLS de la web --------------------------------
  validarURL(url: string): boolean {
    const urlRegex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;
    return urlRegex.test(url);
  }

  //ver campos de direccion fisica --------------------------------------
  verCamposDireccion1(){
    this.tieneDireccion=true;

    this.Calle.setValidators([Validators.required, Validators.minLength(2), Validators.maxLength(60), this.noWhitespaceValidator()]);
    this.Colonia.setValidators([Validators.required, Validators.minLength(3), Validators.maxLength(60), this.noWhitespaceValidator()]);
    this.Num_Calle.setValidators([Validators.required, Validators.minLength(2), Validators.maxLength(8), this.noWhitespaceValidator()]);
    this.Cp.setValidators([Validators.required, Validators.pattern(this.cpRegex)]);
    this.Interior.setValidators([Validators.minLength(1), Validators.maxLength(5), this.noWhitespaceValidator()]);
  
    this.Calle.updateValueAndValidity();
    this.Colonia.updateValueAndValidity();
    this.Num_Calle.updateValueAndValidity();
    this.Cp.updateValueAndValidity();
    this.Interior.updateValueAndValidity();

  }
  //ocultar campos de direccion fisica ---------------------------------
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

  //Funciones para obtener los valores de mis FormGroups
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
  get Img_Logo(): FormControl {
    return this.nuevoForm.get('img_logo') as FormControl;
  }
  get Url(): FormControl {
    return this.nuevoForm.get('imagenes') as FormControl;
  }
  get Facebook(): FormControl{
    return this.nuevoForm4.get('facebook') as FormControl
  }
  get Instagram(): FormControl{
    return this.nuevoForm4.get('instagram') as FormControl
  }
  get Whatsapp(): FormControl{
    return this.nuevoForm4.get('whatsapp') as FormControl
  }
}

