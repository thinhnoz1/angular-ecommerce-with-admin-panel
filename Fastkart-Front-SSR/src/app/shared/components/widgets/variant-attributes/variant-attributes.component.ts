import { Component, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Attribute, AttributeValue } from '../../../interface/attribute.interface';
import { Product, Variation, SelectedVariant } from '../../../interface/product.interface';
import { Cart } from '../../../interface/cart.interface';
import { CartState } from '../../../state/cart.state';

@Component({
  selector: 'app-variant-attributes',
  templateUrl: './variant-attributes.component.html',
  styleUrls: ['./variant-attributes.component.scss']
})
export class VariantAttributesComponent {

  @Input() product: Product;
  @Input() attributes: Attribute[] = [];
  @Input() isAllVariantStyleDropdown: boolean = false;
  @Input() owlCar: any;

  @Output() selectVariation: EventEmitter<Variation | null> = new EventEmitter();

  @Select(CartState.cartItems) cartItem$: Observable<Cart[]>;

  public cartItem: Cart | null;
  public productQty: number = 1;
  public attributeValues: number[] = [];
  public variantIds: number[] = [];
  public soldOutAttributesIds: number[] = [];
  public selectedOptions: SelectedVariant[] = [];
  public selectedVariation: Variation | null;

  ngOnChanges(changes: SimpleChanges) {
    setTimeout(() => {
      if(changes['product'] && changes['product'].currentValue) {
        this.product = changes['product']?.currentValue;
      }
  
      if(changes['attributes'] && changes['attributes'].currentValue) {
        this.attributes = changes['attributes']?.currentValue;
      }
  
      this.cartItem$.subscribe(items => {
        this.cartItem = items.find(item => item.product.id == this.product.id)!;
      });
  
      this.checkVariantAvailability(this.product);
    }, 0);
    
  }

  checkVariantAvailability(product: Product) {
    this.selectedOptions = [];
    this.attributeValues = [];
    this.selectedVariation = null;

    product?.variations?.forEach(variation => {
      variation?.attribute_values?.filter(attribute_value => {
        if(this.attributeValues.indexOf(attribute_value?.id) === -1)
          this.attributeValues.push(attribute_value?.id);
      });
    });

    // Set cart Vatriant Default
    if(this.cartItem?.variation) {
      this.cartItem?.variation.attribute_values.filter(attribute_val => {
        this.setVariant(this.product.variations, attribute_val);
      });
    }

    if(!this.cartItem) {
      // Set First Vatriant Default
      for (const attribute of product?.attributes) {
        if (this.attributeValues?.length && attribute?.attribute_values?.length) {
          let values: number[] = [];
          for (const value of attribute.attribute_values) {
        
            if(values.indexOf(value.id) === -1)
              values.push(value.id);

            if (this.attributeValues.includes(value.id)) {
              this.setVariant(product.variations, value);
              break; // Break out of the inner loop after setting the first variant
            }

          }
        }
      }
    }

    // Set Variation Image
    product.variations?.forEach(variation => {
      let attrValues = variation?.attribute_values?.map(attribute_value => attribute_value?.id);
      product?.attributes.filter(attribute => {
        if(attribute.style == 'image') {
          attribute.attribute_values.filter(attribute_value => {
            if(this.attributeValues.includes(attribute_value.id)) {
              if(attrValues.includes(attribute_value.id)) {
                attribute_value.variation_image = variation.variation_image;
              }
            }
          });
        }
      });
    });
  }

  setVariant(variations: Variation[], value: AttributeValue) {
    const index = this.selectedOptions.findIndex(item => Number(item.attribute_id) === Number(value?.attribute_id));
    this.soldOutAttributesIds = [];
    if(index === -1) {
      this.selectedOptions.push({id: Number(value?.id), attribute_id: Number(value?.attribute_id)});
    } else {
      this.selectedOptions[index].id = value?.id;
    }
    variations?.forEach(variation => {
      let attrValues = variation?.attribute_values?.map(attribute_value => attribute_value?.id);
      this.variantIds = this.selectedOptions?.map(variants => variants?.id);
      let doValuesMatch = attrValues.length === this.selectedOptions.length &&
                              attrValues.every(value => this.variantIds.includes(value));
      if(doValuesMatch) {
        this.selectedVariation = variation;
        this.product['quantity'] = this.selectedVariation ? this.selectedVariation?.quantity : this.product?.quantity;
        this.product['sku'] = this.selectedVariation ? this.selectedVariation?.sku : this.product?.sku;
        if(this.owlCar && this.selectedVariation.variation_image) {
          this.owlCar.to(this.selectedVariation.variation_image.id.toString());
        }
        this.checkStockAvailable();
      }

      if(variation.stock_status == 'out_of_stock') {
        variation?.attribute_values.filter(attr_value =>  {
          if(attrValues.some(value => this.variantIds.includes(value))) {
            if(attrValues.every(value => this.variantIds.includes(value))){
              this.soldOutAttributesIds.push(attr_value.id);
            } else if(!this.variantIds.includes(attr_value.id)) {
              this.soldOutAttributesIds.push(attr_value.id);
            } 
          } else if(attrValues.length == 1 && attrValues.includes(attr_value.id)) {
            this.soldOutAttributesIds.push(attr_value.id);
          }
        });
      }
    });

    // Set Attribute Value
    this.product?.attributes.filter(attribute => {
      attribute.attribute_values.filter(a_value => {
        if(a_value.id == value.id) {
          attribute.selected_value = a_value.value;
        }
      })
    });

    this.selectVariation.emit(this.selectedVariation);
  }

  checkStockAvailable() {
    if(this.selectedVariation) {
      this.selectedVariation['stock_status'] = this.selectedVariation?.quantity < this.productQty ? 'out_of_stock' : 'in_stock';
    } else {
      this.product['stock_status']  = this.product?.quantity < this.productQty ? 'out_of_stock' : 'in_stock';
    }
  }
  
}
