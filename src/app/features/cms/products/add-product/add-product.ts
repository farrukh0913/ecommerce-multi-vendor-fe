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

  /**
   * get base 64 string and store in form value
   * @param event
   * @param key
   * @returns
   */
  onFileSelected(event: Event, key: string) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const base64String = reader.result as string;
      this.productForm.patchValue({ [key]: base64String });
    };

    reader.readAsDataURL(file);
  }

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

  /* ========== TAGS ========== */
  get tags() {
    return this.productForm.get('tags') as FormArray;
  }

  addTag(event: any) {
    const input = event.value?.trim();
    if (input) this.tags.push(this.fb.control(input));
    event.chipInput?.clear();
  }

  removeTag(index: number) {
    this.tags.removeAt(index);
  }

  /* ========== CATEGORY ========== */
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

  /* ========== TEMPLATE ========== */
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

  redoAttributesFormGroup() {
    const attributeControls: { [key: string]: FormControl } = {};
    this.optionalAttributes.forEach((attrKey) => {
      attributeControls[attrKey] = this.fb.control('');
    });
    this.requiredAttributes.forEach((attrKey) => {
      attributeControls[attrKey] = this.fb.control('', Validators.required);
    });
    this.productForm.setControl('attributes', this.fb.group(attributeControls));
  }
  createNewTemplate() {
    this.creatingTemplate = true;
    this.templateSelected = false;
    this.productForm.get('template_id')?.reset();
  }

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
      Object.values(attributesGroup.controls).forEach((ctrl) => ctrl.disable());
    }

    // Tags: disable all FormArray controls
    const tagsArray = this.productForm.get('tags') as FormArray;
    tagsArray.controls.forEach((ctrl) => ctrl.disable());

    // Set a flag to prevent adding/removing chips in template
    this.tagsReadonly = true;
  }

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
        this.productForm.addControl(
          'priceList',
          this.fb.group({
            currency_code: ['', Validators.required],
            discount_percentage: [0],
            estimated_delivery_days_range: [0],
            price_amount: ['', Validators.required],
            product_condition: ['new'],
            shipping_cost: [0],
            stock_quantity: [0],
          })
        );
        this.productForm.addControl('productMedia', this.fb.array([]));
        this.productForm.addControl('productVariants', this.fb.array([]));
        this.spinner.stop();
      },
      error: (err) => {
        this.spinner.stop();
      },
    });
    console.log('Product Details:', this.product);
  }

  /**
   * add product price list
   */
  addProductPrice() {
    this.spinner.start();
    this.productService.createPriceList(this.product).subscribe({
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

  /**
   * add product media
   */
  addProductMedia() {
    this.spinner.start();
    this.productService.createProductMedia(this.product).subscribe({
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

  /* ========== PRODUCT MEDIA ========== */
  get productMedia(): FormArray {
    return this.productForm.get('productMedia') as FormArray;
  }

  addMedia() {
    const group = this.fb.group({
      alt_text: [''],
      height: [''],
      width: [''],
      url: ['', Validators.required],
      is_primary: [false],
    });
    this.productMedia.push(group);
  }

  removeMedia(index: number) {
    this.productMedia.removeAt(index);
  }

  /* ========== PRODUCT VARIANT ========== */
  get productVariants(): FormArray {
    return this.productForm.get('productVariants') as FormArray;
  }

  addVariant() {
    const group = this.fb.group({
      name: ['', Validators.required],
      price_adjustment: [0],
      is_default: [false],
    });
    this.productVariants.push(group);
  }

  removeVariant(index: number) {
    this.productVariants.removeAt(index);
  }

  /* ========== SUBMIT ========== */
  onSubmit() {
    if (this.productForm.valid) {
      console.log('✅ Final Product Data:', this.productForm.value);
    } else {
      console.warn('❌ Form invalid');
    }
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
