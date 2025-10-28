import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-product-detail',
  standalone: false,
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail {
  count=1
  @Input() product: any = null;

  productImages = [
    'https://laravel.pixelstrap.net/multikart/storage/51/fashion_171.jpg',
    'https://laravel.pixelstrap.net/multikart/storage/52/fashion_172.jpg',
  ];
  selectedImage = this.productImages[0];

  onSelectImage(image: string) {
    this.selectedImage = image;
  }
  onIncrement() {
    if(this.product.priceList[0].stock_quantity){

      if(this.count<this.product.priceList[0].stock_quantity){
  
        this.count++;
      }
    }
    else{
      this.count=0
    }

  }
  onDecrement() {
    if (this.count > 1) {
      this.count--;
    }
  }
}
