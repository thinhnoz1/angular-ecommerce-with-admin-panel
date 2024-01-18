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
}
