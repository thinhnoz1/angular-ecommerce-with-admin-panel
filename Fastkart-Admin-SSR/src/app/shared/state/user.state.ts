import { Injectable } from "@angular/core";
import { Store, Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs";
import {
  GetUsers, CreateUser, EditUser, UpdateUser,
  UpdateUserStatus, DeleteUser, DeleteAllUser,
  CreateUserAddress, ImportUser, ExportUser
} from "../action/user.action";
import { User } from "../interface/user.interface";
import { UserService } from "../services/user.service";
import { NotificationService } from "../services/notification.service";
import { ActivatedRoute, Router } from "@angular/router";

export class UserStateModel {
  user = {
    data: [] as User[],
    total: 0
  }
  selectedUser: User | null;
}

@State<UserStateModel>({
  name: "user",
  defaults: {
    user: {
      data: [],
      total: 0
    },
    selectedUser: null
  },
})
@Injectable()
export class UserState {

  constructor(private store: Store,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private router: Router,
    private userService: UserService) { }

  reloadCurrentPage() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
  @Selector()
  static user(state: UserStateModel) {
    return state.user;
  }

  @Selector()
  static users(state: UserStateModel) {
    return state.user.data.map(user => {
      return { label: user?.name, value: user?.id }
    });
  }

  @Selector()
  static selectedUser(state: UserStateModel) {
    return state.selectedUser;
  }

  @Action(GetUsers)
  getUsers(ctx: StateContext<UserStateModel>, action: GetUsers) {
    return this.userService.getUsers(action?.payload).pipe(
      tap({
        next: result => {
          ctx.patchState({
            user: {
              data: result.data,
              total: result?.total ? result?.total : result.data?.length
            }
          });
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(CreateUser)
  create(ctx: StateContext<UserStateModel>, action: CreateUser) {
    return this.userService.addUser(action?.payload).pipe(
      tap({
        next: result => {
          this.notificationService.showSuccess(result?.message);
        },
        error: err => {
          this.notificationService.showError('Something went wrong, please try again later!');
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(EditUser)
  edit(ctx: StateContext<UserStateModel>, { id }: EditUser) {
    const state = ctx.getState();
    const result = state.user.data.find(user => user.id == id);
    ctx.patchState({
      ...state,
      selectedUser: result
    });
  }

  @Action(UpdateUser)
  update(ctx: StateContext<UserStateModel>, { payload, id }: UpdateUser) {
    const body = { ...payload, id }
    return this.userService.updateUser(body).pipe(
      tap({
        next: result => {
          this.notificationService.showSuccess(result?.message);
        },
        error: err => {
          this.notificationService.showError('Something went wrong, please try again later!');
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(UpdateUserStatus)
  updateStatus(ctx: StateContext<UserStateModel>, { id, status }: UpdateUserStatus) {
    const body = { status, id }
    return this.userService.updateUser(body).pipe(
      tap({
        next: result => {
          this.notificationService.showSuccess(result?.message);
        },
        error: err => {
          this.notificationService.showError('Something went wrong, please try again later!');
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(DeleteUser)
  delete(ctx: StateContext<UserStateModel>, { id }: DeleteUser) {
    const body = { id }
    return this.userService.deleteUser(body).pipe(
      tap({
        next: result => {
          this.notificationService.showSuccess(result?.message);
          this.reloadCurrentPage();
        },
        error: err => {
          this.notificationService.showError('Something went wrong, please try again later!');
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(DeleteAllUser)
  deleteAll(ctx: StateContext<UserStateModel>, { ids }: DeleteAllUser) {
    const body = { ids }
    return this.userService.deleteUser(body).pipe(
      tap({
        next: result => {
          this.notificationService.showSuccess(result?.message);
          this.reloadCurrentPage();
        },
        error: err => {
          this.notificationService.showError('Something went wrong, please try again later!');
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(ImportUser)
  import(ctx: StateContext<UserStateModel>, action: ImportUser) {
    // User Import Logic Here
  }

  @Action(ExportUser)
  export(ctx: StateContext<UserStateModel>, action: ExportUser) {
    // User Export Logic Here
  }

  @Action(CreateUserAddress)
  createUserAddress(ctx: StateContext<UserStateModel>, action: CreateUserAddress) {
    // User Create Address Logic Here
  }

}
