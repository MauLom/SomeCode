import { Component, OnInit, EventEmitter, Renderer2, ElementRef, ViewChild } from "@angular/core";
import { element } from "protractor";
import { Input } from "@angular/compiler/src/core";
import { RequestService } from 'src/app/services/request.service';

@Component({
  selector: 'buscador-sio',
  templateUrl: './buscador-copsis.component.html',
  styleUrls: ['./buscador-copsis.component.css'],
  inputs:[
    'idBuscador','debug','apiName','nameSearch',
    'data','remoteName','dataSource','text',
    'width', 'strSearch', 'aceptaNumero', 'minLetras', 
    'mensaje','isfocus', 'isfocusIntervalo', 'isSelect'],
  outputs:['textValue','redirect','strSearchChange','reiniciarProceso'],
  providers: [RequestService]
})
export class BuscadorCopsisComponent {
  @ViewChild('buscadorSio') buscadorSio:ElementRef;
  idBuscador:String = '';
  debug: boolean = false;
  isSelect:boolean = false;
  apiName:string = "";
  data:any = [];
  remoteName:string = "";
  dataSource:Array<any> = [];
  text:string = "";
  width:string="";
  minLetras:number=3;
  nameSearch:string="search";
  textValue = new EventEmitter();
  redirect = new EventEmitter<any>();
  strSearchChange = new EventEmitter();
  reiniciarProceso = new EventEmitter();
  mensaje:string = "No hay resultados";
  isfocus:boolean=false;
  isfocusIntervalo:number = 400;
  aceptaNumero:boolean = false;
  searchResult:any;
  searchEnabled = false;
  selected = undefined;
  strSearch = "";
  textoTemporal = "";
  keypressTimeout: any;
  host:HTMLElement;

  constructor(private requestService: RequestService,
    private element:ElementRef,
    private renderer2: Renderer2) { 
      this.host = element.nativeElement;
  }

  ngAfterViewInit() {
    if(this.width!=""){
      let elbuscadorContent:HTMLElement = <HTMLElement>this.host.querySelector(".buscador-content");
      elbuscadorContent.style.width = this.width;
      let elbuscador:HTMLElement = <HTMLElement>this.host.querySelector(".buscador");
      elbuscador.style.maxWidth = this.width;
    }
    if(this.isfocus){
      setTimeout(() => {
        this.buscadorSio.nativeElement.focus();
      }, this.isfocusIntervalo);
    }
  } 

  searchKeyUp(e) {
    this.strSearchChange.emit(this.strSearch);
    if (e.target.value.trim() == "") {
      this.selected = undefined;
      this.searchResult = [];
      this.searchEnabled = false;
    } else {
      var x1: string = "";
      var tecla = 0;
      x1 = e.target.value.trim();
      x1 = x1.replace(/[ ]/g, "%25");
      tecla = e.keyCode;
      if (tecla == 13) {
        if (this.selected != undefined) {
          this.getDetalle(this.searchResult[this.selected]);
        } else {
          if (!isNaN(parseInt(e.target.value)) && String(e.target.value).indexOf("-") == -1) {
            this.filtroBusquedaNumber(e.target.value);
          }
        }
      } else if ((!this.aceptaNumero) && 
        (tecla == 48 || tecla == 49 || tecla == 50 || tecla == 51 || 
          tecla == 52 || tecla == 53 || tecla == 54 || tecla == 55 || 
          tecla == 56 || tecla == 57 || tecla == 96 || tecla == 97 ||
          tecla == 98 || tecla == 99 || tecla == 100 || tecla == 101 || 
          tecla == 102 || tecla == 103 || tecla == 104 || tecla == 105 ||
          tecla == 37 || tecla == 39)
        ) {
        // Son números, no hacer nada, se agergaron las flechas laterales
        this.log("Son números, no hacer nada");
      } else {
        // Alguna letra                 
        if (tecla == 38 || tecla == 40) {
          if (tecla === 40) {
            if (this.searchResult.length > 0) {
              if (this.selected == undefined) {
                this.searchResult[0]["selected"] = true;
                this.strSearch = this.searchResult[0]["c2"];
                this.selected = 0;
              } else if (this.searchResult.length > (this.selected + 1)) {
                this.searchResult[this.selected]["selected"] = false;
                this.selected = this.selected + 1;
                this.searchResult[this.selected]["selected"] = true;
                this.strSearch = this.searchResult[this.selected]["c2"];
              }else if (this.searchResult.length == (this.selected + 1)){
                this.searchResult[this.selected]["selected"] = false;
                this.selected = undefined;
                this.strSearch = this.textoTemporal;
              }
            }
          } else {
            if (this.searchResult.length > 0) {
              if (this.selected != undefined) {
                if (this.selected == 0) {
                  this.searchResult[0]["selected"] = false;
                  this.selected = undefined;
                  this.strSearch = this.textoTemporal;
                } else {
                  this.searchResult[this.selected]["selected"] = false;
                  this.selected = this.selected - 1;
                  this.searchResult[this.selected]["selected"] = true;
                  this.strSearch = this.searchResult[this.selected]["c2"];
                }
              }else{
                this.selected = (this.searchResult.length - 1);
                this.searchResult[this.selected]["selected"] = true;
                this.strSearch = this.searchResult[this.selected]["c2"];
              }
            }
          }
          e.preventDefault();
          return;
        }else{
          this.textoTemporal = this.strSearch;
        }
        if (e.target.value != "" && x1.length > this.minLetras) {
          clearTimeout(this.keypressTimeout);
          this.keypressTimeout = setTimeout(() => {
              if (x1.length >= this.minLetras) {
                this.filtroBusqueda(x1, (tecla == 8));                                
              }
          }, 350); 
        }
      }
    }
  }

