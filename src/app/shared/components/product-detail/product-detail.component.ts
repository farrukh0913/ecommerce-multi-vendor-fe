import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { getCurrencySymbol } from '../../utils/currency.utils';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-detail',
  standalone: false,
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
})
export class ProductDetail {
  @Input() productId: any = null;
  @Output() productLoaded = new EventEmitter<any>();
  count = 1
  product:any=null
  imageBaseUrl: string = environment.s3BaseUrl;
  getCurrencySymbol = getCurrencySymbol;
  productImages = [
    'https://laravel.pixelstrap.net/multikart/storage/51/fashion_171.jpg',
    'https://laravel.pixelstrap.net/multikart/storage/52/fashion_172.jpg',
  ];
  selectedImage = ""

constructor(
    private router: Router,
    private spinner: NgxUiLoaderService,
    private productService: ProductService
  ) {}

  ngOnInit(){
    this.getProductDetail(this.productId)
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['productId']) {
      console.log('productId changed to:', this.productId);
      this.getProductDetail(this.productId)

      // Run your logic whenever productId changes
    }
  }

  onSelectImage(image: string) {
    this.selectedImage = image;
  }
  onIncrement() {
    if (this.product.priceList[0].stock_quantity) {

      if (this.count < this.product.priceList[0].stock_quantity) {

        this.count++;
      }
    }
    else {
      this.count = 0
    }

  }
  onDecrement() {
    if (this.count > 1) {
      this.count--;
    }
  }

   /**
   * Fetches all New products
   * @returns {void}
   */
  getProductDetail(productId:string): void {
    console.log('productId: ', productId);
    this.spinner.start();
    this.productService.getProductDetails(productId).subscribe({
      next: (data) => {
        this.product = data;
        console.log('this.selectedItem: ', this.product);
        // console.log('Categories data:', data);
      },
      error: (err) => {console.log(err) },
      complete: () => {
        this.spinner.stop();
        this.productLoaded.emit(this.product);
       this.selectedImage=this.imageBaseUrl + this.product?.thumbnail_url;
      },
    });
  }
}
