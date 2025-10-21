import { Component } from '@angular/core';

@Component({
  selector: 'app-main-layout',
  standalone: false,
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {
  scrollTop = 0;
  lastScrollTop = 0;
  hideTopBar = false;

  onScroll(event: any) {
    console.log('event: ', event);
    this.scrollTop = event.target.scrollTop;

    if (this.scrollTop > this.lastScrollTop && this.scrollTop > 50) {
      this.hideTopBar = true;
    } else {
      this.hideTopBar = false;
    }
    // this.hideTopBar = false

    this.lastScrollTop = this.scrollTop <= 0 ? 0 : this.scrollTop;
  }
}
