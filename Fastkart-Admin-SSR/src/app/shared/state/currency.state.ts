import { Injectable } from "@angular/core";
import { Store, Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs";
import { GetCurrencies, CreateCurrency, EditCurrency, 
         UpdateCurrency, UpdateCurrencyStatus, DeleteCurrency, 
         DeleteAllCurrency } from "../action/currency.action";
import { Currency } from "../interface/currency.interface";
import { CurrencyService } from "../services/currency.service";
import { NotificationService } from "../services/notification.service";

export class CurrencyStateModel {
  currency = {
    data: [] as Currency[],
    total: 0
  }
  selectedCurrency: Currency | null;
}

@State<CurrencyStateModel>({
  name: "currency",
  defaults: {
    currency: {
      data: [],
      total: 0
    },
    selectedCurrency: null
  },
})
@Injectable()
export class CurrencyState {
  
  constructor(private store: Store,
    private notificationService: NotificationService,
    private currencyService: CurrencyService) {}

  @Selector()
  static currency(state: CurrencyStateModel) {
    return state.currency;
  }

  @Selector()
  static currencies(state: CurrencyStateModel) {
    return state.currency.data.map(res => { 
      return { label: res?.code, value: res?.id }
    });
  }

  @Selector()
  static selectedCurrency(state: CurrencyStateModel) {
    return state.selectedCurrency;
  }

  @Action(GetCurrencies)
  getCurrencies(ctx: StateContext<CurrencyStateModel>, action: GetCurrencies) {
    return this.currencyService.getCurrencies(action.payload).pipe(
      tap({
        next: result => { 
          ctx.patchState({
            currency: {
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

  @Action(CreateCurrency)
  create(ctx: StateContext<CurrencyStateModel>, action: CreateCurrency) {
    // Currency Create Logic Here
  }

  @Action(EditCurrency)
  edit(ctx: StateContext<CurrencyStateModel>, { id }: EditCurrency) {
    const state = ctx.getState();
    const result = state.currency.data.find(currency => currency.id == id);
    ctx.patchState({
      ...state,
      selectedCurrency: result
    });
  }

  @Action(UpdateCurrency)
  update(ctx: StateContext<CurrencyStateModel>, { payload, id }: UpdateCurrency) {
    // Currency Updtae Logic Here
  }

  @Action(UpdateCurrencyStatus)
  updateStatus(ctx: StateContext<CurrencyStateModel>, { id, status }: UpdateCurrencyStatus) {
    // Currency Update Status Logic Here
  }

  @Action(DeleteCurrency)
  delete(ctx: StateContext<CurrencyStateModel>, { id }: DeleteCurrency) {
    // Currency Delete Logic Here
  }

  @Action(DeleteAllCurrency)
  deleteAll(ctx: StateContext<CurrencyStateModel>, { ids }: DeleteAllCurrency) {
    // Currency Multiple Delete Logic Here
  }

}
