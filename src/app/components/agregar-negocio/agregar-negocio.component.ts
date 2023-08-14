import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoriaService } from 'src/app/services/categoria/categoria.service';
import { NegocioService } from 'src/app/services/negocio/negocio.service';

import Swal from 'sweetalert2'

@Component({
  selector: 'app-agregar-negocio',
  templateUrl: './agregar-negocio.component.html',
  styleUrls: ['./agregar-negocio.component.css']
})
export class AgregarNegocioComponent implements OnInit {
  //esta variable es para el loading mientras carga la informacion de la pagina
  cargando:boolean=true;

  //esta variable controlará que el usuario no agregue masde 10 productos
  productosError: string="";
  //mensaje de error cuando se agreguen imagenes
  imagenesError: string="";
  //mensaje de error cuando se cargue incorrectamente una imagen
  imagenError: string=""
  //imagen del logotipo
  input_logo:string="";
  //variable para el select de categorias
  selectedOption: string=""
  //aqui guardamos las categorias
  categoriasArray:any;
  //latitude
  latitude: number=21.88186547214265;
  //longitude
  longitude: number=-102.29118377006671;  
  //localizacion elegida
  locationChosen = false;
  //dias de la semana  
  diasSemana: string[] = ['Lunes','Martes','Miercoles','Jueves','Viernes','Sabado','Domingo'];  
  //diasSemana: string[] = ['Lunes','Martes'];  

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
    nombre: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50), this.noWhitespaceValidator()]),
    categoria: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(600), this.noWhitespaceValidator]),
    img_logo: new FormControl('', [Validators.required, Validators.pattern(this.urlRegex)]),
  });

  //PRODUCTOS Y/O SERVICIOS fomrulario
  nuevoForm2: FormGroup;


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
  constructor(private http: HttpClient, private formBuilder: FormBuilder, private negocioService: NegocioService, private categoriasservice: CategoriaService, private router: Router) {
    
    //crear formulario 2 de productos y/o servicios
    this.nuevoForm2 = this.formBuilder.group({
      productosservicios: this.formBuilder.array([])
    });


    //crear formulario 3
    this.nuevoForm3=this.formBuilder.group({
      calle: new FormControl(''),
      num_calle: new FormControl(''),
      colonia: new FormControl(''),
      interior: new FormControl(''),
      cp: new FormControl(''),
      horarios: new FormControl(''),
    });

    //crea formulario 5
    this.nuevoForm5 = this.formBuilder.group({
      productosimagenes: this.formBuilder.array([]) // Aquí inicializas el FormArray
    });

    // Crear un FormControl para cada día y agregarlos al FormGroup
    this.diasSemana.forEach(dia => {
      this.horarios[dia] = new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(50), this.noWhitespaceValidator()]);
      this.nuevoForm3.addControl(dia, this.horarios[dia]);
    });
  }

  /*NG ONINIT()*/
  ngOnInit(): void {
    //cargamos las categorias primero
    this.cargarCategorias();
    this.agregarProducto();
    this.agregarImagen();
  }

  /*------------------------------------FUNCIONES--------------------------------------------*/
  //funcion para centrar al usuario al centro de la pantalla
  scrollToTop() {
    // Lleva al usuario hasta arriba de la pantalla
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  //funcion para evitar espacios en blanco no deseables al inicio o final de un texto
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

  cargarCategorias(){
    this.categoriasservice.cargarCategorias().subscribe((res:any)=>{
      this.categoriasArray = res;
      this.selectedOption=this.categoriasArray[0].nombre
      this.cargando = false;
    })
  }

  //funcion que actualiza si el usuario cambia de opcion en el select
  onCategoriaChange(event: any) {
    const categoriaNombre = event.target.value;
    this.nuevoForm.patchValue({
      categoria: categoriaNombre
    });
  }

  //PRODUCTOS Y/O SERVICIOS ---------------
  //agregarProducto
  agregarProducto() {
    this.productosServicios.push(this.formBuilder.control('', [Validators.required, this.noWhitespaceValidator(), Validators.minLength(3),Validators.maxLength(60)]));
  }

  removerProducto(index: number) {
    this.productosServicios.removeAt(index);
  }

  onInputChange(event: any, index: number) {
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
  agregarImagen() {
    this.productosImagenes.push(this.formBuilder.control('', [Validators.required, Validators.pattern(this.urlRegex)]));
  }

  removerImagen(index: number) {
    this.productosImagenes.removeAt(index);
  }


  //Actualizar imagenes in Image Previwe
  onInputChange2(event: any, index: number) {
  
  }


  //PAGINACION --------------------------------------------
  goToPage(pageNumber: number) {
    this.currentPage = pageNumber;
    this.scrollToTop()
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
    const valores = this.productosServicios.value;
    //console.log(valores);

    //console.log(this.nuevoForm2.value)
    this.guardar2=true;
    this.goToPage(3)
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
    // console.log(this.nuevoForm.value)
    // console.log(this.nuevoForm2.value)
    // console.log(this.nuevoForm3.value)
    // console.log("Latitude: "+ this.latitude+" Longitude: "+this.longitude)
    // console.log(this.nuevoForm4.value)
    // console.log(this.nuevoForm5.value)


    //borrar los dias de la semana del form3 y solamente dejar la variable horarios
    /*
    this.diasSemana.forEach(dia => {
      this.nuevoForm3.removeControl(dia);      
    });
    */
   
    //enviar al service de agregar
    this.negocioService.agregar(this.nuevoForm.value,this.nuevoForm2.value,this.nuevoForm3.value,this.nuevoForm4.value,this.nuevoForm5.value,this.latitude,this.longitude)
    .subscribe(async (res:any)=>{
      console.log(res)
      if(res=="agregado"){
        Swal.fire({
          icon: 'success',
          title: 'Negocio agregado',
          imageHeight:100,
          timer: 2500,
          showConfirmButton: false
        });
        this.router.navigate(['home']);
      }else if(res=="Ya existe un negocio con el mismo nombre"){
        Swal.fire({
          icon: 'error',
          title: res,
          imageHeight:100,
          showConfirmButton: true,
          confirmButtonColor: '#2F328A',
        });
      }
    },(error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error en el servidor',
        imageHeight: 400,
      })
    });
  }


  //Funcion para validar URLS de la web --------------------------------
  // validarURL(url: string): boolean {
  //   const urlRegex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i;
  //   return urlRegex.test(url);
  // }

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

    //limpiamos los campos de la direccion
    this.nuevoForm3.get('calle')?.patchValue("");
    this.nuevoForm3.get('num_calle')?.patchValue("");
    this.nuevoForm3.get('interior')?.patchValue("");
    this.nuevoForm3.get('colonia')?.patchValue("");
    this.nuevoForm3.get('cp')?.patchValue("");


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
  get productosServicios() {
    return this.nuevoForm2.get('productosservicios') as FormArray;
  }
  get productosImagenes() {
    return this.nuevoForm5.get('productosimagenes') as FormArray;
  }
}

