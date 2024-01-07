import { Component, Input } from '@angular/core';
import { Product } from '../../../../../shared/interface/product.interface';
import { Option } from '../../../../../shared/interface/theme-option.interface';

@Component({
  selector: 'app-product-images',
  templateUrl: './product-images.component.html',
  styleUrls: ['./product-images.component.scss']
})
export class ProductImagesComponent {

  @Input() product: Product;
  @Input() option: Option | null;

}
