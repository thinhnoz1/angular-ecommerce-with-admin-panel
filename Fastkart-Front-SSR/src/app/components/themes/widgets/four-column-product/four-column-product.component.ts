import { Component, Input } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ProductModel } from '../../../../shared/interface/product.interface';
import { SliderProductsTokyo } from '../../../../shared/interface/theme.interface';
import { ProductState } from '../../../../shared/state/product.state';

@Component({
  selector: 'app-four-column-product',
  templateUrl: './four-column-product.component.html',
  styleUrls: ['./four-column-product.component.scss']
})
export class FourColumnProductComponent {

  @Input() data?: SliderProductsTokyo;
  @Input() col: string;

  @Select(ProductState.product) product$: Observable<ProductModel>;

}
