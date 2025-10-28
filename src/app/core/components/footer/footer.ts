import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CategoryService } from '../../../shared/services/category';
import { Subject, takeUntil } from 'rxjs';
import { ResponsiveService } from '../../../shared/services/responsive';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer implements OnInit, OnDestroy {
  currentYear = new Date().getFullYear();
 visible: { [key: string]: boolean } = {
  '1': false,
  '2': false,
  '3': false,
  '4': false,
};
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
   isMobile = inject(ResponsiveService).isMobile;
  private destroy$ = new Subject<void>();

  constructor(private categoryService: CategoryService) {}
  ngOnInit(): void {
    // Subscribe to shared categories observable
    this.categoryService.categories$.pipe(takeUntil(this.destroy$)).subscribe((cats) => {
      this.categories = cats;
      console.log('this.categories: ', this.categories);
    });
  }


setVisible(itemNo: string) {
  this.visible[itemNo] = !this.visible[itemNo];
}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
