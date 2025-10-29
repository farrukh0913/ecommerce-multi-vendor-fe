import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryService } from '../../shared/services/category.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-shop-now',
  standalone: false,
  templateUrl: './shop-now.html',
  styleUrl: './shop-now.scss',
})
export class ShopNow {
  breadcrumb = [
    {
      name: 'Home',
      path: '/',
    },
    {
      name: 'Categories',
      path: null,
    },
  ];
  categories: any = [
    {
      name: 'T-Shirts',
      products: 102,
      image: 'https://myimprint.ca/wp-content/uploads/2024/11/33504_fm.jpg.webp',
    },
    {
      name: 'Athletic/Sport Shirts',
      products: 12,
      image: 'https://myimprint.ca/wp-content/uploads/2024/11/33504_fm.jpg.webp',
    },
    {
      name: 'Full Sleeve T-shirt',
      products: 22,
      image: 'https://myimprint.ca/wp-content/uploads/2024/11/33504_fm.jpg.webp',
    },
    {
      name: 'Baseball T-shirt',
      products: 3,
      image: 'https://myimprint.ca/wp-content/uploads/2024/11/33504_fm.jpg.webp',
    },
    {
      name: 'Pocket T-Shirts',
      products: 5,
      image: 'https://myimprint.ca/wp-content/uploads/2024/11/33504_fm.jpg.webp',
    },
    {
      name: 'Polo',
      products: 42,
      image: 'https://myimprint.ca/wp-content/uploads/2024/11/33504_fm.jpg.webp',
    },
    {
      name: 'Polos/Sport Shirts',
      products: 31,
      image: 'https://myimprint.ca/wp-content/uploads/2024/11/33504_fm.jpg.webp',
    },
    {
      name: 'T-Shirts - Long Sleeve',
      products: 18,
      image: 'https://myimprint.ca/wp-content/uploads/2024/11/33504_fm.jpg.webp',
    },
    {
      name: 'Youth',
      products: 32,
      image: 'https://myimprint.ca/wp-content/uploads/2024/11/33504_fm.jpg.webp',
    },
    {
      name: 'Crewneck Sweatshirt',
      products: 20,
      image: 'https://myimprint.ca/wp-content/uploads/2024/11/33504_fm.jpg.webp',
    },
    {
      name: 'Sweatshirt',
      products: 66,
      image: 'https://myimprint.ca/wp-content/uploads/2024/11/33504_fm.jpg.webp',
    },
    {
      name: 'Hoodie',
      products: 47,
      image: 'https://myimprint.ca/wp-content/uploads/2024/11/33504_fm.jpg.webp',
    },
    {
      name: 'Hoodie Full-Zip',
      products: 9,
      image: 'https://myimprint.ca/wp-content/uploads/2024/11/33504_fm.jpg.webp',
    },
    {
      name: "Women's",
      products: 70,
      image: 'https://myimprint.ca/wp-content/uploads/2024/11/33504_fm.jpg.webp',
    },
    {
      name: 'Headwear',
      products: 79,
      image: 'https://myimprint.ca/wp-content/uploads/2024/11/33504_fm.jpg.webp',
    },
    {
      name: 'Headwear - Winter',
      products: 20,
      image: 'https://myimprint.ca/wp-content/uploads/2024/11/33504_fm.jpg.webp',
    },
    {
      name: 'Apron',
      products: 4,
      image: 'https://myimprint.ca/wp-content/uploads/2024/11/33504_fm.jpg.webp',
    },
    {
      name: 'Athletics',
      products: 7,
      image: 'https://myimprint.ca/wp-content/uploads/2024/11/33504_fm.jpg.webp',
    },
    {
      name: 'Bodysuit',
      products: 3,
      image: 'https://myimprint.ca/wp-content/uploads/2024/11/33504_fm.jpg.webp',
    },
    {
      name: 'Business Card',
      products: 1,
      image: 'https://myimprint.ca/wp-content/uploads/2024/11/33504_fm.jpg.webp',
    },
    {
      name: 'Bags',
      products: 4,
      image: 'https://myimprint.ca/wp-content/uploads/2024/11/33504_fm.jpg.webp',
    },
    {
      name: 'Accessories',
      products: 12,
      image: 'https://myimprint.ca/wp-content/uploads/2024/11/33504_fm.jpg.webp',
    },
    {
      name: 'Mouse Pad',
      products: 1,
      image: 'https://myimprint.ca/wp-content/uploads/2024/11/33504_fm.jpg.webp',
    },
    {
      name: 'Mugs',
      products: 4,
      image: 'https://myimprint.ca/wp-content/uploads/2024/11/33504_fm.jpg.webp',
    },
    {
      name: 'Outerwear',
      products: 11,
      image: 'https://myimprint.ca/wp-content/uploads/2024/11/33504_fm.jpg.webp',
    },
    {
      name: 'PPE',
      products: 2,
      image: 'https://myimprint.ca/wp-content/uploads/2024/11/33504_fm.jpg.webp',
    },
    {
      name: 'Quarter Zips',
      products: 26,
      image: 'https://myimprint.ca/wp-content/uploads/2024/11/33504_fm.jpg.webp',
    },
    {
      name: 'Sweatpants',
      products: 18,
      image: 'https://myimprint.ca/wp-content/uploads/2024/11/33504_fm.jpg.webp',
    },
    {
      name: 'Tank Tops',
      products: 16,
      image: 'https://myimprint.ca/wp-content/uploads/2024/11/33504_fm.jpg.webp',
    },
    {
      name: 'Toddler',
      products: 8,
      image: 'https://myimprint.ca/wp-content/uploads/2024/11/33504_fm.jpg.webp',
    },
    {
      name: 'Tote Bag',
      products: 8,
      image: 'https://myimprint.ca/wp-content/uploads/2024/11/33504_fm.jpg.webp',
    },
  ];
  private destroy$ = new Subject<void>();
  constructor(private router: Router, private categoryService: CategoryService) {}
  ngOnInit(): void {
    // Subscribe to shared categories observable
    this.categoryService.categories$.pipe(takeUntil(this.destroy$)).subscribe((cats) => {
      this.categories = cats;
      console.log('this.categories: ', this.categories);
    });
  }

  /**
   * Navigates to the page displaying products of the selected category.
   * @param category
   */
  goToCategory(category: any) {
    console.log('category: ', category);
    console.log('category.name: ', category.name);
    this.router.navigate(['/products-by-category', category.id, category.name]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