  private filtroBusquedaNumber(search: string){
    if(this.dataSource.length > 0){
      this.dataFilter(search);
    }else{
      this.requestSearch(search, false);
    }
  }

  handlerIgnored(e){
    if (this.searchResult.length > 0) {
      if (e.keyCode === 38 || e.keyCode === 40){
        e.preventDefault();
      }
    }
  }

  txHandler(opc: boolean) { 
    setTimeout(() => {
      if (opc) {
        if (this.searchResult.length == 0) {
          this.log("stringSearch when searchResult == 0 => ", this.strSearch);
          if(this.isSelect && this.strSearch != ""){
            this.buscadorSio.nativeElement.select();
          }
          //this.strSearch = "";
        }
        this.selected = undefined;
        this.searchResult = [];
        this.searchEnabled = false;      
      } else {
        this.selected = undefined;
        this.searchResult.forEach(element => {
          element.selected = false;
        });
        this.searchEnabled = false      
      }  
    }, 400);
  }

  getDetalle(data:any) {
    this.strSearch = data.c2;
    this.strSearchChange.emit(this.strSearch);
    this.redirect.emit(data);
    this.selected = undefined;
    this.searchResult = [];
    this.searchEnabled = false;
  }

  limpiarInput() {
    this.log("entra en evento de limpiar intput");
    this.strSearch = "";
    this.selected = undefined;
    this.searchResult = [];
    this.searchEnabled = false;
    this.textValue.emit("");
    this.reiniciarProceso.emit(true);
  }

  private filtroBusqueda(search: string, isBack:boolean){
    if(this.dataSource.length > 0){
      this.dataFilter(search);
    }else{
      this.requestSearch(search, isBack);
    }
  }

  dataFilter(search: string){
    if(this.dataSource.length > 0){
      this.selected = undefined;
      this.searchEnabled = true;
      this.searchResult = this.dataSource.filter((item, index) =>(item.c2.toLowerCase().indexOf(search.toLowerCase().replace(/[%25]/g, " ")) > -1));
    }
  }

  requestSearch(search: string, isBack:boolean) {
    let parameter = [];
    let searchObject = {};
    searchObject[this.nameSearch] = search;
    parameter.push(searchObject);
    if(this.data.length > 0){
      this.data.forEach(element => {
        parameter.push(element);
      });
    }
    if(this.remoteName == ""){
      this.requestService.getRequest(this.apiName, parameter).subscribe(
        result => {
          if(result.error){
            this.selected = undefined;
            this.searchEnabled = true;
            this.searchResult = [];
            console.error(result);
          }else{
            this.selected = undefined;
            this.searchEnabled = true;
            this.searchResult = result;            
            if(this.searchResult.length == 1 && !isBack){
              this.selected = 0;
              this.getDetalle(this.searchResult[this.selected]);
            }          
          }
        }, error => {
          this.selected = undefined;
          this.searchEnabled = true;
          this.searchResult = [];
          console.error(error);
        }
      );
    }else{
      this.requestService.getRequestRemote(this.remoteName, this.apiName, parameter).subscribe(
        result => {
          if(result.error){
            this.selected = undefined;
            this.searchEnabled = true;
            this.searchResult = [];
            console.error(result);
          }else{
            this.selected = undefined;
            this.searchEnabled = true;
            this.searchResult = result;
            if(this.searchResult.length == 1 && !isBack){
              this.selected = 0;
              this.getDetalle(this.searchResult[this.selected]);
            }
          }
        }, error => {
          this.selected = undefined;
          this.searchEnabled = true;
          this.searchResult = [];
          console.error(error);
        }
      );
    }
  }

  private log(evento: string, message?: any) {
    if (this.debug == true) {
      if(message){
        console.log(evento, message);
      }else{
        console.log(evento);
      }
    }
  }
}
