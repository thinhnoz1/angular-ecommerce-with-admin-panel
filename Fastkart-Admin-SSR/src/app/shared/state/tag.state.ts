import { Injectable } from "@angular/core";
import { Store, Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs";
import { GetTags, CreateTag, EditTag, 
         UpdateTag, UpdateTagStatus, DeleteTag, 
         DeleteAllTag } from "../action/tag.action";
import { Tag } from "../interface/tag.interface";
import { TagService } from "../services/tag.service";
import { NotificationService } from "../services/notification.service";

export class TagStateModel {
  tag = {
    data: [] as Tag[],
    total: 0
  }
  selectedTag: Tag | null;
}

@State<TagStateModel>({
  name: "tag",
  defaults: {
    tag: {
      data: [],
      total: 0
    },
    selectedTag: null
  },
})
@Injectable()
export class TagState {
  
  constructor(private store: Store,
    private notificationService: NotificationService,
    private tagService: TagService) {}

  @Selector()
  static tag(state: TagStateModel) {
    return state.tag;
  }

  @Selector()
  static selectedTag(state: TagStateModel) {
    return state.selectedTag;
  }

  @Action(GetTags)
  getTags(ctx: StateContext<TagStateModel>, action: GetTags) {
    return this.tagService.getTags(action.payload).pipe(
      tap({
        next: result => { 
          ctx.patchState({
            tag: {
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

  @Action(CreateTag)
  create(ctx: StateContext<TagStateModel>, action: CreateTag) {
    // Tag Create Logic here
  }

  @Action(EditTag)
  edit(ctx: StateContext<TagStateModel>, { id }: EditTag) {
    const state = ctx.getState();
    const result = state.tag.data.find(tag => tag.id == id);
    ctx.patchState({
      ...state,
      selectedTag: result
    });
  }

  @Action(UpdateTag)
  update(ctx: StateContext<TagStateModel>, { payload, id }: UpdateTag) {
    // Tag Update Logic here
  }

  @Action(UpdateTagStatus)
  updateStatus(ctx: StateContext<TagStateModel>, { id, status }: UpdateTagStatus) {
    // Tag Update Status Logic here
  }

  @Action(DeleteTag)
  delete(ctx: StateContext<TagStateModel>, { id }: DeleteTag) {
    // Tag Delete Logic here
  }

  @Action(DeleteAllTag)
  deleteAll(ctx: StateContext<TagStateModel>, { ids }: DeleteAllTag) {
    // Tag Delete All Logic here
  }

}
