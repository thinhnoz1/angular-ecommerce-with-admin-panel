import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ThemeOptionRoutingModule } from './theme-option-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

// Components
import { ThemeOptionComponent } from './theme-option.component';

// State
import { ThemeOptionState } from '../../shared/state/theme-option.state';
import { CategoryState } from '../../shared/state/category.state';
import { PageState } from '../../shared/state/page.state';
import { ProductState } from '../../shared/state/product.state';
import { BlogState } from '../../shared/state/blog.state';

@NgModule({
  declarations: [
    ThemeOptionComponent
  ],
  imports: [
    CommonModule,
    ThemeOptionRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    CKEditorModule,
    NgxsModule.forFeature([
      ThemeOptionState, 
      CategoryState,
      PageState,
      ProductState,
      BlogState
    ])
  ]
})

export class ThemeOptionModule { }
