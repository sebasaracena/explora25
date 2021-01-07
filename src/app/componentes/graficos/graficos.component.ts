import { Component, OnInit } from '@angular/core';
import {ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color,Label, SingleDataSet } from 'ng2-charts';
import { Cartografia } from '../../modelo/cartografia';
import { MapaService } from '../../servicio/mapa.service';
import Swal from 'sweetalert2';

declare let L;
@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.component.html',
  styleUrls: ['./graficos.component.css']
})
export class GraficosComponent implements OnInit {
  //datos publicos para un grafico de barras//

  public lineChartData: ChartDataSets[]=[{data:[],label:"profe"}];
  public lineChartLabels: Label[]=[];
  public lineChartOptions: ChartOptions = {
    responsive: true,
  };
  public lineChartColors: Color[] =[
    {
     
      backgroundColor: 'rgba(0,0,255,0.7)',
      
    },
   
  ];
  public lineChartLegend = true;
  public lineChartType: ChartType = 'bar';
  public lineChartPlugins = [];
  //datos publicos de pie chart//
  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[] = ['x','y'];
  public pieChartData: SingleDataSet = [];
  public pieChartColors = [
    {
      backgroundColor: ['rgba(255,0,0,0.5)', 'rgba(0,0,255,0.7)'],
    },
  ];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];
  //** Fin de la pie chart **//
  docente:any;
  categoria:any;
  dependencia:any;
  asesoria:any;
  categorias='Todas';
  //** Cartografia */
  Layer:any=null;
  map:any;
  espacio:any;
  total:number;
  total_asesoria:number;
  crecyt_rbd:any;
  colegio="Establecimientos";
  rbd="all";

  cartografia:Cartografia={
    anio:'all',
    rbd:'all',
    term:'',
    seleccion:'all',
    espacio:'all',
    categoria:'all',

  }
  constructor(private mapas:MapaService) { }

  ngOnInit() {
    this.pie_chart();
    this.iniciar_mapa();
    this.put_layer();
    this.get_espacio();
    this.get_categoria();
    this.get_dependencia();
    this.get_asesoria();  
  }
  // funciones de graficos
  pie_chart(){
    this.mapas.get_genero(this.cartografia).subscribe(
      resp=>{
        let cantidad=[];
        let nombres=[];
        
        this.docente=resp;
        for(let i=0;i<Object.keys(this.docente).length;i++){
          cantidad.push(this.docente[i].cantidad);
          nombres.push(this.docente[i].genero);
       }
        
        this.pieChartData=cantidad;
         this.pieChartLabels=nombres;
      }
    );
  }

  get_categoria(){
    this.mapas.get_categoria(this.cartografia).subscribe(
      resp=>{
        let cantidad=[];
        let nombres=[];
        
        this.categoria=resp;
        for(let i=0;i<Object.keys(this.categoria).length;i++){
          cantidad.push(this.categoria[i].cantidad);
          nombres.push(this.categoria[i].categoria);
       }
        
       this.lineChartData=[{data: cantidad,label:'Categoria'}];
       
       this.lineChartLabels=nombres;   
      }
    );
  }

  chartClicked(e:any): void {
    if (e.active.length > 0) {
      const chart = e.active[0]._chart;
      const activePoints = chart.getElementAtEvent(e.event);
        if ( activePoints.length > 0) {
          // get the internal index of slice in pie chart
          const clickedElementIndex = activePoints[0]._index;
          const label = chart.data.labels[clickedElementIndex];
          // get value by index
          const value = chart.data.datasets[0].data[clickedElementIndex];
          this.cartografia.categoria=label;
          this.categorias=label;
          //console.log(clickedElementIndex, label, value);
          this.put_layer();
          this.get_dependencia();
          this.get_asesoria();
        }
       }
  }
//funciones para la cartografia//
  iniciar_mapa(){
    const mapOSM = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic3VwZXJzYngwMCIsImEiOiJjaWpsZ3FsN3QwMDIydGhtNTh4aGhubG5xIn0.i2J0k0mBZhIi7W-bsPTJiQ", {
        maxZoom: 18,
        minZoom: 8,
        id: "mapbox.streets"
    });

    this.map = L.map("map", {
      zoom: 6,
      layers: [mapOSM]

   }).setView([-18.466011,-70.1814037], 8);
 
   this.map.on("click", e => {
     
    this.reiniciar_mapa();
    //console.log(e.latlng); // get the coordinates
  });



  }


