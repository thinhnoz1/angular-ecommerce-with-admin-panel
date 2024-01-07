import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { Params } from '../../../../../../shared/interface/core.interface';

@Component({
  selector: 'app-collection-rating-filter',
  templateUrl: './collection-rating-filter.component.html',
  styleUrls: ['./collection-rating-filter.component.scss']
})
export class CollectionRatingFilterComponent {

  @Input() filter: Params;

  public numbers: number[] = Array.from({length: 5}, (_, i) => i + 1).reverse();

  public selectedRatings: string[] = [];

  constructor(private route: ActivatedRoute,
    private router: Router){
  }

  ngOnChanges() {
    this.selectedRatings = this.filter['rating'] ? this.filter['rating'].split(',') : [];
  }

  applyFilter(event: Event) {
    const index = this.selectedRatings.indexOf((<HTMLInputElement>event?.target)?.value);  // checked and unchecked value

    if ((<HTMLInputElement>event?.target)?.checked)
      this.selectedRatings.push((<HTMLInputElement>event?.target)?.value); // push in array cheked value
    else
      this.selectedRatings.splice(index,1);  // removed in array unchecked value

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        rating: this.selectedRatings.length ? this.selectedRatings.join(",") : null
      },
      queryParamsHandling: 'merge', // preserve the existing query params in the route
      skipLocationChange: false  // do trigger navigation,
    });

  }

  // check if the item are selected
  checked(item: string){
    if(this.selectedRatings?.indexOf(item) != -1){
      return true;
    }
    return false;
  }

}
