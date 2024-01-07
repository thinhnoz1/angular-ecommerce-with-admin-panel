import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Select } from '@ngxs/store';
import { Select2, Select2Data, Select2SearchEvent, Select2UpdateEvent } from 'ng-select2-component';
import { Observable, Subject, debounceTime } from 'rxjs';
import { CategoryState } from '../../../../shared/state/category.state';
import { Params } from '../../../../shared/interface/core.interface';

@Component({
  selector: 'app-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LinkComponent {

  @Input() linkForm: any;
  @Input() products: Select2Data;

  @Output() productFilter: EventEmitter<Params> = new EventEmitter();
  
  @Select(CategoryState.categories) categories$: Observable<Select2Data>;  

  private destroy$ = new Subject<void>();
  public categories: Select2Data;
  private search = new Subject<string>();

  public filter = {
    'search': '',
    'paginate': 15,
    'ids': '',
    'with_union_products': false
  };

  public linkOption = [
    {
      label: 'Product',
      value: 'product'
    },
    {
      label: 'Collection',
      value: 'collection'
    },
    {
      label: 'External Url',
      value: 'external_url'
    },
  ]
   
  constructor(){
    this.categories = [];
    this.categories$.subscribe(categories => {
      categories.forEach(category => {
        this.categories?.push({
          label: category?.label, 
          value: category?.data.slug, 
          data: { 
            name: category?.data.name,
            slug: category?.data.slug,
            image: category?.data.image ? category?.data.image : 'assets/images/product.png' 
          }})
      })
    })
  }

  ngOnInit(){
    this.search
      .pipe(debounceTime(300)) // Adjust the debounce time as needed (in milliseconds)
      .subscribe((inputValue) => {
        this.filter['search'] = inputValue; 
        this.productFilter.emit(this.filter)
    });
  }

  selectProduct(event: Select2UpdateEvent){
    this.linkForm?.get('product_ids')?.setValue(event?.value)
  }

  productDropdown(event: Select2){
    if(event['innerSearchText']){
      this.productFilter.emit(this.filter)
      this.search.next('');
    } 
  }
  
  searchProduct(event: Select2SearchEvent){
    this.search.next(event.search);
  }

  selectImageLink(){
    // this.linkForm.get('link').patchValue('');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
