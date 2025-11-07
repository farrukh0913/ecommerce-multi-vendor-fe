import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { getCurrencySymbol } from '../../utils/currency.utils';
import { SharedService } from '../../services/sahared.service';
import { CartService } from '../../services/cart.service';

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

  constructor(private router: Router, private sharedService: SharedService,private cartService: CartService) {}

  /**
   * Detect input changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product'] && changes['product'].currentValue) {
      const newProduct = changes['product'].currentValue;
      console.log('Product changed:', newProduct);
      // set default color
      const defaultColor = this.product?.attributes?.colors?.find(
        (data: any) => data.is_default === true
      );
      this.selectedColor = defaultColor ? defaultColor : this.product?.attributes?.colors?.[0];
      console.log('this.selectedColor: ', this.selectedColor);
      // set default size
      const defaultSize = this.product?.attributes?.sizes?.find(
        (data: any) => data.is_default === true
      );
      this.selectedSize = defaultSize ? defaultSize : this.product?.attributes?.sizes?.[0];
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
  addToCart(item: any) {
    const payload={
      components:"{}",
        pricelist_id: null,
        product_id: item.id,
        quantity: 1,
        saved_for_later: true,
        user_id: "Cg0wLTM4NS0yODA4OS0wEgRtb2Nr",
        variants: {
          selectedColor: this.selectedColor,
          selectedSize: this.selectedSize,
          thumbnail_url: item.attributes.thumbnail_url,
          
        },
    }
    this.cartService.addCartItem(payload).subscribe({
      next: (res) => {
        console.log('Item added to cart successfully:', res);
        this.sharedService.showToast('Item added to cart successfully', 'success');
       this.getCartItems();
      },
      error: (err) => {
        console.error('Error adding item to cart:', err);
        this.sharedService.showToast('Error adding item to cart', 'error');
      }
    });
  }
  getCartItems(){
     this.cartService.getCartItems({ user_id: 'Cg0wLTM4NS0yODA4OS0wEgRtb2Nr' }).subscribe({
          next: (res) => {
            console.log('Cart items fetched successfully:', res);
          },
          error: (err) => {
            console.error('Error fetching cart items:', err);
          }
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
