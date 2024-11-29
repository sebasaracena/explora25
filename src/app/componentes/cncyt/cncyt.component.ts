import { Component, OnInit } from '@angular/core';
import { MapaService } from '../../servicio/mapa.service';
import { Cncyt } from '../../modelo/cncyt';
import Swal from 'sweetalert2';

declare let L;
@Component({
  selector: 'app-cncyt',
  templateUrl: './cncyt.component.html',
  styleUrls: ['./cncyt.component.css']
})
export class CncytComponent implements OnInit {
  
  constructor(private mapa:MapaService) { }
  map:any;
  proyecto:any;
  proregion:any;
  trabajo:any;
  presentacion:any;
  Layer:any=null;
  chile="Nacional";
  cncyt:Cncyt={
    anio:'all',
    categoria:'all',
    dependencia:'all',
    asesoria:'all',
    term:'',
    cod_region:'all',
    cod_proyecto:'all',
  }
  ngOnInit() {
  this.iniciar_mapa();
  this.get_layer();
  this.get_proyecto();
  this.get_cncyt_trabajo();
  }
  //cantidad de proyecto por region
 get_cncyt_trabajo(){
   this.mapa.get_cncyt_trabajo(this.cncyt).subscribe(
     resp=> {
            this.trabajo=resp;
            console.log(resp);
     }
   )
 }
 
 
  get_proyecto(){
   this.mapa.get_cncyt_proyectos(this.cncyt).subscribe(
     resp=>{
       this.proyecto=resp;
     }
   )
 }
 get_cncyt_proreg(){
   this.mapa.get_mapa_proyectos(this.cncyt).subscribe(
   resp=>{
    let total=0; 
    this.proregion=resp;
    for(let i=0;i<Object.keys(this.proregion).length;i++) total=total+parseInt(this.proregion[i].cantidad);
    var html=this.get_html(this.proregion,total);
  Swal.fire(
    {
      title:this.chile,
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
//filtro por region
get_codregion(cod_region:string,region:string){
  this.cncyt.cod_proyecto='all';
   this.cncyt.cod_region=cod_region;
   this.chile=region;
   this.get_layer();
   this.get_cncyt_trabajo();
  
   


 }

 mostrar_datos(){
   this.chile=localStorage.getItem("region");
   
 }
  get_layer(){
    Swal.fire(
      {
        title:'Cargando Datos',
        text: 'Espere un Momentro, Procesando Datos',
        icon:'info',
        allowOutsideClick: false
      }
    );
    Swal.showLoading();
    this.mapa.get_cncyt(this.cncyt).subscribe(
      resp=>{
        
     
        
        if(this.Layer!=null) this.map.removeLayer(this.Layer);
        if(resp!="no existe"){
       
        this.construir_layer(this.map,resp,this.cncyt.anio);
        if(this.cncyt.cod_region=='all') {
        Swal.fire(
          {
            title:'Cartografía cargada',
            text: 'Los datos han sido exitosamente cargados.',
            icon:'success',
            allowOutsideClick: false
          }
        );
        } else this.get_cncyt_proreg();
        }else {
          Swal.fire(
            {
              title:'Datos no Encontrados',
              text: 'Los datos no han sido encontrados en la base de datos.',
              icon:'warning',
              allowOutsideClick: false
            }
          );
        }
      }
    )
  }
  iniciar_mapa(){
    const mapOSM =  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
      maxZoom: 18,
      minZoom: 5,
      id: "mapbox/streets-v11",
      accessToken: "pk.eyJ1IjoiZXhwbG9yYXNlYmEiLCJhIjoiY2tmems0dDExMXQ2NjJ6bzkxN3JwYzBnOCJ9.Ln66c12JsKnrctLhNpkEBg"
  });


    this.map = L.map("map", {
      zoom: 6,
      layers: [mapOSM],
      dragging: !L.Browser.mobile 

   }).setView([-26.755054,-65.0909888], 5);
 
   this.map.on("click", e => {
     
    this.reiniciar_mapa();
    //console.log(e.latlng); // get the coordinates
  });



  }
  
  construir_layer(map:any,data:any,anio:string){
  
    var geojson=data;

        geojson = {
		"type": "FeatureCollection",
		"features": []
	};
        
        var fields = ['cod_proyecto','region','trabajo','cod_region','random'];
       
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
			feature.properties[fields[i]] = d[i];
		
                                    
		};

		//add feature names to autocomplete list
		

		geojson.features.push(feature);
                
	});
	
	
  	
	
  
   this.Layer = new L.geoJson(geojson,{
        
      
    style:function(feature){ 
return {
            pane: 'pane_chile0',
            opacity: 1,
    
            color: '#203878',
            dashArray: '',
            lineCap: 'butt',
            lineJoin: 'miter',
            weight: 1.0, 
            fillOpacity: 0.5,
            fillColor:getColor(feature.properties.trabajo,anio),
        }
      },
 
  
   onEachFeature: function (feature, layer) {
    if (feature.properties) {	 
 
    layer.on({
    
    click: function (e) {
    
     get_region(feature.properties.region,feature.properties.cod_region);    
    

      
      map.fitBounds(e.target.getBounds());
 
      }
    
    });
    }
    }

  }
   );

  
   map.addLayer(this.Layer);
   map.fitBounds(this.Layer.getBounds());
   this.Layer.on('click',e => {
      
      this.chile=localStorage.getItem("region");
      this.cncyt.cod_region=localStorage.getItem("cod_region");
     
      this.get_cncyt_proreg();
      this.get_cncyt_trabajo();
     //console.log(e.latlng); // get the coordinates
  });
  }

