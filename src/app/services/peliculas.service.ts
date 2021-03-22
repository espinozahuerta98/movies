import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {tap,map, catchError} from 'rxjs/operators';
import { CarteleraResponse, Movie } from '../interfaces/cartelera-response';
import { Cast, CreditsResponse } from '../interfaces/credits-response';
import { MovieResponse } from '../interfaces/movie-response';

@Injectable({
  providedIn: 'root'
})
export class PeliculasService {
  
  private baseUrl:string = 'https://api.themoviedb.org/3';
  private cateleraPage = 1;

  public cargando: boolean = false

  constructor(private http: HttpClient) { }

  get params(){
    return{
     api_key:'e95585004690d868bdc577866dd13a39',
     language:'es-Es',
     page: this.cateleraPage.toString()
    }

  }

  resetCarteleraPage(){
    this.cateleraPage = 1;
  }

  getCartelera():Observable<Movie[]>{

    if(this.cargando){
      //cargando películas
      return of([]);

    }
    
    this.cargando = true;

    return this.http.get<CarteleraResponse>(`${this.baseUrl}/movie/now_playing`,{params:this.params})
      .pipe(
        map((resp) => resp.results),
        tap(() =>{
          this.cateleraPage += 1;
          this.cargando = false
        })
        )  
  
  
  }

  buscarPeliculas(texto:string):Observable<Movie[]>{
    const params = {...this.params, page:'1',query:texto};

     return this.http.get<CarteleraResponse>(`${this.baseUrl}/search/movie`,{params})
      .pipe(
        map(
          resp => resp.results
        )
      )
  }

  getPeliculaDetalle(id:string){
    return this.http.get<MovieResponse>(`${this.baseUrl}/movie/${id}`, {
      params:this.params
    }).pipe(
      catchError(err => of(null))
    )
  }
  
  getCast(id:string):Observable<Cast[]>{
    return this.http.get<CreditsResponse>(`${this.baseUrl}/movie/${id}/credits`, {
      params:this.params
    }).pipe(
      map(resp => resp.cast),
      catchError(err => of([]))
    )
  }
  
  
}
