import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Store, Action, Selector, State, StateContext } from "@ngxs/store";
import { map, tap } from "rxjs";
import {
  GetProducts, GetStoreProducts,
  GetRelatedProducts, GetProductBySlug, GetDealProducts
} from "../action/product.action";
import { Product, ProductModel } from "../interface/product.interface";
import { ProductService } from "../services/product.service";
import { ThemeOptionService } from "../services/theme-option.service";

export class ProductStateModel {
  product = {
    data: [] as Product[],
    total: 0
  }
  selectedProduct: Product | null;
  categoryProducts: Product[] | [];
  relatedProducts: Product[] | [];
  storeProducts: Product[] | [];
  dealProducts: Product[] | [];
}

@State<ProductStateModel>({
  name: "product",
  defaults: {
    product: {
      data: [],
      total: 0
    },
    selectedProduct: null,
    categoryProducts: [],
    relatedProducts: [],
    storeProducts: [],
    dealProducts: []
  },
})
@Injectable()
export class ProductState {

  constructor(private store: Store, private router: Router,
    private productService: ProductService,
    private themeOptionService: ThemeOptionService) { }

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
  static selectedProduct(state: ProductStateModel) {
    return state.selectedProduct;
  }

  @Selector()
  static relatedProducts(state: ProductStateModel) {
    return state.relatedProducts;
  }

  @Selector()
  static storeProducts(state: ProductStateModel) {
    return state.storeProducts;
  }

  @Selector()
  static dealProducts(state: ProductStateModel) {
    return state.dealProducts;
  }

