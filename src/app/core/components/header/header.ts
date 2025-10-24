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
    { label: 'Home', path: '/', icon: 'home-outline' },
    { label: 'Design Tool', path: '/design-tool', icon: 'pencil-outline' },
    { label: 'Shop Now', path: '/shop-now', icon: 'bag-handle-outline' },
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
