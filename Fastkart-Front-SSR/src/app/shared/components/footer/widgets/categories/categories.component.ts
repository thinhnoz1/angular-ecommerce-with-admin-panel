import { Component, Input, SimpleChanges } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { CategoryState } from '../../../../../shared/state/category.state';
import { Option } from '../../../../../shared/interface/theme-option.interface';
import { CategoryModel, Category } from '../../../../../shared/interface/category.interface';

@Component({
  selector: 'app-footer-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class FooterCategoriesComponent {

  @Input() data: Option | null;

  @Select(CategoryState.category) category$: Observable<CategoryModel>;

  public categories: Category[];

  ngOnChanges(changes: SimpleChanges) {
    const ids = changes['data']?.currentValue?.footer?.footer_categories
    if (Array.isArray(ids)) {
      this.category$.subscribe(categories => {
        if(Array.isArray(categories.data)) {
          this.categories = categories.data.filter(category => ids?.includes(category.id));
        }
      })
    }
  }

}
