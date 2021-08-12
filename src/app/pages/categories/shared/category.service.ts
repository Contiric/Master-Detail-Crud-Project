import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from "@angular/common/http";

import { Observable, throwError } from "rxjs";
import { map, catchError, flatMap } from "rxjs/operators";
import { Category } from "./category.model";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  //Definindo uma propriedade para realizar requisições http
  //Por padrão tem que chamar a url api/o nome do recurso, no caso aqui categories
  private apiPath: string = "api/categories"

  //Configurando uma dependencia pro nosso cliente http
  constructor(private http: HttpClient) { }

  //Método responsável por retornar todas as categorias
  getAll(): Observable<Category[]> {
    return this.http.get(this.apiPath).pipe(
      catchError(this.handleError),
      map(this.jsonDataToCategories)
    )
  }

  //Método responsável por retornar uma categoria específica pelo id que for passado
  getById(id: number): Observable<Category> {
    const url = `${this.apiPath}/${id}`;
    
    //A diferença do jsonDataCategories para este método é que nesse retorna só uma categoria
    //enquanto lá retorna um array de categorias 
    return this.http.get(url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToCategory)
    )
  }

  //Criando uma categoria
  create(category: Category): Observable<Category> {
    return this.http.post(this.apiPath, category).pipe(
      catchError(this.handleError),
      map(this.jsonDataToCategory)
    )
  }

  //Atualizando um categoria
  update(category: Category) : Observable<Category>{
    const url = `${this.apiPath}/${category.id}`;

    return this.http.put(url, category).pipe(
      catchError(this.handleError),
      map(() => category) // => Utilizado o map para retornar a própria categoria, pois o inmemorydatabase ele não retorna 
      )                         // nenhum dado. É forçado o retorno devolvendo o mesmo objeto que chegou no início do método
  }
  
  //Deletando uma categoria
  delete (id:number): Observable<any>{
    const url = `${this.apiPath}/${id}`;

    
    return this.http.delete(url).pipe(
      catchError(this.handleError),
      map(() => null) //=> Nesse método é retornado um simples null
    )
  }



  //Métodos Privados

  //Método reponsável por converter os objetos em categoria
  private jsonDataToCategories(jsonData: any[]): Category[] {
    const categories: Category[] = [];
    jsonData.forEach(element => categories.push(element as Category));
    return categories;
  }

  //Devolve uma única categoria
  private jsonDataToCategory(jsonData: any): Category{
    return jsonData as Category;
  }

  //Método responsável por indicar um erro na requisição
  private handleError(error: any): Observable<any>{
      console.log("Erro na requisição => ", error );
      return throwError(error);
    }
  }


