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
    'https://myimprint.ca/wp-content/uploads/2024/11/33504_fm.jpg.webp',
    'https://pluspng.com/img-png/shirt-png-hd-download-png-image-dress-shirt-png-hd-480.png',
    'https://m.media-amazon.com/images/I/710mqhd9mCL._UY1100_.jpg',
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
