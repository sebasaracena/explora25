import { Component, OnInit } from '@angular/core';
import { MapaService } from '../../servicio/mapa.service';

import { Cartografia } from '../../modelo/cartografia';
import Swal from 'sweetalert2';


declare let L;

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit {
  

  constructor(private mapas:MapaService) { }
  
 Layer:any;
  displayedColumns: string[] = ['rbd','n_colegio'];
   dataSource:any; 
  map:any;
  trabajo:any;
  crecyt_rbd:any;
  docente:any;
  proyecto:any;
  establecimiento:any;
  colegio="Establecimientos";
  rbd="all";


  cartografia:Cartografia={
    anio:'all',
    rbd:'all',
    term:'',
    espacio:'all',
    seleccion:'all',
    categoria:'all',
    cod_proyecto:'all',
  }
  ngOnInit() {
    localStorage.setItem("colegio","Establecimientos");
    localStorage.setItem("rbd","all");
    this.iniciar_mapa();
    
    // iniciando mapa
    this.poner_layer();
   
    this.mapas.get_proyectos(0).subscribe(
      resp=> {
        this.trabajo=resp;
       
        this.dataSource=resp;
      }
    );

    this.mapas.get_profe_crecyt(this.cartografia).subscribe(
      resp=>{
        this.docente=resp;
       
      } 
    );

   this.mapas.get_establecimientos(this.cartografia).subscribe(resp=>{
     this.establecimiento=resp;
   })
    
  }

  iniciar_mapa(){
    const mapOSM = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic3VwZXJzYngwMCIsImEiOiJjaWpsZ3FsN3QwMDIydGhtNTh4aGhubG5xIn0.i2J0k0mBZhIi7W-bsPTJiQ", {
        maxZoom: 18,
        minZoom: 8,
        id: "mapbox.streets"
    });

    this.map = L.map("map", {
      zoom: 6,
      layers: [mapOSM],
      tap:!L.Browser.mobile 
      

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
         
       
       map.setView([Layer.getLatLng().lat,Layer.getLatLng().lng],17);
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
   this.get_crecyt_rbd();
  this.buscar_trabajos(localStorage.getItem("rbd"));
   this.buscar_profesores(localStorage.getItem("rbd"));
   this.mapas.get_establecimientos(this.cartografia).subscribe(resp=>{
    this.establecimiento=resp;
  });
   //console.log(e.latlng); // get the coordinates
});
return 0;
}


 buscar_trabajos(rbd:string){
   this.cartografia.rbd=rbd;
    this.mapas.get_busqueda_crecyt(this.cartografia).subscribe(
      resp=>{
        this.trabajo=resp;
      }
    );
  
 }
 
  buscar_profesores(rbd:string){
  this.cartografia.rbd=rbd;
  
  this.mapas.get_profe_crecyt(this.cartografia).subscribe(
    resp=>{
      this.docente=resp;
     
      
    } 
  );

  }
 
  reiniciar_mapa(){
    localStorage.setItem("rbd","all");
    localStorage.setItem("colegio","Establecimiento");
    
    this.colegio=localStorage.getItem("colegio");
    this.rbd=localStorage.getItem("rbd");
    
    this.cartografia.rbd=localStorage.getItem("rbd");
 this.cartografia.cod_proyecto='all';
    this.cartografia.term='';
    this.map.removeLayer(this.Layer);
    
    this.poner_layer();
    
    this.mapas.get_establecimientos(this.cartografia).subscribe(resp=>{
      this.establecimiento=resp;
    });
    
    this.buscar_trabajos(this.cartografia.rbd);
    this.buscar_profesores(this.cartografia.rbd);


  }

  buscar_carto(rbd:string){
    this.map.removeLayer(this.Layer);
    this.cartografia.rbd=rbd;
    this.cartografia.cod_proyecto='all',
    this.cartografia.term='';
  
    this.poner_layer();

    this.buscar_profesores(rbd);
    this.get_crecyt_rbd();

    this.mapas.get_busqueda_crecyt(this.cartografia).subscribe(
      resp=>{
        this.trabajo=resp;
        this.colegio=this.trabajo[0].n_colegio;
        this.rbd=this.trabajo[0].rbd;
      }
    );

  }

  onChangeSearch(val:string){
    this.cartografia.cod_proyecto='all';
    
   if(val!=""){
    this.cartografia.term=val;
    localStorage.setItem("rbd","all");
    this.cartografia.rbd=localStorage.getItem("rbd");
    this.map.removeLayer(this.Layer);
    
    this.poner_layer();

    this.mapas.get_establecimientos(this.cartografia).subscribe(resp=>{
      this.establecimiento=resp;
    });
  } else this.reiniciar_mapa();

  }

  seleccion_anio(){
    this.reiniciar_mapa_rbd();
    

  }
  reiniciar_mapa_rbd(){
   
    
    
   
    this.cartografia.cod_proyecto='all',  
    this.cartografia.term='';
    this.map.removeLayer(this.Layer);
    
    this.poner_layer();
    
    this.mapas.get_establecimientos(this.cartografia).subscribe(resp=>{
      this.establecimiento=resp;
    });
    
    this.buscar_trabajos(this.cartografia.rbd);
    this.buscar_profesores(this.cartografia.rbd);


  }

  poner_layer(){
    this.mapas.get_layer(this.cartografia).subscribe(
      resp=>{
       
        if(this.Layer!=null) this.map.removeLayer(this.Layer);
        if(resp!="no existe"){
        this.construir_layer(this.map,resp);
        }
      }
    );

  }

  get_trabajo(cod_proyecto:string){
    this.cartografia.cod_proyecto=cod_proyecto;
     this.mapas.get_profe_crecyt(this.cartografia).subscribe(
      resp=>{
        this.proyecto=resp;
        //console.log(this.proyecto);
        Swal.fire(
          {
            title:this.proyecto[0].cod_proyecto,
            html: '<hr/><div class="text_center">'+this.proyecto[0].nombre+'</div><hr/>'+
            ' <div class="map table-responsive"><table class="table border-1"><thead><tr><th scope="col">Categoria</th><th scope="col">Año</th></tr></thead>'+
                '<tbody>'+
                   '<tr>'+
                        '<td>'+this.proyecto[0].categoria+'</td>'+
                       '<td>'+this.proyecto[0].anio+'</td>'+
                       '</tr></tbody></table></div>'+
                      
            ' <div class="map table-responsive"><table class="table border-1"><thead><tr><th scope="col">Region</th><th scope="col">Comuna</th></tr></thead>'+
                '<tbody>'+
                   '<tr>'+
                        '<td>'+this.proyecto[0].region+'</td>'+
                       '<td>'+this.proyecto[0].comuna+'</td>'+
                       '</tr></tbody></table></div>'+
                       ' <div class="map table-responsive"><table class="table border-1"><thead><tr><th scope="col">Asesoria</th><th scope="col">Dependencia</th></tr></thead>'+
                       '<tbody>'+
                          '<tr>'+
                               '<td>'+this.proyecto[0].asesoria+'</td>'+
                              '<td>'+this.proyecto[0].dependencia+'</td>'+
                              '</tr></tbody></table></div>',
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

//funciones para el mapa.
function clickcambio(val1:string,val2:string){
  
  localStorage.setItem("colegio", val1); 
  localStorage.setItem("rbd",val2);
  //console.log(val2);
  
}









