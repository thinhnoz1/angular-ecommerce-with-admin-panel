import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs";
import { GetUserDetails, UpdateUserProfile, UpdateUserPassword, AccountClear, updateStoreDetails } from "../action/account.action";
import { AccountUser } from "./../interface/account.interface";
import { AccountService } from "../services/account.service";
import { NotificationService } from "../services/notification.service";
import { Permission } from "../interface/role.interface";

export class AccountStateModel {
  user: AccountUser | null |any;
  permissions: Permission[];
  roleName: string | null;
}

@State<AccountStateModel>({
  name: "account",
  defaults: {
    user: null,
    permissions: [],
    roleName: null
  },
})
@Injectable()
export class AccountState {

  constructor(private accountService: AccountService,
      private notificationService: NotificationService, 
      public router: Router) {}

  @Selector()
  static user(state: AccountStateModel) {
    return state.user;
  }

  @Selector()
  static permissions(state: AccountStateModel) {
    return state.permissions;
  }

  @Selector()
  static getRoleName(state: AccountStateModel) {
    return state.roleName;
  }

  @Action(GetUserDetails)
  getUserDetails(ctx: StateContext<AccountStateModel>, action: GetUserDetails) {
    if (!action || action.payload == undefined){
      this.router.navigateByUrl('/auth/login');
      return
    } 
    const payload = {
      id: action.payload
    }
    return this.accountService.getUserDetails(payload).pipe(
      tap({
        next: result => { 
          ctx.patchState({
            user: result.data,
            permissions: result.data.permission,
            roleName: result.data.role.name
          });
        },
        error: err => { 
          this.notificationService.showError(err?.error?.message);
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(UpdateUserProfile)
  updateProfile(ctx: StateContext<AccountStateModel>, { payload }: UpdateUserProfile) {
    // Update Profile Logic Here
  }

  @Action(UpdateUserPassword)
  updatePassword(ctx: StateContext<AccountStateModel>, { payload }: UpdateUserPassword) {
    // Update Password Logic Here
  }

  @Action(updateStoreDetails)
  updateStoreDetails(ctx: StateContext<AccountStateModel>, { payload }: updateStoreDetails) {
    // Update Store Logic Here
  }

  @Action(AccountClear)
  accountClear(ctx: StateContext<AccountStateModel>){
    ctx.patchState({
      user: null,
      permissions: [],
      roleName: null
    });
  }

}