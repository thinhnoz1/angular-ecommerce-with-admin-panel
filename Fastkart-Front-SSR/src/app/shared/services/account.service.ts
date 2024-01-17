import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { AccountUser } from "../interface/account.interface";
import { Params } from "../interface/core.interface";

@Injectable({
  providedIn: "root",
})
export class AccountService {

  constructor(private http: HttpClient) {}

  getUserDetails(payload?: Params): Observable<any> {
    // return this.http.get<AccountUser>(`${environment.URL}/account.json`);
    return this.http.get<any>(`${environment.apiURL}/users/get-user`, {params: payload});
  }

}
