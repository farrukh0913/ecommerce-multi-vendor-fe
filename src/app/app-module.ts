import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { MainLayout } from './core/layout/main-layout/main-layout';
import { Footer } from './core/components/footer/footer';
import { Header } from './core/components/header/header';

@NgModule({
  declarations: [App, Header, MainLayout, Footer],
  imports: [BrowserModule, AppRoutingModule],
  providers: [provideBrowserGlobalErrorListeners()],
  bootstrap: [App],
})
export class AppModule {}
