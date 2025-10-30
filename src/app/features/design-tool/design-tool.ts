import { Component, OnDestroy, AfterViewInit, NgZone } from '@angular/core';
import * as ReactDOM from 'react-dom/client';
import * as React from 'react';
import { App as PolotnoApp } from '../../polotno/polotno-editor';
import { PolotnoService } from '../../shared/services/polotno.service';

@Component({
  selector: 'app-design-tool',
  standalone: false,
  templateUrl: './design-tool.html',
  styleUrls: ['./design-tool.scss'],
})
export class DesignTool implements AfterViewInit, OnDestroy {
  root?: ReactDOM.Root;
  hasChanges = false;
  isFrontImage = true;
  changedImages: any = {
    frontImage: null,
    backImage: null,
  };
  image: any = {
    front: 'https://m.media-amazon.com/images/I/710mqhd9mCL._AC_UY1100_.jpg',
    back: 'https://img.sonofatailor.com/images/customizer/product/extra-heavy-cotton/ss/Black.jpg',
  };
  constructor(private polotnoService: PolotnoService, private zone: NgZone) {}

  ngOnInit() {
    window.addEventListener('polotno:changed', (event: any) => {
      this.zone.run(() => {
        this.hasChanges = true;
        console.log('🌀 Design updated:', event.detail);
      });
    });
  }

  async ngAfterViewInit() {
    const container = document.getElementById('editor');
    if (container) {
      this.root = ReactDOM.createRoot(container);
      this.root.render(React.createElement(PolotnoApp, { service: this.polotnoService }));
    }
    await this.polotnoService.readyPromise;
    console.log('✅ Polotno workspace ready');
    this.polotnoService.addImageToCanvas(this.image.front);
  }

  /**
   * add fron image fro editing
   */
  async addFrontImage() {
    //  Save current changes first
    if (this.polotnoService.hasUnsavedChanges) await this.saveCurrentImage();
    // Explicitly reset store BEFORE adding new image
    this.polotnoService.resetStore();
    // Load previous design if exists
    const saved = this.changedImages.frontImage;
    if (saved?.design) {
      await this.polotnoService.loadDesign(saved.design);
    } else {
      // Otherwise add new base image
      this.polotnoService.addImageToCanvas(this.image.front);
    }

    this.isFrontImage = true;
  }

  /**
   * add back image for editing
   */
  async addBackImage() {
    if (this.polotnoService.hasUnsavedChanges) await this.saveCurrentImage();
    this.polotnoService.resetStore();
    const saved = this.changedImages.backImage;
    if (saved?.design) {
      await this.polotnoService.loadDesign(saved.design);
    } else {
      this.polotnoService.addImageToCanvas(this.image.back);
    }
    this.isFrontImage = false;
  }

  /**
   * save edited image
   */
  async saveCurrentImage() {
    const data = await this.polotnoService.getExportData();
    if (this.isFrontImage) {
      this.changedImages.frontImage = data;
    } else {
      this.changedImages.backImage = data;
    }
    this.hasChanges = false;
  }

  // ✅ Centralized logic for front/back image switching
  // private async handleImageChange(url: string, key: 'frontImage' | 'backImage') {
  //   if (this.polotno.hasUnsavedChanges) {
  //     await this.saveCurrentImage();
  //   }

  //   this.polotno.resetStore();

  //   const saved = this.changedImages[key];
  //   if (saved?.design) {
  //     console.log(`🎨 Loading saved ${key}`);
  //     await this.polotno.loadDesign(saved.design);
  //   } else {
  //     console.log(`🆕 Adding new ${key} image`);
  //     this.polotno.addImageToCanvas(url);
  //   }
  // }

  ngOnDestroy() {
    this.root?.unmount();
  }
}
