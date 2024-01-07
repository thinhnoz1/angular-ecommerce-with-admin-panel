import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { Params } from "../interface/core.interface";
import { AttributeModel } from "../interface/attribute.interface";

@Injectable({
  providedIn: "root",
})
export class AttributeService {

  public skeletonLoader: boolean = false;
  public offCanvasMenu: boolean = false;
  
  constructor(private http: HttpClient) {}

  getAttributes(payload?: Params): Observable<AttributeModel> {
    return this.http.get<AttributeModel>(`${environment.URL}/attribute.json`, { params: payload });
  }

}
