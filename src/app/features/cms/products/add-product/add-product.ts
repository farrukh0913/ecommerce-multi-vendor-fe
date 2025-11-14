import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BlogArticlesService } from '../../../../shared/services/blog-articles.service';
import { CategoryService } from '../../../../shared/services/category.service';
import { OrganizationService } from '../../../../shared/services/organization.service';
import { ProductService } from '../../../../shared/services/product.service';
import { Subject, takeUntil } from 'rxjs';
import { R2UploadService } from '../../../../shared/services/r2-upload.service';
import { CurrencySymbol } from '../../../../shared/enums/currency.enum';

@Component({
  selector: 'app-add-product',
  standalone: false,
  templateUrl: './add-product.html',
  styleUrl: './add-product.scss',
})
export class AddProduct {
  productForm: FormGroup;
  categories: any = [];
  templates: any = [];
  requiredAttributes: any[] = [];
  optionalAttributes: any[] = [];
  product: any = {};
  creatingCategory = false;
  creatingTemplate = false;
  categorySelected = false;
  templateSelected = false;
  productDetailsAdded = false;
  private destroy$ = new Subject<void>();
  tagsReadonly = false;
  currencyCodes = Object.keys(CurrencySymbol);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private spinner: NgxUiLoaderService,
    private categoryService: CategoryService,
    private productService: ProductService,
    private organizationService: OrganizationService,
    private blogArticlesService: BlogArticlesService,
    private r2UploadService: R2UploadService
  ) {
    //#region Form
    // init form
    this.productForm = this.fb.group({
      // Category
      category_id: [null, Validators.required],
      category_name: [''],
      category_description: [''],
      category_tags: this.fb.array([]),
      category_thumbnail_url: [''],

      // Template
      template_id: [null, Validators.required],
      template_name: [''],
      template_description: [''],
      template_attribute_schema: this.fb.array([]),
      template_optional_attribute_schema: this.fb.array([]),

      // Product
      product_name: ['', Validators.required],
      barcode: [''],
      description: [''],
      tags: this.fb.array([]),
      thumbnail_url: [''],
      weight: [''],
      is_variant: [false],
    });

    // get all categories
    this.categoryService.categories$.pipe(takeUntil(this.destroy$)).subscribe((categories) => {
      if (categories.length) {
        this.categories = categories;
      }
    });

    // get all product templates
    this.fecthProductTemplate();
  }

  //#region Image func

  /**
   * get base 64 string and store in form value
   * @param event
   * @param key
   * @returns
   */
  onFileSelected(event: Event, key: string, is_Product_Media = false, index: number = 0) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result as string;
      if (is_Product_Media) {
        this.productMedia.at(index).patchValue({
          url: reader.result,
        });
      } else {
        this.productForm.patchValue({ [key]: base64String });
      }
    };

    reader.readAsDataURL(file);
  }

  //#region Template

  /**
   * fetch all available product template
   */
  fecthProductTemplate() {
    this.spinner.start();
    this.productService.getProductTemplates().subscribe({
      next: (data) => {
        this.templates = data;
        this.spinner.stop();
      },
      error: (err) => {
        this.spinner.stop();
      },
    });
  }

  /**
   * on template selction
   * @param value
   */
  onTemplateSelect(value: any) {
    this.templateSelected = true;
    this.creatingTemplate = false;
    this.productForm.patchValue({ template_id: value?.value });
    const selectedTemplate = this.templates.find((data: any) => data.id === value.value);
    console.log('selectedTemplate: ', selectedTemplate);
    this.optionalAttributes = selectedTemplate.attribute_schema.optional_fields;
    // add property for required
    this.requiredAttributes = selectedTemplate.attribute_schema.required_fields;

    this.redoAttributesFormGroup();
  }

  /**
   * create new template
   */
  createNewTemplate() {
    this.creatingTemplate = true;
    this.templateSelected = false;
    this.productForm.get('template_id')?.reset();
  }

  /**
   * save new template
   * @returns
   */
  saveNewTemplate() {
    const name = this.productForm.value.template_name?.trim();
    if (!name) return;
    this.spinner.start();
    const payload = {
      category_id: this.productForm.value.category_id,
      name: this.productForm.value.template_name,
      description: this.productForm.value.template_description,
      status: 'active',
      attribute_schema: {
        optional_fields: this.productForm.value.template_optional_attribute_schema,
        required_fields: this.productForm.value.template_attribute_schema,
      },
    };
    this.productService.createProductTemplate(payload).subscribe({
      next: (data) => {
        this.fecthProductTemplate();
        this.creatingTemplate = false;
        this.templateSelected = false;
        this.spinner.stop();
      },
      error: (err) => {
        this.spinner.stop();
      },
    });
    // const newId = this.templates.length + 1;
    // this.templates.push({ id: newId, name });
    // this.productForm.patchValue({ template_id: newId });
  }

  get attributeSchema(): FormArray {
    return this.productForm.get('template_attribute_schema') as FormArray;
  }

  addAttribute(event: any) {
    const input = event.value?.trim();
    if (input) this.attributeSchema.push(this.fb.control(input));
    event.chipInput?.clear();
  }

  removeAttribute(index: number) {
    this.attributeSchema.removeAt(index);
  }

  get optionalAttributeSchema(): FormArray {
    return this.productForm.get('template_optional_attribute_schema') as FormArray;
  }

  addOptionalAttribute(event: any) {
    const input = event.value?.trim();
    if (input) this.optionalAttributeSchema.push(this.fb.control(input));
    event.chipInput?.clear();
  }

  removeOptionalAttribute(index: number) {
    this.optionalAttributeSchema.removeAt(index);
  }

  //#endregion Template

  //#region Category

  /**
   * on categroy select
   * @param value
   */
  onCategorySelect(value: any) {
    this.categorySelected = true;
    this.creatingCategory = false;
    this.productForm.patchValue({ category_id: value.value });
  }

  /**
   * create new categroy
   */
  async createNewCategory() {
    this.creatingCategory = true;
    this.categorySelected = false;
    this.productForm.get('category_id')?.reset();
  }

  /**
   * save new category
   * @returns
   */
  async saveNewCategory() {
    const name = this.productForm.value.category_name?.trim();
    const image = this.productForm.value.category_thumbnail_url?.trim();
    if (!name || !image) return;
    this.spinner.start();
    const fileName = Date.now() + '_' + this.productForm.value.category_name.trim();
    const thumbnail_url = await this.r2UploadService.uploadBase64Image(
      this.productForm.value.category_thumbnail_url,
      'categories',
      fileName
    );
    const payload = {
      name: this.productForm.value.category_name,
      thumbnail_url: thumbnail_url,
      description: this.productForm.value.category_description,
      sort_order: 0,
      status: 'active',
    };
    this.categoryService.create(payload).subscribe({
      next: (data) => {
        this.creatingCategory = false;
        this.categorySelected = false;
        this.spinner.stop();
      },
      error: (err) => {
        this.spinner.stop();
      },
    });
    // const newId = this.categories.length + 1;
    // this.categories.push({ id: newId, name });
    // this.productForm.patchValue({ category_id: newId });
  }

  //#endregion

  //#region Details

  /**
   * add new product details
   */
  async addProduct() {
    const formValue = this.productForm.value;
    const fileName = Date.now() + '_' + this.productForm.value.product_name.trim();
    const thumbnail_url = await this.r2UploadService.uploadBase64Image(
      formValue.thumbnail_url,
      'products',
      fileName
    );
    const payload = {
      name: formValue.product_name,
      barcode: formValue.barcode,
      description: formValue.description,
      tags: formValue.tags,
      thumbnail_url: thumbnail_url,
      weight: Number(formValue.weight),
      is_variant: formValue.is_variant,
      attributes: formValue.attributes,
      category_id: formValue.category_id,
      // manufacturer_id: 'Cg0wLTM4NS0yODA4OS0wEgRtb2Nr',
      sku: Date.now() + formValue.product_name,
      template_id: formValue.template_id,
    };
    this.spinner.start();
    this.productService.create(payload).subscribe({
      next: (data) => {
        this.makeFormReadonly();
        this.productDetailsAdded = true;
        this.product = data
        // Initialize the product price list
        this.productForm.addControl(
          'priceList',
          this.fb.group({
            currency_code: ['', Validators.required],
            discount_percentage: [0],
            discount_amount: [0],
            estimated_delivery_days_range: this.fb.group({
              Lower: [0, Validators.required],
              Upper: [0, Validators.required],
            }),
            price_amount: ['', Validators.required],
            product_condition: ['new'],
            shipping_cost: [0],
            stock_quantity: [0, Validators.required],
            stock_status: ['in_stock', Validators.required],
          })
        );
        // Initialize the productMedia FormArray
        this.productForm.addControl(
          'productMedia',
          this.fb.array([
            this.fb.group({
              alt_text: ['', Validators.required],
              height: [''],
              width: [''],
              url: ['', Validators.required],
              is_primary: [false],
              media_type: [''],
            }),
          ])
        );
        this.productForm.addControl('productVariants', this.fb.array([]));
        this.spinner.stop();
      },
      error: (err) => {
        this.spinner.stop();
      },
    });
    console.log('Product Details:', this.product);
  }
  get tags() {
    return this.productForm.get('tags') as FormArray;
  }
  /**
   * add tags
   * @param event
   */
  addTag(event: any) {
    const input = event.value?.trim();
    if (input) this.tags.push(this.fb.control(input));
    event.chipInput?.clear();
  }

  /**
   * attrbiute control for product attributes
   * @param key
   * @returns
   */
  getAttributeControl(key: string): FormControl {
    const control = this.productForm.get(['attributes', key]);
    if (!control) {
      return new FormControl('');
    }
    if (!(control instanceof FormControl)) {
      throw new Error(`Attribute control "${key}" is not a FormControl`);
    }
    return control;
  }

  /**
   * create form control for product attrbiutes
   */
  redoAttributesFormGroup() {
    const attributeControls: { [key: string]: FormControl } = {};
    this.optionalAttributes?.forEach((attrKey) => {
      attributeControls[attrKey] = this.fb.control('');
    });
    this.requiredAttributes?.forEach((attrKey) => {
      attributeControls[attrKey] = this.fb.control('', Validators.required);
    });
    this.productForm.setControl('attributes', this.fb.group(attributeControls));
  }

  removeDetailsTags(index: number) {
    if (this.tags && index >= 0 && index < this.tags.length) {
      this.tags.removeAt(index);
    }
  }

  //#endregion

  //#region Price

  /**
   * add product price list
   */
  addProductPrice() {
    const formValue = this.productForm.value.priceList;
    console.log('formValue: ', formValue);
    // return
    this.spinner.start();
    const payload = {
      currency_code: formValue.currency_code,
      product_condition: formValue.product_condition,
      price_amount: formValue.price_amount,
      discount_amount: formValue.discount_amount,
      discount_percentage: formValue.discount_percentage,
      shipping_cost: formValue.shipping_cost,
      stock_quantity: formValue.stock_quantity,
      estimated_delivery_days_range: `[${formValue.estimated_delivery_days_range.Lower},${formValue.estimated_delivery_days_range.Upper}]`,
      stock_status: formValue.stock_status,
      seller_id: '9b3a67b75c50',  // maybe with the current user.id for seller
      product_id: 'c8439c8d53d7', // need to dynamic with this.product.id
    };
    this.productService.createPriceList(payload).subscribe({
      next: (data) => {
        this.makeFormReadonly();
        this.productDetailsAdded = true;
        this.spinner.stop();
      },
      error: (err) => {
        this.spinner.stop();
      },
    });
  }

  //#endregion

  //#region Media

  /**
   * add product media
   */
  async addProductMedia() {
    if (!this.productMedia.length) return;
    const product_id = 'c8439c8d53d7';  // need to dynamic with this.product.id

    if (this.productMedia.invalid) {
      this.productMedia.markAllAsTouched();
      return;
    }
    this.spinner.start();
    try {
      for (let index = 0; index < this.productMedia.length; index++) {
        const mediaGroup = this.productMedia.at(index);
        const mediaValue = mediaGroup.value;
        let uploadedUrl = mediaValue.url;

        // Upload base64 image if needed
        if (mediaValue.url && mediaValue.url.startsWith('data:image')) {
          const fileName = Date.now() + `_product_media_${mediaValue.alt_text}`;
          uploadedUrl = await this.r2UploadService.uploadBase64Image(
            mediaValue.url,
            `products_media/${product_id}`,
            fileName
          );
        }
        // Create payload for single media
        const payload = {
          alt_text: mediaValue.alt_text,
          height: mediaValue.height ? Number(mediaValue.height) : null,
          width: mediaValue.width ? Number(mediaValue.width) : null,
          url: uploadedUrl,
          is_primary: mediaValue.is_primary,
          media_type: mediaValue.media_type || null,
          product_id: product_id,
        };

        // Call API for each media individually
        await this.productService.createProductMedia(payload).toPromise();
      }
      this.makeFormReadonly();
      this.productDetailsAdded = true;
      this.spinner.stop();
    } catch (error) {
      console.error(error);
      this.spinner.stop();
    }
  }

  get productMedia(): FormArray {
    return this.productForm.get('productMedia') as FormArray;
  }

  /**
   * add prdict media form controls
   */
  addMedia() {
    const group = this.fb.group({
      alt_text: ['', Validators.required],
      height: [''],
      width: [''],
      url: ['', Validators.required],
      is_primary: [false],
      media_type: [''],
    });
    this.productMedia.push(group);
  }

  /**
   * remove media control
   */
  removeMedia(index: number) {
    this.productMedia.removeAt(index);
  }

  //#endregion

  //#region Variant

  /**
   * add product variant
   */
  addProductVariant() {
    this.spinner.start();
    this.productService.createProductVariant(this.product).subscribe({
      next: (data) => {
        this.makeFormReadonly();
        this.productDetailsAdded = true;
        this.spinner.stop();
      },
      error: (err) => {
        this.spinner.stop();
      },
    });
  }
  /* ========== PRODUCT VARIANT ========== */
  get productVariants(): FormArray {
    return this.productForm.get('productVariants') as FormArray;
  }

  /**
   * Adds a new variant to the productVariants FormArray.
   * Each variant includes a name (required), price adjustment (default 0), and is_default flag.
   */
  addVariant() {
    const group = this.fb.group({
      name: ['', Validators.required],
      price_adjustment: [0],
      is_default: [false],
    });
    this.productVariants.push(group);
  }

  /**
   * Removes a variant at the specified index from the productVariants FormArray.
   * @param index - The index of the variant to remove.
   */
  removeVariant(index: number) {
    this.productVariants.removeAt(index);
  }

  //#endregion

  //#region Others

  /* ========== SUBMIT ========== */
  onSubmit() {
    if (this.productForm.valid) {
      console.log('✅ Final Product Data:', this.productForm.value);
    } else {
      console.warn('❌ Form invalid');
    }
  }

  /**
   * mark form readonly
   */
  makeFormReadonly() {
    // Category controls
    this.productForm.get('category_id')?.disable();
    this.productForm.get('category_name')?.disable();
    this.productForm.get('category_description')?.disable();
    this.productForm.get('category_thumbnail_url')?.disable();

    // Template controls
    this.productForm.get('template_id')?.disable();
    this.productForm.get('template_name')?.disable();
    this.productForm.get('template_description')?.disable();
    this.productForm.get('template_thumbnail_url')?.disable();

    // Product controls
    this.productForm.get('product_name')?.disable();
    this.productForm.get('description')?.disable();
    this.productForm.get('thumbnail_url')?.disable();
    this.productForm.get('weight')?.disable();
    this.productForm.get('is_variant')?.disable();
    const attributesGroup = this.productForm.get('attributes') as FormGroup;
    if (attributesGroup) {
      Object.values(attributesGroup.controls)?.forEach((ctrl) => ctrl.disable());
    }

    // Tags: disable all FormArray controls
    const tagsArray = this.productForm.get('tags') as FormArray;
    tagsArray.controls?.forEach((ctrl) => ctrl.disable());

    // Set a flag to prevent adding/removing chips in template
    this.tagsReadonly = true;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
