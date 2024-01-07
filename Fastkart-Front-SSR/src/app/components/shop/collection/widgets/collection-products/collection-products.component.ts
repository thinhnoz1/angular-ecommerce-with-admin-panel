import { Component, Input } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ProductService } from '../../../../../shared/services/product.service';
import { ProductModel } from '../../../../../shared/interface/product.interface';
import { ProductState } from '../../../../../shared/state/product.state';
import { Params } from '../../../../../shared/interface/core.interface';

@Component({
  selector: 'app-collection-products',
  templateUrl: './collection-products.component.html',
  styleUrls: ['./collection-products.component.scss']
})
export class CollectionProductsComponent {

  @Select(ProductState.product) product$: Observable<ProductModel>;

  @Input() filter: Params;
  @Input() gridCol: string;

  public gridClass: string = "row g-sm-4 g-3 row-cols-xxl-4 row-cols-xl-3 row-cols-lg-2 row-cols-md-3 row-cols-2 product-list-section";

  public skeletonItems = Array.from({ length: 40 }, (_, index) => index);

  constructor(public productService: ProductService) {
  }

  setGridClass(gridClass: string) {
    this.gridClass = gridClass;
  }
}
