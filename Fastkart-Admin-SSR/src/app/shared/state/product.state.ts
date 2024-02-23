import { Injectable } from "@angular/core";
import { Store, Action, Selector, State, StateContext } from "@ngxs/store";
import { tap } from "rxjs";
import { UpdateBadgeValue } from "../action/menu.action";
import {
  GetProducts, CreateProduct, EditProduct,
  UpdateProduct, UpdateProductStatus, ApproveProductStatus, DeleteProduct,
  DeleteAllProduct, ReplicateProduct
} from "../action/product.action";
import { Product, ProductModel } from "../interface/product.interface";
import { ProductService } from "../services/product.service";
import { NotificationService } from "../services/notification.service";
import { Router } from "@angular/router";

export class ProductStateModel {
  product = {
    data: [] as Product[],
    total: 0
  }
  selectedProduct: Product | null;
  topSellingProducts: Product[]
}

@State<ProductStateModel>({
  name: "product",
  defaults: {
    product: {
      data: [],
      total: 0
    },
    selectedProduct: null,
    topSellingProducts: []
  },
})
@Injectable()
export class ProductState {
  reloadCurrentPage() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  constructor(private store: Store,
    private router: Router,
    private notificationService: NotificationService,
    private productService: ProductService) { }

  uniqByReduce<T>(array: T[]): T[] {
    return array.reduce((acc: T[], cur: T) => {
      if (!acc.includes(cur)) {
        acc.push(cur);
      }
      return acc;
    }, [])
  }

  uniqForObject<T>(array: T[]): T[] {
    const result: T[] = [];
    for (const item of array) {
      const found = result.some((value) => value == item);
      if (!found) {
        result.push(item);
      }
    }
    return result;
  }

  @Selector()
  static product(state: ProductStateModel) {
    return state.product;
  }

  @Selector()
  static products(state: ProductStateModel) {
    return state.product.data.filter(data => data.id !== state.selectedProduct?.id).map((res: Product) => {
      return {
        label: res?.name, value: res?.id, data: {
          type: res.type,
          name: res.name,
          slug: res.slug,
          stock_status: res.stock_status,
          image: res.product_thumbnail ? res.product_thumbnail.original_url : 'assets/images/product.png'
        }
      }
    })
  }

  @Selector()
  static selectedProduct(state: ProductStateModel) {
    return state.selectedProduct;
  }

  @Selector()
  static topSellingProducts(state: ProductStateModel) {
    return state.topSellingProducts;
  }

  @Action(GetProducts)
  getProducts(ctx: StateContext<ProductStateModel>, action: GetProducts) {
    return this.productService.getProducts(action.payload).pipe(
      tap({
        next: (result: ProductModel) => {
          if (action?.payload!['top_selling']) {
            const state = ctx.getState();
            ctx.patchState({
              ...state,
              topSellingProducts: result?.data?.slice(0, 7)
            });
          } else {
            ctx.patchState({
              product: {
                data: result?.data,
                total: result?.total ? result?.total : result.data?.length
              }
            });
          }
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(CreateProduct)
  create(ctx: StateContext<ProductStateModel>, action: CreateProduct) {
    return this.productService.addProduct(action?.payload).pipe(
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

  @Action(EditProduct)
  edit(ctx: StateContext<ProductStateModel>, { id }: EditProduct) {
    const state = ctx.getState();
    const result = state.product.data.find(product => product.id == id);
    ctx.patchState({
      ...state,
      selectedProduct: result
    });
  }

  @Action(UpdateProduct)
  update(ctx: StateContext<ProductStateModel>, { payload, id }: UpdateProduct) {
    const body = { ...payload, id }
    return this.productService.updateProduct(body).pipe(
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

  @Action(UpdateProductStatus)
  updateStatus(ctx: StateContext<ProductStateModel>, { id, status }: UpdateProductStatus) {
    const body = { status, id }
    return this.productService.updateProduct(body).pipe(
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

  @Action(ApproveProductStatus)
  approveStatus(ctx: StateContext<ProductStateModel>, { id, status }: ApproveProductStatus) {
    // Product Approve Status Logic Here
  }

  @Action(DeleteProduct)
  delete(ctx: StateContext<ProductStateModel>, { id }: DeleteProduct) {
    const body = { id }
    return this.productService.deleteProduct(body).pipe(
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

  @Action(DeleteAllProduct)
  deleteAll(ctx: StateContext<ProductStateModel>, { ids }: DeleteAllProduct) {
    const body = { ids }
    return this.productService.deleteProduct(body).pipe(
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

  @Action(ReplicateProduct)
  replicateProduct(ctx: StateContext<ProductStateModel>, { ids }: ReplicateProduct) {
    // Product Replicate Logic Here
  }

}
