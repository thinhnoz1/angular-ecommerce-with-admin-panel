import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, combineLatest, combineLatestWith, forkJoin, map, mergeMap, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CategoryService } from './category.service';
import { Paris } from '../interface/theme.interface';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor(private http: HttpClient) { }

  getHomePageParis(slug?: string): Observable<Paris> {
    if(!slug) {
      slug = 'paris';
    }

    const theme_datasetting$ = this.http.get<Paris>(`${environment.URL}/themes/${slug}.json`);
    const parentCategories$ = CategoryService.getCategories(this.http, {});
    const product$ = ProductService.getProducts(this.http, {});
    // Add categories data to theme_datasetting
    const itemWithFavoriteProperty$ = theme_datasetting$.pipe(
      switchMap(item => forkJoin([parentCategories$, product$]).pipe(
        //mergeMap((category, product) => ([category.map(i => i.id), product.data.map(i => i.id)])),
        //map((category_ids, product_ids ) => ({...item, category_ids, product_ids}))
        map(([category_ids, product_ids ]) => ({...item, category_ids, product_ids}))
      )),
      map(obj => {
        obj.content.main_content.sidebar.categories_icon_list.category_ids = obj.category_ids.data.filter(i => !i.parent_id).map(i => i.id);
        obj.content.main_content.sidebar.sidebar_products.product_ids = obj.product_ids.data.filter(i => i.is_trending).map(i => i.id);

        // Product section 1
        obj.content.main_content.section1_products.product_ids = obj.product_ids.data.filter(i => i.is_sale_enable).map(i => i.id);

        // Product section 2
        obj.content.main_content.section2_categories_list.product_ids = [54,55,56]
        obj.content.main_content.section2_categories_list.category_ids = obj.category_ids.data.filter(x => x.parent_id == 4).map(i => i.id);

        // Product section 2_2
        obj.content.main_content.section2_categories_list_2.product_ids = [57,58]
        obj.content.main_content.section2_categories_list_2.category_ids = obj.category_ids.data.filter(x => x.parent_id == 5).map(i => i.id);

        // debugger

        obj.content.main_content.section4_products.product_ids = obj.product_ids.data.filter(i => i.is_trending).map(i => i.id);
        obj.content.main_content.section7_products.product_ids = obj.product_ids.data.filter(i => i.is_trending).map(i => i.id);

        return obj
      })
    )
    // itemWithFavoriteProperty$.subscribe(console.log);
    return itemWithFavoriteProperty$
  }

}
