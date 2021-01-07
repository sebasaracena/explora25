import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cartografia } from '../modelo/cartografia';
import { Cncyt } from '../modelo/cncyt';

@Injectable({
  providedIn: 'root'
})
export class MapaService {
  API_URL="http://exploraxv.uta.cl/bd/consult/public/establecimiento.php/api";
  //API_URL="http://localhost/consult/public/establecimiento.php/api";
  
  content='';
  constructor(private http:HttpClient) { }
 
  get_layer(cartografia:Cartografia){
    return this.http.post(`${this.API_URL}/colegios/crecyt/`,cartografia,{responseType: 'text'});
  }

  get_proyectos(pagina:number){
    return this.http.get(`${this.API_URL}/crecyt/trabajos/${pagina}`);
  }
  
  get_busqueda_crecyt(cartografia:Cartografia){
    return this.http.post(`${this.API_URL}/crecyt/busqueda/`,cartografia);
 
  }
  get_profe_crecyt(cartografia:Cartografia){
    return this.http.post(`${this.API_URL}/crecyt/profesores/`,cartografia);
 
  }

  get_establecimientos(cartografia:Cartografia){

    return this.http.post(`${this.API_URL}/crecyt/establecimiento/`,cartografia);
  }

  //** servicios para graficos */
  get_genero(cartografia:Cartografia){

    return this.http.post(`${this.API_URL}/crecyt/profesores/genero/`,cartografia);
    
  }

  get_layer_grafico(cartografia:Cartografia){
    return this.http.post(`${this.API_URL}/crecyt/mapa/`,cartografia,{responseType: 'text'});
  }

  get_espacio(anio:string){
    return this.http.get(`${this.API_URL}/crecyt/espacio/${anio}`);
  }

  get_categoria(cartografia:Cartografia){
    return this.http.post(`${this.API_URL}/crecyt/categoria/`,cartografia);
  }

  get_dependencia(cartografia:Cartografia){
    return this.http.post(`${this.API_URL}/crecyt/dependencia/`,cartografia);
  }

  get_asesoria(cartografia:Cartografia){
    return this.http.post(`${this.API_URL}/crecyt/asesoria/`,cartografia);
  }
//mapas congreso nacional
get_cncyt(cncyt:Cncyt){
  return this.http.post(`${this.API_URL}/cncyt/mapa/`,cncyt,{responseType: 'text'});
}
get_cncyt_categoria(cncyt:Cncyt){
  return this.http.post(`${this.API_URL}/cncyt/categoria/`,cncyt);
}

get_cncyt_asesoria(cncyt:Cncyt){
  return this.http.post(`${this.API_URL}/cncyt/asesoria/`,cncyt);
}
get_cncyt_dependencia(cncyt:Cncyt){
  return this.http.post(`${this.API_URL}/cncyt/dependencia/`,cncyt);
}
get_cncyt_proyectos(cncyt:Cncyt){
  return this.http.post(`${this.API_URL}/cncyt/proyectos/`,cncyt);
}

get_mapa_proyectos(cncyt:Cncyt){
  return this.http.post(`${this.API_URL}/cncyt/proyecto/region/`,cncyt);
}
get_cncyt_trabajo(cncyt:Cncyt){
  return this.http.post(`${this.API_URL}/cncyt/trabajo/`,cncyt);
}

// Fin cncyt
 



}

