import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { Params } from "../interface/core.interface";
import { CategoryModel } from "../interface/category.interface";

@Injectable({
  providedIn: "root",
})
export class CategoryService {

  constructor(private http: HttpClient) {}

  getCategories(payload?: Params): Observable<CategoryModel> {
    return this.http.get<CategoryModel>(`${environment.apiURL}/categories`, { params: payload });
  }

  static getCategories(http: HttpClient, payload?: Params): Observable<CategoryModel> {
    return http.get<CategoryModel>(`${environment.apiURL}/categories`, { params: payload });
  }

  getFirstLevelCategories(payload?: Params): Observable<CategoryModel> {
    return this.http.get<CategoryModel>(`${environment.apiURL}/categories/get-parent-categories`, { params: payload });
  }

  static getFirstLevelCategories(http: HttpClient, payload?: Params): Observable<CategoryModel> {
    return http.get<CategoryModel>(`${environment.apiURL}/categories/get-parent-categories`, { params: payload });
  }
  
  getCategoryById(payload?: Params): Observable<CategoryModel> {
    return this.http.get<CategoryModel>(`${environment.apiURL}/categories/get-one`, { params: payload });
  }

  deleteCategory(payload?: Params): Observable<any> {
    // return this.http.get<UserModel>(`${environment.URL}/user.json`, { params: payload });
    return this.http.post<any>(`${environment.apiURL}/categories/delete`, payload);
  }
  
  updateCategory(payload?: Params): Observable<any> {
    // return this.http.get<UserModel>(`${environment.URL}/user.json`, { params: payload });
    return this.http.post<any>(`${environment.apiURL}/categories/update`, payload);
  }

  addCategory(payload?: Params): Observable<any> {
    // return this.http.get<UserModel>(`${environment.URL}/user.json`, { params: payload });
    return this.http.post<any>(`${environment.apiURL}/categories/create`, payload);
  }
  
}