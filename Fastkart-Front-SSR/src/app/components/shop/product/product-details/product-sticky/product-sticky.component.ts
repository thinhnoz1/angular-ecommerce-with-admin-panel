import { Component, Input } from '@angular/core';
import { Product } from '../../../../../shared/interface/product.interface';
import { Option } from '../../../../../shared/interface/theme-option.interface';

@Component({
  selector: 'app-product-sticky',
  templateUrl: './product-sticky.component.html',
  styleUrls: ['./product-sticky.component.scss']
})
export class ProductStickyComponent {

  @Input() product: Product;
  @Input() option: Option | null;

}
