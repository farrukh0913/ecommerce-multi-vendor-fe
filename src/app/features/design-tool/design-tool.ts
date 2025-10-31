import { Component, OnDestroy, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three-stdlib';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

@Component({
  selector: 'app-design-tool',
  standalone: false,
  templateUrl: './design-tool.html',
  styleUrls: ['./design-tool.scss'],
})
export class DesignTool implements AfterViewInit, OnDestroy {
  @ViewChild('canvasContainer') canvasContainer!: ElementRef;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private model!: THREE.Object3D;
  private animationFrameId = 0;
  private controls!: OrbitControls;

  ngAfterViewInit(): void {
    this.initScene();
    this.loadModel();
    this.animate();
  }

  private initScene() {
    const container = this.canvasContainer.nativeElement;

    // Scene setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x222222);

    // Camera setup
    const width = container.clientWidth;
    const height = container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(0, 1, 3);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(width, height);
    container.appendChild(this.renderer.domElement);

    // Lighting
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(5, 5, 5);
    this.scene.add(dirLight);
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.6));

    // Add OrbitControls for user rotation
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.enableZoom = true; // allow zoom
    this.controls.enablePan = false; // optional
    this.controls.target.set(0, 1, 0);
  }

  private loadModel() {
    const loader = new GLTFLoader();
    loader.load(
      'assets/uploads_files_3704025_High+Neck+T-shirt (1).glb',
      (gltf) => {
        this.model = gltf.scene;
        this.scene.add(this.model);

        // Optional: Center model
        const box = new THREE.Box3().setFromObject(this.model);
        const center = box.getCenter(new THREE.Vector3());
        this.model.position.sub(center);
      },
      undefined,
      (error) => {
        console.error('Error loading model:', error);
      }
    );
  }

  changeColor(hexColor: string) {
    if (!this.model) return;
    this.model.traverse((child: any) => {
      if (child.isMesh && child.material) {
        child.material.color.set(hexColor);
      }
    });
  }

  addText(text: string) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = 512;
    canvas.height = 512;
    ctx.fillStyle = 'white';
    ctx.font = 'Bold 80px Arial';
    ctx.fillText(text, 50, 250);

    const texture = new THREE.CanvasTexture(canvas);
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.MeshBasicMaterial({ map: texture, transparent: true })
    );
    plane.position.set(0, 1, 0);
    this.scene.add(plane);
  }

  addImage(imageUrl: string) {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(imageUrl, (texture) => {
      const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(1, 1),
        new THREE.MeshBasicMaterial({ map: texture, transparent: true })
      );
      plane.position.set(0, 1, 0);
      this.scene.add(plane);
    });
  }

  private animate = () => {
    this.animationFrameId = requestAnimationFrame(this.animate);
    this.controls.update(); // smooth user control
    this.renderer.render(this.scene, this.camera);
  };

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationFrameId);
    this.renderer.dispose();
  }
}
