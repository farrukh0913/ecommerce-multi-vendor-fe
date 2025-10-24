import { Component } from '@angular/core';

@Component({
  selector: 'app-product-detail',
  standalone: false,
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail {
  count=1
  productImages = [
    'https://laravel.pixelstrap.net/multikart/storage/52/fashion_172.jpg',
    'https://laravel.pixelstrap.net/multikart/storage/51/fashion_171.jpg',
    'https://laravel.pixelstrap.net/multikart/storage/51/fashion_171.jpg',
    'https://laravel.pixelstrap.net/multikart/storage/51/fashion_171.jpg',
    'https://laravel.pixelstrap.net/multikart/storage/51/fashion_171.jpg',
  ];
  selectedImage = this.productImages[0];

  onSelectImage(image: string) {
    this.selectedImage = image;
  }
  onIncrement() {
    this.count++;
  }
  onDecrement() {
    if (this.count > 1) {
      this.count--;
    }
  }
}
