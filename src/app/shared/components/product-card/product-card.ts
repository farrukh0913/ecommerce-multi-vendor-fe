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
      const defaultColor = this.product?.attributes?.colors?.find(
        (data: any) => data.is_default === true
      );
      this.selectedColor = defaultColor ? defaultColor : this.product?.attributes?.colors?.[0];
      // set default size
      const defaultSize = this.product?.attributes?.sizes?.find(
        (data: any) => data.is_default === true
      );
      this.selectedSize = defaultSize ? defaultSize : this.product?.attributes?.sizes?.[0];

      this.productService.getProductPriceInfo(this.product.id).subscribe((data) => {
        this.product.priceList = data;
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
    console.log('item: ', item);
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
        thumbnail_url: this.selectedColor?.thumbnail_url || item?.thumbnail_url,
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
    this[attr] = value;
  }

  handleMouseEvent(event: MouseEvent) {
    event.stopPropagation();
  }
}
