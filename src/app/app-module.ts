import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { App } from './app';
import { MainLayout } from './core/layout/main-layout/main-layout';
import { Footer } from './core/components/footer/footer';
import { Header } from './core/components/header/header';
import { ProductCard } from './shared/components/product-card/product-card';
import { Home } from './features/home/home';
import { AppRoutingModule } from './app-routing.module';
import { Faq } from './features/faq/faq';
import { ContactUs } from './features/contact-us/contact-us';
import { NewsEvents } from './features/news-events/news-events';
import { ShopNow } from './features/shop-now/shop-now';
import { BaseModal } from './shared/components/base-modal/base-modal';
import { ProductDetail } from './shared/components/product-detail/product-detail';
import { ProductsByCategory } from './features/products-by-category/products-by-category';
import { ProductInfo } from './features/product-info/product-info';
import { ShoppingCart } from './features/cart/shopping-cart/shopping-cart';
import { Cart } from './features/cart/cart/cart';
import { Checkout } from './features/cart/checkout/checkout';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OrderComplete } from './features/cart/order-complete/order-complete';

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
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [provideBrowserGlobalErrorListeners()],
  bootstrap: [App],
})
export class AppModule {}
