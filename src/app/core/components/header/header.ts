import { Component, inject, Input } from '@angular/core';
import { ResponsiveService } from '../../../shared/services/responsive.service';

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
    { label: 'Shop Now', path: '/shop-now', icon: 'bag-handle-outline' },
    { label: 'Design Tool', path: '/design-tool', icon: 'pencil-outline' },
  ];
  isMobile = inject(ResponsiveService).isMobile;
  categoryMenuOpen: boolean = false;
  showSearchModal: boolean = false;
  categories = ['New Arrivals', 'Men', 'Women', 'Kids', 'Sport', 'Sportswear'];

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

  onCategorySelect(category: string) {
    console.log('Selected:', category);
    this.categoryMenuOpen = false; // close menu after selecting
    // navigate or filter products as needed
  }
}