construir_layer(map:any,data:any){
    var geojson=data;

    geojson = {
"type": "FeatureCollection",
"features": []
};
    
    const fields = ["rbd","nombre","cosas"];
   
    //split data into features
var dataArray = data.split("¥ ;");
dataArray.pop();

  

dataArray.forEach(function(d){
d = d.split("¥ "); //split the data up into individual attribute values and the geometry
          
//feature object container
var feature = {
  "type": "Feature",
  "properties": {}, //properties object container
  "geometry": JSON.parse(d[fields.length]) //parse geometry
};

for (var i=0; i<fields.length; i++){
  if(i==fields.length-1) feature.properties[fields[i]]=fields[i];
   else feature.properties[fields[i]] = d[i];
  
                                
};

//add feature names to autocomplete list


geojson.features.push(feature);
            
});

this.Layer = new L.geoJson(geojson,{pointToLayer: function(feature,latlng){
  return L.marker(latlng, {
    icon: L.icon({
    iconUrl: './assets/leaflet/images/x_ve.png',
    iconSize: [24,24],
    iconAnchor: [12, 28],
    popupAnchor: [0, -25]
  })
}
        );
},
// funcion para cada punto
onEachFeature: function(feature, Layer){
 
  if (feature.properties) {
   
     Layer.on({
        
     click: function (e) {
      
         clickcambio(feature.properties.nombre,feature.properties.rbd);
         
       
       map.setView([Layer.getLatLng().lat,Layer.getLatLng().lng],14);
       //highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
     }
   });
   }
  
 }
   


});


map.addLayer(this.Layer);
map.fitBounds(this.Layer.getBounds());
this.Layer.on('click',e => {
  this.colegio=localStorage.getItem("colegio");
  this.rbd=localStorage.getItem("rbd");
   this.cartografia.rbd=localStorage.getItem("rbd");
   this.cartografia.categoria='all';
   this.categorias='Todas';
   this.get_crecyt_rbd();
   this.pie_chart();
   this.get_categoria();
   this.get_asesoria();
   //console.log(e.latlng); // get the coordinates
});
return 0;
}

put_layer(){
  this.mapas.get_layer_grafico(this.cartografia).subscribe(
    resp=>{
      
       if(this.Layer!=null) this.map.removeLayer(this.Layer);
      if(resp!="no existe"){
        

      this.construir_layer(this.map,resp);
      }
    }
  );

}

reiniciar_mapa(){
   localStorage.setItem("rbd","all");
   localStorage.setItem("colegio","Establecimiento");
   
   this.rbd=localStorage.getItem("rbd");
   this.colegio=localStorage.getItem("colegio");
   this.cartografia.rbd=this.rbd;
   this.cartografia.term='';
    this.cartografia.categoria='all';
    this.categorias='Todas';
   this.map.removeLayer(this.Layer);
   this.put_layer();
   this.pie_chart();
   this.get_categoria();
   this.get_dependencia();
   this.get_asesoria();
}
//**FIN *//
get_espacio(){
  //console.log("pescalo");
  this.mapas.get_espacio(this.cartografia.anio).subscribe(
    resp=>{
      this.espacio=resp;
      //console.log(this.espacio);
    }
  );
}

get_dependencia(){
  this.mapas.get_dependencia(this.cartografia).subscribe(
    resp=>{
      this.dependencia=resp;
      this.total=0;
      //console.log(this.dependencia);
      for(let i=0;i<Object.keys(this.dependencia).length;i++){
           this.total=this.total+parseInt(this.dependencia[i].cantidad); 
      
     }
    }
  );
}
get_asesoria(){
  this.mapas.get_asesoria(this.cartografia).subscribe(
    resp=>{
      this.asesoria=resp;
      this.total_asesoria=0;
      
      for(let i=0;i<Object.keys(this.asesoria).length;i++){
           this.total_asesoria=this.total_asesoria+parseInt(this.asesoria[i].cantidad); 
      
     }
    }
  );
}
//** Seleccionar Anio **//
seleccion_anio(){
  this.map.removeLayer(this.Layer);
  this.put_layer();
  this.get_espacio();
  this.pie_chart();
  this.get_categoria();
  this.get_dependencia();
  this.get_asesoria();
}

onChangeSearch(val:string){
  //console.log(val);
  this.cartografia.term=val;
  localStorage.setItem("rbd",'all');
  localStorage.setItem("colegio","Establecimiento");
  
  this.cartografia.rbd=localStorage.getItem("rbd");
  
  this.rbd=localStorage.getItem("rbd");
  this.colegio=localStorage.getItem("colegio");
  
 
  this.put_layer();
  this.pie_chart();
  this.get_categoria();
  
}
get_crecyt_rbd(){
  this.mapas.get_categoria(this.cartografia).subscribe(
  resp=>{
   let total=0; 
   this.crecyt_rbd=resp;
   for(let i=0;i<Object.keys(this.crecyt_rbd).length;i++) total=total+parseInt(this.crecyt_rbd[i].cantidad);
   var html=this.get_html(this.crecyt_rbd,total);
 Swal.fire(
   {
     title:this.colegio,
     html: html,
     showClass: {
       popup: 'animated fadeInDown faster'
     },
     hideClass: {
       popup: 'animated fadeOutUp faster'
     },
     allowOutsideClick: true
   }
 );
  }
  );
}

get_html(pregion:any,total:number):string{
  //console.log(pregion);
  
  let html='<hr/><h6>'+ total+' Trabajos Presentados</h6> <hr/><div class="table-responsive">'+
             '<table class="map table border-1" style="height: 250px; overflow:auto;">'+
      '<thead class="thead-dark">'+
          '<tr>'+
              
              
              '<th scope="col">Categoria</th>'+
              '<th scope="col">Trabajos</th>'+
              '<th scope="col">Año</th>'+
          '</tr>'+
      '</thead>'+
     '<tbody>';
     for(let i=0;i<Object.keys(pregion).length;i++){     
          html +='<tr">'+
              '<th>'+pregion[i].categoria+'</th>'+
              '<td>'+pregion[i].cantidad+ '</td>'+
              '<td>'+pregion[i].anio+ '</td>'+

         '</tr>';
}
html +='</tbody>'+

  '</table>'+
'</div><hr/>';

  return html;
}


}

function clickcambio(val1:string,val2:string){
  
  localStorage.setItem("colegio", val1); 
  localStorage.setItem("rbd",val2);
  //console.log(val2);
  
}