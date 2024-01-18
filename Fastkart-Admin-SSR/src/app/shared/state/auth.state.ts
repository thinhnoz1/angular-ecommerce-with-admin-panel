import { Injectable } from "@angular/core";
import { Store, State, Selector, Action, StateContext } from "@ngxs/store";
import { Router } from '@angular/router';
import { tap } from "rxjs/operators";
import { AuthService } from "../services/auth.service";
import { ForgotPassWord, Login, VerifyEmailOtp, UpdatePassword, Logout, AuthClear } from "../action/auth.action";
import { AccountClear, GetUserDetails } from "../action/account.action";
import { GetBadges } from "../action/menu.action";
import { GetSettingOption } from "../action/setting.action";
import { GetUsers } from "../action/user.action";
import { GetCountries } from "../action/country.action";
import { GetStates } from "../action/state.action";
import { GetNotification } from "../action/notification.action";
import { NotificationService } from "../services/notification.service";
import { TokenStorageService } from "../services/token-storage.service";
import { CookieService } from "ngx-cookie-service";

export interface AuthStateModel {
  email: string;
  token: string | number;
  access_token: string | null;
  permissions: [];
  id?: number
}

@State<AuthStateModel>({
  name: "auth",
  defaults: {
    email: '',
    token: '',
    access_token: '',
    permissions: [],
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
  static accessToken(state: AuthStateModel) {
    return state.access_token;
  }

  @Selector()
  static isAuthenticated(state: AuthStateModel) {
    return !!state.access_token;
  }

  @Selector()
  static email(state: AuthStateModel) {
    return state.email;
  }

  @Selector()
  static token(state: AuthStateModel) {
    return state.token;
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
    // Verify Email Logic Here
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
