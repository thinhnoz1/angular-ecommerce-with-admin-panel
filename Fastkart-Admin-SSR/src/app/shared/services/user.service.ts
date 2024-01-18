import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { Params } from "../interface/core.interface";
import { User, UserAddress, UserModel } from "../interface/user.interface";

@Injectable({
  providedIn: "root",
})
export class UserService {

  constructor(private http: HttpClient) {}

  getUsers(payload?: Params): Observable<UserModel> {
    // return this.http.get<UserModel>(`${environment.URL}/user.json`, { params: payload });
    return this.http.get<any>(`${environment.apiURL}/users/`, {params: payload});
  }
  
  addUser(payload?: Params): Observable<any> {
    // return this.http.get<UserModel>(`${environment.URL}/user.json`, { params: payload });
    return this.http.post<any>(`${environment.apiURL}/users/add`, payload);
  }
  
  updateUser(payload?: Params): Observable<any> {
    // return this.http.get<UserModel>(`${environment.URL}/user.json`, { params: payload });
    return this.http.post<any>(`${environment.apiURL}/users/update`, payload);
  }
  deleteUser(payload?: Params): Observable<any> {
    // return this.http.get<UserModel>(`${environment.URL}/user.json`, { params: payload });
    return this.http.post<any>(`${environment.apiURL}/users/delete`, payload);
  }

}
