import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsList } from './products/products-list/products-list';
import { AddProduct } from './products/add-product/add-product';

const routes: Routes = [
  { path: 'all-products', component: ProductsList },
  { path: 'new-products', component: AddProduct },
  { path: '**', redirectTo: 'all-products' },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CmsRoutingModule {}
