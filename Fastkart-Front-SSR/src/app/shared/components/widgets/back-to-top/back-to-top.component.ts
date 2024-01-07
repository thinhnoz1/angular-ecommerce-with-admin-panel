import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-back-to-top',
  templateUrl: './back-to-top.component.html',
  styleUrls: ['./back-to-top.component.scss']
})
export class BackToTopComponent {

  public show: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
   private viewScroller: ViewportScroller) {
  }

  // @HostListener Decorator
  @HostListener("window:scroll", [])
  onWindowScroll() {
    if (isPlatformBrowser(this.platformId)) { // For SSR 
      let number = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      if (number > 600) { 
        this.show = true;
      } else {
        this.show = false;
      }
    }
  }

  tapToTop() {
  	this.viewScroller.scrollToPosition([0, 0]);
  }

}
