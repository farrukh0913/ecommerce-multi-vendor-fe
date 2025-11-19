import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { getCurrencySymbol } from '../../utils/currency.utils';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { SharedService } from '../../services/sahared.service';

@Component({
  selector: 'app-product-detail',
  standalone: false,
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetail {
  @Input() productId: any = null;
  @Output() productLoaded = new EventEmitter<any>();
  count = 1;
  product: any = null;
  imageBaseUrl: string = environment.r2BaseUrl + '/';
  getCurrencySymbol = getCurrencySymbol;
  productImages: any = [];
  selectedImage = '';
  selectedColor: any = null;
  selectedSize: any = null;

  constructor(
    private spinner: NgxUiLoaderService,
    private productService: ProductService,
    private cartService: CartService,
    private sharedService: SharedService
  ) {}

  /**
   * Detect input changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['productId']) {
      console.log('productId changed to:', this.productId);
      this.getProductDetail(this.productId);
    }
  }

  /**
   * update variable on selection of image
   * @param image
   */
  onSelectImage(image: string) {
    this.selectedImage = image;
  }

  /**
   * increment the coutn to increase product quantity
   */
  onIncrement() {
    if (this.product.priceList[0].stock_quantity) {
      if (this.count < this.product.priceList[0].stock_quantity) {
        this.count++;
      }
    } else {
      this.count = 0;
    }
  }

  /**
   * decrement the coutn to increase product quantity
   */
  onDecrement() {
    if (this.count > 1) {
      this.count--;
    }
  }

  /**
   * Fetches all product related info from apis
   * @returns {void}
   */
  getProductDetail(productId: string): void {
    this.spinner.start();
    this.productService.getProductDetails(productId).subscribe({
      next: (data) => {
        this.product = data;
        // console.log('Categories data:', data);
      },
      error: (err) => {
        console.log(err);
      },
      complete: () => {
        this.spinner.stop();
        this.productLoaded.emit(this.product);

        // set default size
        const defaultSize = this.product?.variants?.size?.find(
          (data: any) => data.is_default === true
        );
        this.selectedSize = defaultSize ? defaultSize : this.product?.variants?.size?.[0];
        this.resetImage();

        console.log(this.product?.variants?.color?.length);
      },
    });
  }

  /**
   * update value fo select color and sizes
   * @param event
   * @param value
   * @param attr
   */
  updateValue(event: MouseEvent, value: any, attr: 'selectedColor' | 'selectedSize') {
    event.stopPropagation();

    const images = this.product.media.filter((image: any) => {
      return image.variant_id === value.id;
    });
    if (images.length) {
      this.productImages = images;
      this.selectedImage = images[0].url;
    } else {
      this.resetImage();
    }
    this[attr] = value;
  }

  /**
   * add item to cart with seelct color and sizes
   */
  addProductToCart() {
    console.log('this.selectedColor: ', this.selectedColor);
    const payload = {
      components: '{}',
      pricelist_id: this.product?.priceList?.[0]?.id,
      product_id: this.product.id,
      quantity: this.count,
      saved_for_later: true,
      user_id: 'Cg0wLTM4NS0yODA4OS0wEgRtb2Nr',
      variants: {
        selectedColor: this.selectedColor,
        selectedSize: this.selectedSize,
        thumbnail_url: this.productImages?.[0]?.url || this.product?.thumbnail_url,
      },
    };
    this.cartService.addCartItem(payload).subscribe({
      next: (res) => {
        console.log('Item added to cart successfully:', res);
        this.sharedService.showToast('Your item was added successfully.');
      },
      error: (err) => {
        this.sharedService.showToast('Error adding item to cart', 'error');
        console.error('Error adding item to cart:', err);
      },
    });
  }
  resetImage() {
    this.productImages = this.product.media.filter((image: any) => {
      return !image.variant_id;
    });
    this.productImages.push({ id: null, url: this.product.thumbnail_url });
    this.selectedImage = this.product.thumbnail_url;
  }
}
