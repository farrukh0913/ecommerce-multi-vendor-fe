import {
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgxUiLoaderConfig, NgxUiLoaderModule, PB_DIRECTION, SPINNER } from 'ngx-ui-loader';

import { App } from './app';
import { ProductCard } from './shared/components/product-card/product-card.component';
import { Home } from './features/home/home.component';
import { Faq } from './features/faq/faq.component';
import { ContactUs } from './features/contact-us/contact-us.component';
import { NewsEvents } from './features/news-events/news-events.component';
import { ShopNow } from './features/shop-now/shop-now.component';
import { BaseModal } from './shared/components/base-modal/base-modal.component';
import { ProductDetail } from './shared/components/product-detail/product-detail.component';
import { ProductInfo } from './features/product-info/product-info.component';
import { ShoppingCart } from './features/cart/shopping-cart/shopping-cart.component';
import { Cart } from './features/cart/cart/cart.component';
import { Checkout } from './features/cart/checkout/checkout.component';
import { OrderComplete } from './features/cart/order-complete/order-complete.component';
import { ContentHeader } from './shared/components/content-header/content-header.component';
import { BaseSideMenu } from './shared/components/base-side-menu/base-side-menu.component';
import { SearchProduct } from './shared/components/search-product/search-product.component';
import { Header } from './core/components/header/header.component';
import { MainLayout } from './core/layout/main-layout/main-layout.component';
import { Footer } from './core/components/footer/footer.component';
import { AppRoutingModule } from './app-routing.module';
import { ProductsByCategory } from './features/products-by-category/products-by-category.component';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  pbColor: '#ec8951',
  hasProgressBar: false,
  fgsColor: '#ec8951',
  fgsType: SPINNER.cubeGrid,
  fgsSize: 70,
  pbDirection: PB_DIRECTION.leftToRight,
  pbThickness: 5,
  text: '',
};

@NgModule({
  declarations: [
    App,
    Header,
    MainLayout,
    Footer,
    ProductCard,
    Home,
    NewsEvents,
    Faq,
    ContactUs,
    ShopNow,
    BaseModal,
    ProductDetail,
    ProductsByCategory,
    ProductInfo,
    Cart,
    ShoppingCart,
    Checkout,
    OrderComplete,
    ContentHeader,
    BaseSideMenu,
    SearchProduct,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
  ],
  providers: [provideBrowserGlobalErrorListeners(), provideHttpClient(withInterceptorsFromDi())],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [App],
})
export class AppModule {}
