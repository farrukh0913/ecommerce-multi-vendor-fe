import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { getCurrencySymbol } from '../../utils/currency.utils';
import { SharedService } from '../../services/sahared.service';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-card',
  standalone: false,
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {
  @Output() quickViewClicked = new EventEmitter<any>();
  @Output() detailViewClicked = new EventEmitter<any>();
  @Input() viewMode: 'grid' | 'list' = 'grid';
  @Input() product: any = null;
  imageBaseUrl: string = environment.r2BaseUrl;
  getCurrencySymbol = getCurrencySymbol;
  selectedColor: any = null;
  selectedSize: any = null;
  productImages: any = [];

  constructor(
    private router: Router,
    private sharedService: SharedService,
    private cartService: CartService,
    private productService: ProductService
  ) {}

  /**
   * Detect input changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product'] && changes['product'].currentValue) {
      // set default color
      // const defaultColor = this.product?.variants?.color?.find(
      //   (data: any) => data.is_default === true
      // );
      // this.selectedColor = defaultColor ? defaultColor : this.product?.variants?.color?.[0];
      // set default size
      const defaultSize = this.product?.variants?.size?.find(
        (data: any) => data.is_default === true
      );
      this.selectedSize = defaultSize ? defaultSize : this.product?.variants?.size?.[0];

    this.productService.getProductDetails(this.product.id).subscribe((data) => {
        this.product = data;
        this.resetImage()
      });
    }
  }
  

  /**
   * quick view clicked
   */
  quickView(event: MouseEvent) {
    event.stopPropagation();
    this.quickViewClicked.emit(this.product);
  }

  /**
   * go to product detail info
   * @param productId
   */
  goToDetail(productId: string) {
    this.router.navigate(['/product-detail', productId]).then(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' }); // scroll to top after navigation
    });
    this.detailViewClicked.emit(this.product);
  }

  /**
   * add item to cart
   * @param item
   */
  addToCart(event: MouseEvent, item: any) {
    event.stopPropagation();
    const payload = {
      components: '{}',
      pricelist_id: item?.priceList?.[0]?.id ?? '69eef3650d31',
      product_id: item.id,
      quantity: 1,
      saved_for_later: true,
      user_id: 'Cg0wLTM4NS0yODA4OS0wEgRtb2Nr',
      variants: {
        selectedColor: this.selectedColor,
        selectedSize: this.selectedSize,
        thumbnail_url: this.productImages?.[0].url || item?.thumbnail_url,
      },
    };
    this.cartService.addCartItem(payload).subscribe({
      next: (res) => {
        console.log('Item added to cart successfully:', res);
        this.sharedService.showToast('Item added to cart successfully', 'success');
      },
      error: (err) => {
        console.error('Error adding item to cart:', err);
        this.sharedService.showToast('Error adding item to cart', 'error');
      },
    });
  }

  /**
   * update variable on selection of color and sizes
   * @param event
   * @param value
   * @param attr
   */
  updateValue(event: MouseEvent, value: any, attr: 'selectedColor' | 'selectedSize') {
    event.stopPropagation();
    if (attr === 'selectedColor') {
      const images = this.product.media.filter((image: any) => {
        return image.variant_id === value.id;
      });
      if (images.length) {
        this.productImages = images;
      } else {
        this.resetImage();
      }
    }
    this[attr] = value;
  }
  /**
   * reset the product image 
   */
  resetImage() {
    this.productImages = this.product?.media.filter((image: any) => {
      return !image.variant_id;
    });
    this.productImages.push({ id: null, url: this.product.thumbnail_url });
  }

  handleMouseEvent(event: MouseEvent) {
    event.stopPropagation();
  }
}
