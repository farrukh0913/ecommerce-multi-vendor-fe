import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  @Input() hideTopBar = false;
  menuOpen = false;
  topBarLinks = [
    { label: 'News & Events', path: '/news-events' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Contact Us', path: '/contact-us' },
  ];
 mainNavLinks = [
  { label: 'Home', path: '/', icon: 'fa-solid fa-house' },
  { label: 'Design Tool', path: '/shop', icon: 'fa-solid fa-pencil-ruler' },
  { label: 'Shop Now', path: '/shop-now', icon: 'fa-solid fa-cart-shopping' },
];



  /**
   * toggle side menu
   */
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  /**
   * close side menu
   */
  closeMenu() {
    this.menuOpen = false;
  }
}
