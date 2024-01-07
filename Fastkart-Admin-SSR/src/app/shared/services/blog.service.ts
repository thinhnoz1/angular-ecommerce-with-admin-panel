import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { Params } from "../interface/core.interface";
import { BlogModel } from "../interface/blog.interface";

@Injectable({
  providedIn: "root",
})
export class BlogService {

  constructor(private http: HttpClient) {}

  getBlogs(payload?: Params): Observable<BlogModel> {
    return this.http.get<BlogModel>(`${environment.URL}/blog.json`, { params: payload });
  }

}
