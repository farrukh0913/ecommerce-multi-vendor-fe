import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './features/home/home.component';
import { NewsEvents } from './features/news-events/news-events.component';
import { Faq } from './features/faq/faq.component';
import { ContactUs } from './features/contact-us/contact-us.component';
import { ShopNow } from './features/shop-now/shop-now.component';
import { ProductInfo } from './features/product-info/product-info.component';
import { Cart } from './features/cart/cart/cart.component';
import { ProductsByCategory } from './features/products-by-category/products-by-category.component';

const routes: Routes = [
  { path: '', component: Home },
  { path: 'shop-now', component: ShopNow },
  { path: 'products-by-category/:category', component: ProductsByCategory },
  { path: 'product-detail/:id', component: ProductInfo },
  { path: 'news-events', component: NewsEvents },
  { path: 'faq', component: Faq },
  { path: 'contact-us', component: ContactUs },
  { path: 'cart', component: Cart },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