  @Action(GetProducts)
  getProducts(ctx: StateContext<ProductStateModel>, action: GetProducts) {
    this.productService.skeletonLoader = true;
    // Note :- You must need to call api for filter and pagination as of now we are using json data so currently get all data from json 
    //          you must need apply this logic on server side
    return this.productService.getProducts(action.payload).pipe(
      tap({
        next: (result: ProductModel) => {
          let products = result.data || [];
          if (action?.payload) {
            // Note:- For Internal filter purpose only, once you apply filter logic on server side then you can remove  it as per your requirement.
            // Note:- we have covered only few filters as demo purpose
            products = result.data.filter(product =>
              (action?.payload?.['store_slug'] && product?.store?.slug == action?.payload?.['store_slug']) ||
              (
                action?.payload?.['category'] && product?.categories?.length &&
                product?.categories?.some(category => action?.payload?.['category']?.split(',')?.includes(category.slug))
              )
            )

            products = products.length ? products : result.data;

            if (action?.payload?.['sortBy']) {
              if (action?.payload?.['sortBy'] === 'asc') {
                products = products.sort((a, b) => {
                  if (a.id < b.id) {
                    return -1;
                  } else if (a.id > b.id) {
                    return 1;
                  }
                  return 0;
                })
              } else if (action?.payload?.['sortBy'] === 'desc') {
                products = products.sort((a, b) => {
                  if (a.id > b.id) {
                    return -1;
                  } else if (a.id < b.id) {
                    return 1;
                  }
                  return 0;
                })
              } else if (action?.payload?.['sortBy'] === 'a-z') {
                products = products.sort((a, b) => {
                  if (a.name < b.name) {
                    return -1;
                  } else if (a.name > b.name) {
                    return 1;
                  }
                  return 0;
                })
              } else if (action?.payload?.['sortBy'] === 'z-a') {
                products = products.sort((a, b) => {
                  if (a.name > b.name) {
                    return -1;
                  } else if (a.name < b.name) {
                    return 1;
                  }
                  return 0;
                })
              } else if (action?.payload?.['sortBy'] === 'low-high') {
                products = products.sort((a, b) => {
                  if (a.sale_price < b.sale_price) {
                    return -1;
                  } else if (a.price > b.price) {
                    return 1;
                  }
                  return 0;
                })
              } else if (action?.payload?.['sortBy'] === 'high-low') {
                products = products.sort((a, b) => {
                  if (a.sale_price > b.sale_price) {
                    return -1;
                  } else if (a.price < b.price) {
                    return 1;
                  }
                  return 0;
                })
              }
            } else if (!action?.payload?.['ids']) {
              products = products.sort((a, b) => {
                if (a.id < b.id) {
                  return -1;
                } else if (a.id > b.id) {
                  return 1;
                }
                return 0;
              })
            }

            if (action?.payload?.['search']) {
              products = products.filter(product => product.name.toLowerCase().includes(action?.payload?.['search'].toLowerCase()))
            }
          }

          ctx.patchState({
            product: {
              data: products,
              total: result?.total ? result?.total : result.data?.length
            }
          });
        },
        complete: () => {
          this.productService.skeletonLoader = false;
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(GetRelatedProducts)
  getRelatedProducts(ctx: StateContext<ProductStateModel>, action: GetProducts) {
    this.themeOptionService.preloader = true;
    return this.productService.getProducts(action.payload).pipe(
      tap({
        next: (result: ProductModel) => {
          const state = ctx.getState();
          const products = result.data.filter(product =>
            action?.payload?.['ids']?.split(',')?.map((id: number) => Number(id)).includes(product.id) ||
            (product?.categories?.length && product?.categories?.map(category => category.id).includes(Number(action?.payload?.['category_ids'])))
          );
          ctx.patchState({
            ...state,
            relatedProducts: products
          });
        },
        complete: () => {
          this.themeOptionService.preloader = false;
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(GetStoreProducts)
  getStoreProducts(ctx: StateContext<ProductStateModel>, action: GetProducts) {
    return this.productService.getProducts(action.payload).pipe(
      tap({
        next: (result: ProductModel) => {
          const state = ctx.getState();
          const products = result.data.filter(product =>
            action?.payload?.['store_ids']?.split(',')?.map((id: number) => Number(id)).includes(product.store_id));
          ctx.patchState({
            ...state,
            storeProducts: products
          });
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
  }

  @Action(GetProductBySlug)
  getProductBySlug(ctx: StateContext<ProductStateModel>, { slug }: GetProductBySlug) {
    this.themeOptionService.preloader = true;
    const result$ = this.productService.getProductBySlug({ slug: slug }).pipe(
      map(obj => {
          if(obj.data.length){
            obj.data.map(i => {
              i.related_products = i.related_products && i.related_products.length ? this.uniqByReduce(i.related_products) : []
              i.cross_sell_products = i.cross_sell_products && i.cross_sell_products.length ? this.uniqByReduce(i.cross_sell_products) : []
              i.categories = i.categories && i.categories.length ? i.categories.filter((v,i,a)=>a.findIndex(v2=>(v2.id===v.id))===i) : []
              i.product_galleries = i.product_galleries && i.product_galleries.length ? i.product_galleries.filter((v,i,a)=>a.findIndex(v2=>(v2.id===v.id))===i)  : []
            })
          }
          return obj;
      }),
      tap({
        next: results => {
          const result = results.data.pop();

          if (result) {
            result.related_products = result.related_products && result.related_products.length ? this.uniqByReduce(result.related_products) : [];
            result.cross_sell_products = result.cross_sell_products && result.cross_sell_products.length ? this.uniqByReduce(result.cross_sell_products) : [];

            result.categories = result.categories && result.categories.length ? this.uniqByReduce(result.categories) : [];
            result.product_galleries = result.product_galleries && result.product_galleries.length ? this.uniqByReduce(result.product_galleries) : [];

            const ids = [...result.related_products, ...result.cross_sell_products];
            const categoryIds = [...result?.categories?.map(category => category.id)];
            this.store.dispatch(new GetRelatedProducts({ ids: ids.join(','), category_ids: categoryIds.join(','), status: 1 }));

            const state = ctx.getState();
            ctx.patchState({
              ...state,
              selectedProduct: result
            });
          } else {
            this.router.navigate(['/404']);
          }

        },
        complete: () => {
          this.themeOptionService.preloader = false;
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
    return result$
  }

  @Action(GetDealProducts)
  getDealProducts(ctx: StateContext<ProductStateModel>, action: GetDealProducts) {
    return this.productService.getProducts(action.payload).pipe(
      tap({
        next: (result: ProductModel) => {
          const state = ctx.getState();
          const products = result.data.filter(product =>
            action?.payload?.['ids']?.split(',')?.map((id: number) => Number(id)).includes(product.id));
          ctx.patchState({
            ...state,
            dealProducts: products.length ? products : result?.data?.reverse()?.slice(0, 2)
          });
        },
        error: err => {
          throw new Error(err?.error?.message);
        }
      })
    );
  }
}
