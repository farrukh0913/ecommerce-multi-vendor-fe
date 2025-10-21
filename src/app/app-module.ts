import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { App } from './app';
import { MainLayout } from './core/layout/main-layout/main-layout';
import { Footer } from './core/components/footer/footer';
import { Header } from './core/components/header/header';
import { ProductCard } from './shared/components/product-card/product-card';
import { Home } from './features/home/home';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [App, Header, MainLayout, Footer, ProductCard, Home],
  imports: [BrowserModule, AppRoutingModule],
  providers: [provideBrowserGlobalErrorListeners()],
  bootstrap: [App],
})
export class AppModule {}
