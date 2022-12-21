import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { io } from "socket.io-client";
import { GuestService } from 'src/app/services/guest.service';
import { RestService } from 'src/app/services/rest.service';
import { JsonPipe } from '@angular/common';
declare var iziToast:any;
declare var Cleave;
declare var StickySidebar;


@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {

  public idcliente;
  public token;
  public carrito_arr : Array<any> = [];
  public url;
  public subtotal = 0;
  public total_pagar : any = 0;
  public socket = io('http://localhost:4201');

  public cliente : any = {};
  public solicitante : any = {};

  public direccion_principal:any = {};
  public envios: Array<any>=[];
  public precio_envio = "0";
  private fileTmp:any;

  constructor(
    private _clienteService: ClienteService,
    private _guestService: GuestService,
    private restServices: RestService
  ) {
    this.url = GLOBAL.url;
    this.idcliente = localStorage.getItem('_id');
    this.token = localStorage.getItem('token');
    this._clienteService.obtener_carrito_cliente(this.idcliente,this.token).subscribe(
      response =>{
         this.carrito_arr = response.data;
         this.calcular_carrito();
      }
    );

    

    this._guestService.get_Envios().subscribe(
      response =>{
        this.envios = response;
        console.log(response);
      }
    )
   }

  ngOnInit(): void {
    setTimeout(()=>{
      new Cleave('#cc-number', {
        creditCard: true,
        onCreditCardTypeChanged: function (type) {
            // update UI ...
        }
      });

      new Cleave('#cc-exp-date', {
        date: true,
        datePattern: ['m', 'y']
      });

      var sidebar = new StickySidebar('.sidebar-sticky', {topSpacing: 20});
    });
    this.get_direccion_principal();
  }

  get_direccion_principal(){
    this._clienteService.obtener_direccion_principal_cliente(localStorage.getItem('_id'),this.token).subscribe(
      response =>{
        if(response.data == undefined){
          this.direccion_principal = undefined;
        }else{
          this.direccion_principal = response.data;
        }
      }
    );
  }
  calcular_total(){
    this.total_pagar = parseInt(this.subtotal.toString()) + parseInt(this.precio_envio);
  }

  calcular_carrito(){
    this.carrito_arr.forEach(element =>{
      this.subtotal = this.subtotal + parseInt(element.producto.precio);
    });
    this.total_pagar = this.subtotal;
  }

  eliminar_item(id:any){
    this._clienteService.eliminar_carrito_cliente(id,this.token).subscribe(
      response => {
        iziToast.show({
          title: 'SUCCESS',
          titleColor: '#1DC74C',
          color: '#FFF',
          class: 'text-success',
          position: 'topRight',
          message: 'Se eliminó el producto correctamente.',
          });
        this.socket.emit('delete-carrito', {data:response.data});
        this._clienteService.obtener_carrito_cliente(this.idcliente,this.token).subscribe(
          response =>{
             this.carrito_arr = response.data;
             this.calcular_carrito();
          }
        );
      }
    );
  }

  getFile($event: any): void {
    const [file] = $event.target.files;
    this.fileTmp = {
      fileRaw:file,
      fileName:file.name
    }
  }

  sendFile(): void {

    const body = new FormData();
    body.append('myFile', this.fileTmp.fileRaw, this.fileTmp.fileName)

    this.restServices.sendPost(body).
    subscribe(res => console.log(res))

    if(this.idcliente){

        this._clienteService.obtener_cliente_guest(this.idcliente , this.token).subscribe(
          response => {
            this.cliente = response.data;
            this.cliente.productos = this.carrito_arr

            console.log(this.cliente)
            console.log(this.carrito_arr)
            //let obj_unidos = Object.assign(this.cliente,prod)
           //console.log(obj_unidos)
            this.solicitantes(this.cliente)

          },
          error => {
  
          }
        )
    }; 
  }

  solicitantes(data:any){
    this._clienteService.enviar_cliente_solicitante(this.idcliente, data , this.token).subscribe(
      response => {
        this.solicitante = this.cliente;
        console.log(this.solicitante);
        iziToast.show({
          title: 'SUCCESS',
          titleColor: '#1DC74C',
          color: '#FFF',
          class: 'text-success',
          position: 'topRight',
          message: 'Tu solicitud se envio correctamente'
        });
      },
      error => {

      }
    )
  }

}
