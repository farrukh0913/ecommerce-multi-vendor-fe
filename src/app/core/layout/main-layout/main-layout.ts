import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: false,
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {
  scrollTop = 0;
  lastScrollTop = 0;
  private delta = 20;
  hideTopBar = false;

  constructor(public router: Router) {}

  /**
   * update show/hide top-bar in header compoenet
   * @param event
   * @returns
   */
  onScroll(event: any) {
    this.scrollTop = event.target.scrollTop;

    if (Math.abs(this.scrollTop - this.lastScrollTop) <= this.delta) {
      return;
    }

    if (this.scrollTop > this.lastScrollTop && this.scrollTop > 50) {
      this.hideTopBar = true;
    } else if (this.scrollTop + event.target.clientHeight < event.target.scrollHeight) {
      this.hideTopBar = false;
    }

    this.lastScrollTop = this.scrollTop <= 0 ? 0 : this.scrollTop;
  }
}
