import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './features/home/home';
import { NewsEvents } from './features/news-events/news-events';
import { Faq } from './features/faq/faq';
import { ContactUs } from './features/contact-us/contact-us';
import { ShopNow } from './features/shop-now/shop-now';
import { ProductInfo } from './features/product-info/product-info';
import { Cart } from './features/cart/cart/cart';
import { ProductsByCategory } from './features/products-by-category/products-by-category';
import { DesignTool } from './features/design-tool/design-tool';
import { ModelSelectorComponent } from './features/deign-model-selector/deign-model-selector';

const routes: Routes = [
  { path: '', component: Home },
  { path: 'shop-now', component: ShopNow },
  { path: 'design-tool', component: DesignTool },
  { path: 'products-by-category/:categoryId/:categoryName', component: ProductsByCategory },
  // { path: 'product-detail/:id', component: ProductInfo },
  // { path: 'news-events', component: NewsEvents },
  // { path: 'faq', component: Faq },
  // { path: 'contact-us', component: ContactUs },
  // { path: 'cart', component: Cart },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
