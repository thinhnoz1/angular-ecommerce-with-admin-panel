import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { DeleteAllFaq, DeleteFaq, GetFaqs, UpdateFaqStatus } from '../../shared/action/faq.action';
import { Params } from '../../shared/interface/core.interface';
import { Faq, FaqModel } from '../../shared/interface/faq.interface';
import { TableClickedAction, TableConfig } from '../../shared/interface/table.interface';
import { FaqState } from '../../shared/state/faq.state';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent {

  @Select(FaqState.faq) faq$: Observable<FaqModel>;

  public tableConfig: TableConfig = {
    columns: [
      { title: "No.", dataField: "no", type: "no" },
      { title: "title", dataField: "title", sortable: true, sort_direction: 'desc'  },
      { title: "created_at", dataField: "created_at", type: "date", sortable: true, sort_direction: 'desc' },
      { title: "status", dataField: "status", type: "switch" },
    ],
    rowActions: [
      { label: "Edit", actionToPerform: "edit", icon: "ri-pencil-line", permission: "faq.edit" },
      { label: "Delete", actionToPerform: "delete", icon: "ri-delete-bin-line", permission: "faq.destroy" },
    ],
    data: [] as Faq[],
    total: 0
  };

  constructor(private store: Store,
    public router: Router) { }

  ngOnInit() {
    this.faq$.subscribe(faq => { 
      this.tableConfig.data  = faq ? faq?.data  : [];
      this.tableConfig.total = faq ? faq?.total : 0;
    });
  }

  onTableChange(data?: Params) {
    this.store.dispatch(new GetFaqs(data));
  }

  onActionClicked(action: TableClickedAction) {
    if(action.actionToPerform == 'edit')
      this.edit(action.data)
    else if(action.actionToPerform == 'status')
    this.status(action.data)
    else if(action.actionToPerform == 'delete')
      this.delete(action.data)
    else if(action.actionToPerform == 'deleteAll')
      this.deleteAll(action.data)
  }

  edit(data: Faq) {
    this.router.navigateByUrl(`/faq/edit/${data.id}`);
  }

  status(data: Faq) {
    this.store.dispatch(new UpdateFaqStatus(data.id, data.status));
  }

  delete(data: Faq) {
    this.store.dispatch(new DeleteFaq(data.id));
  }

  deleteAll(ids: number[]) {
    this.store.dispatch(new DeleteAllFaq(ids));
  }

}
