import { Injectable } from "@angular/core";
import { Store, State, Selector, Action, StateContext } from "@ngxs/store";
import { Router } from '@angular/router';
import { AccountClear, GetUserDetails } from "../action/account.action";
import { Register, Login, ForgotPassWord, VerifyEmailOtp, UpdatePassword, Logout, AuthClear } from "../action/auth.action";
import { NotificationService } from "../services/notification.service";
import { TokenStorageService } from "../services/token-storage.service";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { AuthService } from "../services/auth.service";
import { CookieService } from 'ngx-cookie-service';

export interface AuthStateModel {
  email: String;
  token: String | Number;
  access_token: String | null;
  id?: number
}

@State<AuthStateModel>({
  name: "auth",
  defaults: {
    email: '',
    token: '',
    access_token: '',
    id: 0
  },
})
@Injectable()
export class AuthState {
  constructor(private store: Store, public router: Router,
    private notificationService: NotificationService,
    private _token: TokenStorageService,
    private authService: AuthService,
    private cookieService: CookieService) { }


  ngxsOnInit(ctx: StateContext<AuthStateModel>) {
  }

  @Selector()
  static accessToken(state: AuthStateModel): String | null {
    return state.access_token;
  }

  @Selector()
  static isAuthenticated(state: AuthStateModel): Boolean {
    return !!state.access_token;
  }

  @Selector()
  static email(state: AuthStateModel): String {
    return state.email;
  }

  @Selector()
  static token(state: AuthStateModel): String | Number {
    return state.token;
  }

  @Action(Register)
  register(ctx: StateContext<AuthStateModel>, action: Register) {
    if (action.payload.password != action.payload.password_confirmation){
      this.notificationService.showError("Password confirmation does not match!");
      return;
    }
    // Register Logic Here
    const res = this.authService.register(action.payload).pipe(
      tap({
        next: (result: any) => {
          this.notificationService.showSuccess(result?.message);
        },
        error: err => {
          this.notificationService.showError(err?.error?.message);
          throw new Error(err?.error?.message);
        }
      })
    );
    return res
  }

  @Action(Login)
  login(ctx: StateContext<AuthStateModel>, action: Login) {
    // Login Logic Here
    const res = this.authService.login(action.payload).pipe(
      tap({
        next: (result: any) => {
          // const state = ctx.getState();
          const cookieVal = this.cookieService.get('jwt');
          ctx.patchState({
            email: result.data.email,
            token: cookieVal,
            access_token: result.token,
            id: result.data.id
          });
          this.store.dispatch(new GetUserDetails( result.data.id));

        },
        error: err => {
          this.notificationService.showError(err?.error?.message);
          throw new Error(err?.error?.message);
        }
      })
    );
    return res

  }

  @Action(ForgotPassWord)
  forgotPassword(ctx: StateContext<AuthStateModel>, action: ForgotPassWord) {
    // Forgot Password Logic Here
  }

  @Action(VerifyEmailOtp)
  verifyEmail(ctx: StateContext<AuthStateModel>, action: VerifyEmailOtp) {
    // Verify Logic Here
  }

  @Action(UpdatePassword)
  updatePassword(ctx: StateContext<AuthStateModel>, action: UpdatePassword) {
    // Update Password Logic Here
  }

  @Action(Logout)
  logout(ctx: StateContext<AuthStateModel>) {
    // Logout LOgic Here
    ctx.patchState({
      email: '',
      token: '',
      access_token: null,
    });
    this._token.clearStorage();
    this.store.dispatch(new AccountClear());
    this.notificationService.showSuccess("Logout sucessfully!");
  }

  @Action(AuthClear)
  authClear(ctx: StateContext<AuthStateModel>) {
    ctx.patchState({
      email: '',
      token: '',
      access_token: null,
    });
    this._token.clearStorage();
    this.store.dispatch(new AccountClear());
  }

}
