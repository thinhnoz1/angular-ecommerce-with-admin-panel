import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { OrderModel } from '../interface/order.interface';
import { Params } from '../interface/core.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  public skeletonLoader: boolean = false;

  constructor(private http: HttpClient) {}

  getOrdersTest(payload?: Params): Observable<OrderModel> {
    return this.http.get<OrderModel>(`${environment.URL}/order.json`, { params: payload });
  }

  getOrders(payload?: Params): Observable<OrderModel> {
    return this.http.get<OrderModel>(`${environment.apiURL}/orders/get-all`, { params: payload });
  }

  getOrderById(payload?: Params): Observable<OrderModel> {
    return this.http.get<OrderModel>(`${environment.apiURL}/orders/single`, { params: payload });
  }

  createPaymentUrl(payload?: Params): Observable<any> {
    return this.http.post<any>(`${environment.apiURL}/orders/create_payment_url`, payload);
  }

  createOrder(payload?: Params): Observable<any> {
    return this.http.post<any>(`${environment.apiURL}/orders/create`, payload);
  }
}
