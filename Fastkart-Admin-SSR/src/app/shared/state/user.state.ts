import { Injectable } from "@angular/core";
import { Store, Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs";
import { GetUsers, CreateUser, EditUser, UpdateUser, 
          UpdateUserStatus, DeleteUser, DeleteAllUser, 
          CreateUserAddress, ImportUser, ExportUser } from "../action/user.action";
import { User } from "../interface/user.interface";
import { UserService } from "../services/user.service";
import { NotificationService } from "../services/notification.service";

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
    private notificationService: NotificationService,
    private userService: UserService) {}

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
    // User Create Logic Here
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
    // User Update Logic Here
  }

  @Action(UpdateUserStatus)
  updateStatus(ctx: StateContext<UserStateModel>, { id, status }: UpdateUserStatus) {
    // User Update Status Logic Here
  }

  @Action(DeleteUser)
  delete(ctx: StateContext<UserStateModel>, { id }: DeleteUser) {
    // User Delete Logic Here
  }

  @Action(DeleteAllUser)
  deleteAll(ctx: StateContext<UserStateModel>, { ids }: DeleteAllUser) {
    // User Delete All Logic Here
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
