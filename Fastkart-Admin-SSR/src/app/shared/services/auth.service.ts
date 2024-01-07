import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { AuthUserForgotModel, AuthUserStateModel, UpdatePasswordModel, VerifyEmailOtpModel } from "../interface/auth.interface";
import { UpdatePassword } from "../action/auth.action";

@Injectable({
  providedIn: "root",
})
export class AuthService {

  constructor(private http: HttpClient) {}

}
