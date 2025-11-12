import { Component } from '@angular/core';
import { ProductService } from '../../../../shared/services/product.service';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BlogArticlesService } from '../../../../shared/services/blog-articles.service';
import { CategoryService } from '../../../../shared/services/category.service';
import { OrganizationService } from '../../../../shared/services/organization.service';
import { environment } from '../../../../../environments/environment';
import { SharedService } from '../../../../shared/services/sahared.service';

@Component({
  selector: 'app-products-list',
  standalone: false,
  templateUrl: './products-list.html',
  styleUrl: './products-list.scss',
})
export class ProductsList {
  productList: any = [];
  r2BaseUrl: string = environment.r2BaseUrl + '/';
  selectedProduct: any = null;

  constructor(
    private productService: ProductService,
    private router: Router,
    private spinner: NgxUiLoaderService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.fetchProductList();
  }

  fetchProductList() {
    const productFilter = {
      order: 'created_at.desc',
    };
    this.spinner.start();
    this.productService.getAll(productFilter).subscribe({
      next: (data) => {
        const blogWhoWearWhatId = ['1e6a5917bbb3', '79bc0ce5cb48'];
        this.productList = data?.filter(
          (item: any) => !blogWhoWearWhatId.includes(item.category_id)
        );
        this.spinner.stop();
      },
      error: (err) => {
        console.log(err);
        this.spinner.stop();
      },
    });
  }

  /**
   * move to edit product
   * @param product
   */
  editProduct(product: any) {
    // Navigate to edit page
    this.router.navigate(['/cms/edit-product', product.id]);
  }

  /**
   * delete selected product
   * @param product
   */
  deleteProduct() {
    if (!this.selectedProduct) return;
    const productId = this.selectedProduct.id;
    this.spinner.start();
    this.selectedProduct = null;
    this.productService.delete(productId).subscribe({
      next: () => {
        this.spinner.stop();
        this.fetchProductList();
        this.sharedService.showToast('Product deleted successfully', 'success');
      },
      error: (err) => {
        this.spinner.stop();
        this.sharedService.showToast('Failed to delete product', 'error');
      },
      complete: () => {
        this.spinner.stop();
      },
    });
  }
}
