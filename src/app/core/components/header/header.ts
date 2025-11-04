import { Component, inject, Input } from '@angular/core';
import { ResponsiveService } from '../../../shared/services/responsive.service';
import { Subject, takeUntil } from 'rxjs';
import { CategoryService } from '../../../shared/services/category.service';

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
  categories: any = [];
  private destroy$ = new Subject<void>();

  constructor(private categoryService: CategoryService) {}
  ngOnInit(): void {
    // Subscribe to shared categories observable
    this.categoryService.categories$.pipe(takeUntil(this.destroy$)).subscribe((cats) => {
      this.categories = cats;
      console.log('this.categories: ', this.categories);
    });
  }
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
