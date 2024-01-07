import { Injectable } from "@angular/core";
import { Store, Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs";
import { GetAttachments, CreateAttachment, DeleteAttachment, DeleteAllAttachment } from "../action/attachment.action";
import { AttachmentModel } from "../interface/attachment.interface";
import { AttachmentService } from "../services/attachment.service";
import { NotificationService } from "../services/notification.service";

export class AttachmentStateModel {
  attachment: AttachmentModel
}

@State<AttachmentStateModel>({
  name: "attachment",
  defaults: {
    attachment: {
      data: [],
      total: 0
    }
  },
})
@Injectable()
export class AttachmentState {
  
  constructor(private store: Store, 
    private notificationService: NotificationService,
    private attachmentService: AttachmentService) {}

  @Selector()
  static attachment(state: AttachmentStateModel) {
    return state.attachment;
  }

  @Action(GetAttachments)
  getAttachments(ctx: StateContext<AttachmentStateModel>, action: GetAttachments) {
    return this.attachmentService.getAttachments(action.payload).pipe(
      tap({
        next: result => { 
          ctx.patchState({
            attachment: result
          });
        },
        error: err => { 
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(CreateAttachment)
  create(ctx: StateContext<AttachmentStateModel>, action: CreateAttachment) {
    // Upload File Logic Here
  }

  @Action(DeleteAttachment)
  delete(ctx: StateContext<AttachmentStateModel>, { id }: DeleteAttachment) {
    // Delete File Logic Here
  }

  @Action(DeleteAllAttachment)
  deleteAll(ctx: StateContext<AttachmentStateModel>, { ids }: DeleteAllAttachment) {
    // Delete Multiple File Logic Here
  }

}
