import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Params } from '../interface/core.interface';

@Injectable({
  providedIn: "root",
})
export class AuthService {

  public redirectUrl: string | undefined;

  // Auth Function Here
  constructor(private http: HttpClient) {}

  login(payload?: Params): any {
    // return this.http.get<ProductModel>(`${environment.URL}/product.json`, { params: payload });
    return this.http.post<any>(`${environment.apiURL}/auth/login`, payload);
  }

  register(payload?: Params): any {
    // return this.http.get<ProductModel>(`${environment.URL}/product.json`, { params: payload });
    return this.http.post<any>(`${environment.apiURL}/auth/register`, payload);
  }
}
