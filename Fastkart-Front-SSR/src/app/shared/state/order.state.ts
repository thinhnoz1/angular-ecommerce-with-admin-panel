import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Store, Action, Selector, State, StateContext, Select } from "@ngxs/store";
import { Observable, tap } from "rxjs";
import { GetOrders, ViewOrder, Checkout, PlaceOrder, Clear, VerifyPayment, RePayment } from "../action/order.action";
import { Order, OrderCheckout } from "../interface/order.interface";
import { OrderService } from "../services/order.service";
import { ClearCart } from "../action/cart.action";
import { CartState } from "./cart.state";
import { Cart } from "../interface/cart.interface";

export class OrderStateModel {
  order = {
    data: [] as Order[],
    total: 0
  }
  selectedOrder: Order | null
  checkout: OrderCheckout | null
}

@State<OrderStateModel>({
  name: "order",
  defaults: {
    order: {
      data: [],
      total: 0
    },
    selectedOrder: null,
    checkout: null
  },
})
@Injectable()
export class OrderState {

  @Select(CartState.cartItems) cartItem$: Observable<Cart[]>;

  constructor(private store: Store,
    private router: Router,
    private orderService: OrderService) { }

  @Selector()
  static order(state: OrderStateModel) {
    return state.order;
  }

  @Selector()
  static selectedOrder(state: OrderStateModel) {
    return state.selectedOrder;
  }

  @Selector()
  static checkout(state: OrderStateModel) {
    return state.checkout;
  }

  @Action(GetOrders)
  getOrders(ctx: StateContext<OrderStateModel>, action: GetOrders) {
    return this.orderService.getOrders(action?.payload).pipe(
      tap({
        next: result => {
          ctx.patchState({
            order: {
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

  @Action(ViewOrder)
  viewOrder(ctx: StateContext<OrderStateModel>, { id }: ViewOrder) {
    this.orderService.skeletonLoader = true;
    return this.orderService.getOrders().pipe(
      tap({
        next: result => {
          const state = ctx.getState();
          const order = result.data.find(order => order.order_number == id);

          ctx.patchState({
            ...state,
            selectedOrder: order
          });
        },
        error: err => {
          throw new Error(err?.error?.message);
        },
        complete: () => {
          this.orderService.skeletonLoader = false;
        }
      })
    );
  }

  @Action(Checkout)
  checkout(ctx: StateContext<OrderStateModel>, action: Checkout) {

    const state = ctx.getState();
    console.log("Order.state");
    // Calculate using cart information
    this.cartItem$.subscribe(cartItem => {
      const sub_total_value= cartItem.reduce((accumulator, object) => {
        return accumulator + (object.product.sale_price*object.quantity);
      }, 0);
      const order = {
        total: {
          convert_point_amount: -10,
          convert_wallet_balance: -84.4,
          coupon_total_discount: 10,
          points: 300,
          points_amount: 10,
          shipping_total: 0,
          sub_total: sub_total_value,
          tax_total: sub_total_value*8/100,
          total: sub_total_value+(sub_total_value*8/100),
          wallet_balance: 84.4,
        }
      }

      ctx.patchState({
        ...state,
        checkout: order
      });
    });
  }

  @Action(PlaceOrder)
  placeOrder(ctx: StateContext<OrderStateModel>, action: PlaceOrder) {
    return this.orderService.createPaymentUrl(action?.payload).pipe(
      tap({
        next: result => {
          // ctx.patchState({
          //   order: {
          //     data: result.data,
          //     total: result?.total ? result?.total : result.data?.length
          //   }
          // });
          console.log(result);
          (window as any).open(result, "_blank");
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
    //this.router.navigateByUrl(`/account/order/details/1000`);
  }

  @Action(RePayment)
  verifyPayment(ctx: StateContext<OrderStateModel>, action: RePayment) {
    // Verify Payment Logic Here
  }

  @Action(VerifyPayment)
  rePayment(ctx: StateContext<OrderStateModel>, action: VerifyPayment) {
    // Re Payment Logic Here
  }

  @Action(Clear)
  clear(ctx: StateContext<OrderStateModel>) {
    const state = ctx.getState();
    ctx.patchState({
      ...state,
      checkout: null
    });
  }

}