  reiniciar_mapa(){
    this.chile='Nacional';
    this.cncyt.cod_region='all';
    this.cncyt.term='';
    this.cncyt.categoria='all';
    this.cncyt.cod_proyecto='all';
    
    this.get_layer();
    this.get_proyecto();
    this.get_cncyt_trabajo();
    this.map.setView([-26.755054,-65.0909888], 5);   
  }

  seleccion_anio(){
    this.cncyt.cod_region='all';
    this.cncyt.term='';
    this.cncyt.cod_proyecto='all';
    this.get_layer();
    this.get_proyecto();
    this.get_cncyt_trabajo();
  }
  get_html(pregion:any,total:number):string{
   
    
    let html='<hr/><h6>'+ total+' Trabajos Presentados</h6> <hr/><div class="table-responsive">'+
               '<table class="map table border-1" style="overflow:auto;">'+
        '<thead style="background-color: #5e659c;color:white">'+
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
  ChangeSearch(term:string){
    this.cncyt.cod_proyecto='all',
    this.cncyt.term=term;
    this.get_layer();
    this.get_proyecto();
    this.get_cncyt_trabajo();
  }
  Borrar(){
    this.cncyt.term='';
    this.cncyt.cod_proyecto='all';
    this.reiniciar_mapa();
   
  }

  get_trabajo(cod_proyecto:string){
    this.cncyt.cod_proyecto=cod_proyecto;
    this.mapa.get_cncyt_trabajo(this.cncyt).subscribe(resp=>{
      this.presentacion=resp;
     
      Swal.fire(
        {
          title:this.presentacion[0].cod_proyecto,
          html: '<hr/><div class="text_center">'+this.presentacion[0].nombre+'</div><hr/>'+
          ' <div class="map table-responsive"><table class="table border-1"><thead style="background-color: #5e659c;color:white"><tr><th scope="col">Categoria</th><th scope="col">Año</th></tr></thead>'+
              '<tbody>'+
                 '<tr>'+
                      '<td>'+this.presentacion[0].categoria+'</td>'+
                     '<td>'+this.presentacion[0].anio+'</td>'+
                     '</tr></tbody></table></div>'+
                    
          ' <div class="map table-responsive"><table class="table border-1"><thead style="background-color: #5e659c;color:white"><tr><th scope="col">Region</th><th scope="col">Comuna</th></tr></thead>'+
              '<tbody>'+
                 '<tr>'+
                      '<td>'+this.presentacion[0].region+'</td>'+
                     '<td>'+this.presentacion[0].comuna+'</td>'+
                     '</tr></tbody></table></div>'+
                     ' <div class="map table-responsive"><table class="table border-1"><thead style="background-color: #5e659c;color:white"><tr><th scope="col">Asesoria</th><th scope="col">Dependencia</th></tr></thead>'+
                     '<tbody>'+
                        '<tr>'+
                             '<td>'+this.presentacion[0].asesoria+'</td>'+
                            '<td>'+this.presentacion[0].dependencia+'</td>'+
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

    });
   

  } 
}

//funcion aparte del componente//
function getColor(d,anio) {


  if(anio=='all'){
  return d > 20 ? '#800026' :
    d > 14  ? '#BD0026' :
    d >10  ? '#E31A1C' :
    d >= 7  ? '#FC4E2A' :
    d >= 5  ? '#FFEDA0' :
    '#FFEDA0';
  }
  else {
    return d >=9  ? '#BD0026' :
    d >6  ? '#E31A1C' :
    d >3  ? '#FC4E2A' :
    d >1  ? '#FFEDA0' :
    '#FFEDA0';
  }
}
function get_region(region:any,cod_region:any){
localStorage.setItem("region",region);
localStorage.setItem("cod_region",cod_region);

}
