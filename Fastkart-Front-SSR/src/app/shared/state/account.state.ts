import { Injectable } from "@angular/core";
import { Store, Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs";
import { GetUserDetails, UpdateUserProfile, UpdateUserPassword, 
         CreateAddress, UpdateAddress, DeleteAddress, AccountClear } from "../action/account.action";
import { AccountUser, AccountUserUpdatePassword } from "./../interface/account.interface";
import { AccountService } from "../services/account.service";
import { NotificationService } from "../services/notification.service";
import { Permission } from "../interface/role.interface";
import { Router } from "@angular/router";

export class AccountStateModel {
  user: AccountUser | null;
  permissions: Permission[];
}

@State<AccountStateModel>({
    name: "account",
    defaults: {
      user: null,
      permissions: []
    },
})
@Injectable()
export class AccountState {

  constructor(private accountService: AccountService,
    private router: Router,
    private notificationService: NotificationService) {}

  @Selector()
  static user(state: AccountStateModel) {
    return state.user;
  }

  @Selector()
  static permissions(state: AccountStateModel) {
    return state.permissions;
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
            permissions: result.permission,
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
  updatePassword(ctx: StateContext<AccountUserUpdatePassword>, { payload }: UpdateUserPassword) {
    // Update Password Logic Here
  }

  @Action(CreateAddress)
  createAddress(ctx: StateContext<AccountStateModel>, action: CreateAddress) {
    // Create Address Logic Here
  }

  @Action(UpdateAddress)
  updateAddress(ctx: StateContext<AccountStateModel>, action: UpdateAddress) {
    // Update Address Logic Here
  }

  @Action(DeleteAddress)
  deleteAddress(ctx: StateContext<AccountStateModel>, action: DeleteAddress) {
    // Delete Address Logic Here
  }

  @Action(AccountClear)
  accountClear(ctx: StateContext<AccountStateModel>){
    ctx.patchState({
      user: null,
      permissions: []
    });
  }

}