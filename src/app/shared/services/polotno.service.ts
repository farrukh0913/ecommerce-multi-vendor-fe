import { Injectable, NgZone } from '@angular/core';
import { makeAutoObservable, autorun, toJS } from 'mobx';
import { createStore } from 'polotno/model/store';

@Injectable({ providedIn: 'root' })
export class PolotnoService {
  store: any;
  workspaceReady = false;
  readyPromise: Promise<void>;
  private _resolveReady!: () => void;
  hasUnsavedChanges = false;

  imageDataUrl: string | null = null;
  designJSON: any = null;

  constructor(private zone: NgZone) {
    this.readyPromise = new Promise((resolve) => (this._resolveReady = resolve));
    this.initializeStore();
    this.setupAutoSync();
  }

  markWorkspaceReady() {
    if (!this.workspaceReady) {
      this.workspaceReady = true;
      this._resolveReady();
    }
  }

  initializeStore() {
    this.store = createStore({
      key: 'nFA5H9elEytDyPyvKL7T',
      showCredit: false,
    });
    this.store.addPage();
  }

  setupAutoSync() {
    makeAutoObservable(this);

    autorun(async () => {
      if (!this.store?.activePage) return;
      try {
        const json = toJS(this.store.toJSON());
        const preview = await this.store.toDataURL();

        this.designJSON = json;
        this.imageDataUrl = preview;
        this.hasUnsavedChanges = true;

        window.dispatchEvent(new CustomEvent('polotno:changed', { detail: { json, preview } }));
      } catch {
        // ignore transient render errors
      }
    });
  }

  // ✅ Explicit reset action (used from component)
  resetStore() {
    if (!this.store) return;
    this.store.clear();
    this.store.addPage();
    this.hasUnsavedChanges = false;
  }

  // ✅ Add full-size image
  addImageToCanvas(imageUrl: string) {
    const page = this.store?.activePage;
    if (!page) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;

    img.onload = () => {
      const width = page.width || 1000;
      const height = page.height || 800;

      // Remove previous base image if exists
      const existing = page.children.find((el: any) => el.name === 'base-image');
      if (existing && existing.remove) existing.remove();

      const pageWidth = typeof page.width === 'number' ? page.width : 1000;
      const pageHeight = typeof page.height === 'number' ? page.height : 1080;
      page.addElement({
        type: 'image',
        src: imageUrl,
        name: 'base-image',
        width: pageWidth, // number
        height: pageHeight, // number
        x: 40,
        y: 0,
        locked: true, 
        selectable: false, 
        draggable: false,
        resizable: false,
        isBaseImage: true,
      } as any);
      this.store.history.clear()
      this.hasUnsavedChanges = true;
    };
  }

  // ✅ Load design without resetting automatically
  async loadDesign(json: any) {
    if (!json) return;
    await this.store.loadJSON(json);
    this.hasUnsavedChanges = false;
  }

  async getExportData() {
    return {
      design: toJS(this.store.toJSON()),
      preview: await this.store.toDataURL(),
    };
  }
}
