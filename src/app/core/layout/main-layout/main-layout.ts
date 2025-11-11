import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from '../../../shared/services/category.service';
import { SharedService } from '../../../shared/services/sahared.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-main-layout',
  standalone: false,
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {
  @ViewChild('myScrollContainer') myScrollContainer!: ElementRef;
  scrollTop = 0;
  lastScrollTop = 0;
  private delta = 20;
  hideTopBar = false;
  private destroy$ = new Subject<void>();

  constructor(
    public router: Router,
    private categoryService: CategoryService,
    private sharedService: SharedService
  ) {
    this.getAllCategories();
  }

  ngAfterViewInit() {
    this.sharedService.scrollTop$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.myScrollContainer.nativeElement.scrollTo({ top: 0, behavior: 'smooth' });
    });
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

  onActivate(event: any) {
    if (this.myScrollContainer) {
      this.sharedService.triggerScrollTop();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
