import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-model-selector',
  standalone:false,
  templateUrl:'./deign-model-selector.html',
  styleUrl:'./deign-model-selector.scss' 
})
export class ModelSelectorComponent {
  @Output() modelSelected = new EventEmitter<string>();
   modelPathsPNG = [
    // 'assets/model_thumbs/Drop_Shoulder_Sweatshirt_OBJ.png',
    'assets/model_thumbs/Long_Sleeve_Shirt_OBJ.png',
    'assets/model_thumbs/Raglan_Sleeve_Hoodie_OBJ.png',
    'assets/model_thumbs/Tank_Top_OBJ.png',
    'assets/model_thumbs/V_Neck_T_Shirt_OBJ.png',
    'assets/model_thumbs/Polo_Shirt_OBJ.png'
   ];
  modelPaths = [
    // 'assets/Drop_Shoulder_Sweatshirt/Drop_Shoulder_Sweatshirt_OBJ.gltf',
    'assets/Long_Sleeve_Shirt_OBJ/Long_Sleeve_Shirt_OBJ.gltf',
    'assets/Raglan_Sleeve_Hoodie_OBJ/Raglan_Sleeve_Hoodie_OBJ.gltf',
    'assets/Tank_Top_OBJ/Tank_Top_OBJ.gltf',
    'assets/V_Neck_T_Shirt_OBJ/V_Neck_T_Shirt_OBJ.gltf',
    'assets/Polo_Shirt_OBJ/Polo_Shirt_OBJ.gltf'
  ];

  selectedModelPath: string | null = null;
  selectedModelIndex: number = 0;
  showDesign = false;

  selectModel(path: string): void {
    this.selectedModelPath = path;
    this.selectedModelIndex = this.modelPathsPNG.indexOf(path);
    console.log('this.selectedModelIndex: ', this.selectedModelIndex);
  }

  getModelName(path: string): string {
    return path.split('/').pop()?.replace(/_/g, ' ').replace(/\.gltf$/, '') || '';
  }

  goToDesign(): void {
    if (this.selectedModelPath) {
      this.showDesign = true;
    }
  }
}
