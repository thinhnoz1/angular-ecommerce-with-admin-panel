import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { Params } from "../interface/core.interface";
import { Product, ProductModel } from "../interface/product.interface";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  public skeletonLoader: boolean = false;

  constructor(private http: HttpClient) {}
  //'{"search":"","field":"","sort":"","page":1,"paginate":30}'
  getProducts(payload?: Params): Observable<ProductModel> {
    // return this.http.get<ProductModel>(`${environment.URL}/product.json`, { params: payload });
    return this.http.get<ProductModel>(`${environment.apiURL}/products`, { params: payload });
  }

  static getProducts(http: HttpClient, payload?: Params): Observable<ProductModel> {
    // return this.http.get<ProductModel>(`${environment.URL}/product.json`, { params: payload });
    return http.get<ProductModel>(`${environment.apiURL}/products`, { params: payload });
  }

  getProductBySlug(payload?: Params): Observable<ProductModel> {
    // return this.http.get<ProductModel>(`${environment.URL}/product.json`, { params: payload });
    return this.http.get<ProductModel>(`${environment.apiURL}/products/get-one-by-slug`, { params: payload });
  }
  
  deleteProduct(payload?: Params): Observable<any> {
    // return this.http.get<UserModel>(`${environment.URL}/user.json`, { params: payload });
    return this.http.post<any>(`${environment.apiURL}/products/delete`, payload);
  }
  
  updateProduct(payload?: Params): Observable<any> {
    // return this.http.get<UserModel>(`${environment.URL}/user.json`, { params: payload });
    return this.http.post<any>(`${environment.apiURL}/products/update`, payload);
  }

  addProduct(payload?: Params): Observable<any> {
    // return this.http.get<UserModel>(`${environment.URL}/user.json`, { params: payload });
    return this.http.post<any>(`${environment.apiURL}/products/create`, payload);
  }
}
