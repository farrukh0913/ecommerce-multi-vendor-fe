import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from '../../../shared/services/category.service';

@Component({
  selector: 'app-main-layout',
  standalone: false,
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayout {
  scrollTop = 0;
  lastScrollTop = 0;
  private delta = 20;
  hideTopBar = false;

  constructor(public router: Router, private categoryService: CategoryService) {
    this.getAllCategories();
  }

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

  /**
   * Fetches all product categories
   * @returns {void}
   */
  getAllCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (data) => {},
      error: (err) => {},
      complete: () => {},
    });
  }
}
