import { Component, OnInit } from '@angular/core';
import { GoogleChartService } from 'src/app/services/google-chart.service';
import { RequestService } from 'src/app/services/request.service';
import { HttpClient } from '@angular/common/http';
import { Combo } from 'src/app/models/custom.model';
import { coerceStringArray } from '@angular/cdk/coercion';
//import { Constant } from 'src/app/utilities/constants';

@Component({
  selector: 'app-tableros-principal',
  templateUrl: './tableros-principal.component.html',
  styleUrls: ['./tableros-principal.component.css'],
  providers: []
})
export class TablerosPrincipalComponent implements OnInit {
  public tipoGrafica:number = 0;
  public opcionTipoGrafica:Array<Combo> = [{ value: 1, text: "Prima Pagada" },{ value: 2, text: "Prima Emitida" }];
  public periodos:Array<Combo> = [];
  public periodoSelecionado:number = 0;
  public ramos:Array<Combo> = [];
  public ramoSeleccionado:number = 0;
  public cltIdSlct:number = 0;

  private gLib: any;
  public loader = false;
  public xClientesData = [];
  public xRamosData = [];
  public comparativoData = [];
  public acumulativoData = []
  public treeMapData: any = null;
  public datosCargados = false;
  
  
  public nuevosDatos = false;
  public primasPorClientes: any;
  public primasPorRamos: any;
  public comparativo: any;
  public acumulativo: any;
  
  public strSearch = "";

  public urlBuscador = localStorage.getItem("dominio") + "/sio4aclientes-new/";

  constructor(private gChartService: GoogleChartService, private requestService: RequestService) {
    this.gLib = this.gChartService.getGoogle();
    this.gLib.charts.load('current', { 'packages': ['corechart', 'table', 'treemap'] });
  }

  ngOnInit(): void {
    this.periodos = [];
    for(let i = 0; i <= 10; i++){
      this.periodos.push({value: new Date().getFullYear() - i, text: (new Date().getFullYear() - i).toString() });
    }
    console.log("periodos", this.periodos);
  }

  drawChart() {
    this.treeMapData = this.gLib.visualization.arrayToDataTable(this.xClientesData);
    let data2 = this.gLib.visualization.arrayToDataTable(this.xRamosData);
    let data3 = this.gLib.visualization.arrayToDataTable(this.comparativoData);
    let data4 = this.gLib.visualization.arrayToDataTable(this.acumulativoData);
    /* Type and containers section*/
    this.primasPorClientes = new this.gLib.visualization.TreeMap(document.getElementById('tabla1'));
    this.primasPorRamos = new this.gLib.visualization.PieChart(document.getElementById('tabla2'));
    this.comparativo = new this.gLib.visualization.ColumnChart(document.getElementById('tabla3'));
    this.acumulativo = new this.gLib.visualization.LineChart(document.getElementById('tabla4'));
    this.gLib.visualization.events.addListener(this.primasPorClientes, 'select', this.escuchando);
    /** */
    
    /* Draw sections*/
    this.primasPorClientes.draw(this.treeMapData, { title: 'Primas pagadas por cliente', titleTextStyle: { color: "#000", fontName: "Roboto", fontSize: 20, bold: true }, generateTooltip: this.treeMapTooltips });
    this.primasPorRamos.draw(data2, { title: 'Primas pagadas por ramo', titleTextStyle: { color: "#000", fontName: "Roboto", fontSize: 20, bold: true }, pieHole: 0.4 });
    this.comparativo.draw(data3, {title: 'Comparativo', titleTextStyle: { color: "#000", fontName: "Roboto", fontSize: 20, bold: true } });
    this.acumulativo.draw(data4, {title: 'Acumulativo', titleTextStyle: { color: "#000", fontName: "Roboto", fontSize: 20, bold: true } });

    // this.gLib.visualization.events.addListener(this.comparativo, 'click', this.onclickEvent);
  }

  onclickEvent(event){
    console.log("onclickEvent", event);
    console.log("onclickEvent", this.comparativo);
  }

