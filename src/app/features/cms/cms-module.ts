import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CmsRoutingModule } from './cms-routing-module';
import { ProductsList } from './products/products-list/products-list';
import { AddProduct } from './products/add-product/add-product';
import { MaterialModule } from '../../material.module';
import { SharedModule } from '../../shared/shared-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ProductsList, AddProduct],
  imports: [
    CommonModule,
    CmsRoutingModule,
    MaterialModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CmsModule {}
