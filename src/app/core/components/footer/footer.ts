import { Component, OnDestroy, OnInit } from '@angular/core';
import { CategoryService } from '../../../shared/services/category';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer implements OnInit, OnDestroy {
  currentYear = new Date().getFullYear();
  brands: string[] = [
    'Adidas',
    'American Apparel',
    'Apron',
    'ATC',
    'Athletic',
    'Baseball',
    'Beanies',
  ];
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
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