  obtenerDatos(periodo:number, periodoAnterior:number, clt?:number, rm?:number) {
    this.loader = true;
    this.nuevosDatos = false;
    switch (this.tipoGrafica) {
      case 1: {
        let data = [{ "f1": periodo }, { "f2": periodoAnterior }, { "d1": "0" }, { "d2": null != clt ? clt : "" }, { "d3": null != rm ? rm : "" }];
        this.requestService.getRequest("Sio4GraficasPrimaPagadaAPI", data).subscribe(result => {
          if (!result.error) {
            this.xClientesData = result.xClientes;
            this.xRamosData = result.xRamos;
            this.comparativoData = result.Comparativo;
            this.acumulativoData = result.Acumulativo;
            this.ramos = result.Ramos;
            if (!this.datosCargados) {
              this.gLib.charts.setOnLoadCallback(this.drawChart.bind(this));
            }
            this.gLib.charts.setOnLoadCallback(this.drawChart.bind(this));
            this.loader = false;
            this.datosCargados = true;
          } else {
            console.error("There was an error getting the info")
            this.loader = false;
          }
        });
        break;
      }
      case 2: {
        let data = [{ "f1": periodo }, { "f2": periodoAnterior }, { "d1": "0" }, { "d2": null != clt ? clt : "" }, { "d3": null != rm ? rm : "" }];
        this.requestService.getRequest("Sio4GraficasPrimaNetaAPI", data).subscribe(result => {
          if (!result.error) {
            this.xClientesData = result.xClientes;
            this.xRamosData = result.xRamos;
            this.comparativoData = result.Comparativo;
            this.acumulativoData = result.Acumulativo;
            this.ramos = result.Ramos;
            if (!this.datosCargados) {
              this.gLib.charts.setOnLoadCallback(this.drawChart.bind(this));
            }
            this.gLib.charts.setOnLoadCallback(this.drawChart.bind(this));
            this.loader = false;
            this.datosCargados = true;
          } else {
            console.error("There was an error getting the info")
            this.loader = false;
          }
        });
        break;
      }
    }
  }

  obtenerPeriodos() {
    if (this.datosCargados) {
      this.periodoSelecionado = 0;
      this.ramoSeleccionado = 0;
      this.datosCargados = false;
      this.nuevosDatos = true;
    }
    /*
    this.loader = true;
    switch (this.tipoGrafica) {
      case 1:
        let data = [{ "f1": "" }, { "f2": "" }, { "d1": "1" }];
        this.requestService.getRequest("Sio4GraficasPrimaPagadaAPI", data).subscribe(result => {
          if (!result.error) {
            this.periodos = result.xPeriodos;
            this.loader = false;
          } else {
            console.error("There was an error gettint the info")
          }
        });
        break;
      case 2:
        let data2 = [{ "f1": "" }, { "f2": "" }, { "d1": "1" }];
        this.requestService.getRequest("Sio4GraficasPrimaNetaAPI", data2).subscribe(result => {
          if (!result.error) {
            this.periodos = result.xPeriodos;
            this.loader = false;
          } else {
            console.error("There was an error gettint the info")
          }
        });
        break;
    }
    */
  }

  treeMapTooltips(row, prima, value) {
    return '<div style="position:absolute; background:#fd9; padding:10px; border-style:solid">Prima:' + parseFloat(prima).toFixed(2).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,'); + '</div>';
  }

  indiceSeleccionado(idx) {
    this.ramoSeleccionado = 0;
    let periodoAnterior = (this.periodoSelecionado - 1);
    this.obtenerDatos(this.periodoSelecionado, periodoAnterior);
  }

  escuchando(e) {
    console.log("Listener", this.primasPorClientes.getSelection());
  }

  reiniciarProceso(event) {
    this.ramoSeleccionado = 0;
    let periodoAnterior = (this.periodoSelecionado - 1);
    this.obtenerDatos(this.periodoSelecionado, periodoAnterior, null, this.ramoSeleccionado)
  }

  filtrarCliente(obj: any) {
    if (this.tipoGrafica > 0) {
      this.cltIdSlct = obj.c1;
      let periodoAnterior = (this.periodoSelecionado - 1);
      this.obtenerDatos(this.periodoSelecionado, periodoAnterior, this.cltIdSlct, this.ramoSeleccionado);
    } else {
      this.strSearch = "";
    }
  }
}
