import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-model-selector',
  standalone: false,
  templateUrl: './deign-model-selector.html',
  styleUrl: './deign-model-selector.scss',
})
export class ModelSelectorComponent {
  modelPaths = [
    'e96b1de9-b290-4673-82c8-f98c3b0de781_sleeveless_shirt.gltf',
    'b3708f64-2642-447d-8c15-f0415630fd9a_t_shirt_1.glb',
    '582f947c-ee6b-43fc-9fbe-bdc3994bf802_hoodie.glb',
    'b3d93852-4084-4cf1-a467-9ee993d08c44_crop_top.glb',
    // '72fe7d94-d897-4bec-be55-d0731316c626_t_shirt_2.glb',
    '0abf9d0c-a8d4-486f-9177-e52c48bb0599_top.glb',
    // '7fa4da3f-7d5d-460f-b71a-467729cf427c_t_shirt.glb',
  ];
  r2BaseUrl: string = environment.r2BaseUrl + '/models/';
  breadcrumb = [
    {
      name: 'Home',
      path: '/',
    },
    {
      name: 'Design Tool',
      path: null,
    },
  ];
  productId: string | null = null;

  constructor(private router: Router, private route: ActivatedRoute,) {}

 ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
     this.productId = params.get('productId');

      console.log('🧩 Received productId from route:', this.productId);
    });
  }

  getModelName(path: string): string {
    if (!path) return '';

    const fileName = path.split('/').pop() || '';
    return fileName
      .replace(/\.gltf|\.glb$/i, '')
      .replace(/^[^_]+_/, '')
      .replace(/_/g, ' ')
      .toUpperCase();
  }

  goToDesign(modelPath: string): void {
    console.log('this.productId,: ', this.productId,);
    this.router.navigate(['/design-tool'], {
      queryParams: { productId: this.productId, model: modelPath  },
    });
  }
}
