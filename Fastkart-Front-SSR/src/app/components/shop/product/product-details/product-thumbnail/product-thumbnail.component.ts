import { AfterViewInit, Component, Input } from '@angular/core';
import { Product } from '../../../../../shared/interface/product.interface';
import { Option } from '../../../../../shared/interface/theme-option.interface';
import * as data from  '../../../../../shared/data/owl-carousel';

@Component({
  selector: 'app-product-thumbnail',
  templateUrl: './product-thumbnail.component.html',
  styleUrls: ['./product-thumbnail.component.scss']
})
export class ProductThumbnailComponent implements AfterViewInit {

  @Input() product: Product;
  @Input() option: Option | null;

  public activeSlide: string = '0';

  public productMainThumbSlider = data.productMainThumbSlider;
  public productThumbSlider = data.productThumbSlider;

  constructor() {
    console.log("Selected prod:")
    
  }
  ngAfterViewInit(): void {
    console.log(this.product)
  }
  

}
