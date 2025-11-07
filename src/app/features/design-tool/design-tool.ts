import { Component, OnDestroy, AfterViewInit, ElementRef, ViewChild, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as THREE from 'three';
import { GLTFLoader, DecalGeometry } from 'three-stdlib';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { environment } from '../../../environments/environment';
import { SharedService } from '../../shared/services/sahared.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CartService } from '../../shared/services/cart.service';
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
  private model: THREE.Object3D | null = null;
  private controls!: OrbitControls;
  private transform!: TransformControls;
  private animationFrameId = 0;
  private decalMaterial!: THREE.MeshPhongMaterial;
  private decalMesh!: THREE.Mesh;
  decalScale = 1;
  private animationId = 0;
  private modelCenter = new THREE.Vector3();
  private isDraggingDecal = false;
  private mouse = new THREE.Vector2();
  private raycaster = new THREE.Raycaster();
  private modelMeshes: THREE.Mesh[] = [];
  private decalImageUrl =
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPkNnMdPMYL0wJTAweRejy-TK0WslkwCikVg&s';
  userText: string = '';
  decalMode: 'image' | 'text' = 'image';
  decals: THREE.Mesh[] = [];
  selectedDecal: THREE.Mesh | null = null;
  editDecal: THREE.Mesh | null = null;
  saveDesignData: any = null;
  textConfig: any = {
    fontFamily: 'Poppins',
    fontSize: 20,
    fontColor: '#000000',
    bold: false,
    italic: false,
    underline: false,
  };
  selectedModelPath = '';
  isShowLoad: boolean = false;
  r2BaseUrl: string = environment.r2BaseUrl + '/models/';
  modelPaths = [
    'assets/models/uploads_files_3704025_High+Neck+T-shirt (1).gltf',
    'assets/models/uploads_files_3704025_High+Neck+T-shirt (2).glb',
    'assets/models/oversized_hoodie.glb',
    'assets/models/crop_top.glb',
    'assets/models/t_shirt.glb',
    'assets/models/uploads_files_5600042_Top.glb',
    'https://pub-9b4cc8555df8437bacf8d3a7a25c1ab2.r2.dev/models/7fa4da3f-7d5d-460f-b71a-467729cf427c_t_shirt.glb',
  ];
  modelPath: string = '';
  isEdit: boolean = false;
  productId: string  = "";
  constructor(
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private spinner: NgxUiLoaderService,
    private cartService: CartService
  ) {
    this.route.queryParams.subscribe((params) => {
      const modelPath = params['model'];
      const isEdit = params['isEdit'];
      const productId = params['productId'];
      console.log('productId: ', productId);
      if (this.modelPath && this.modelPath != modelPath) {
        this.selectModel(modelPath);
      }
      if (modelPath) {
        this.modelPath = modelPath;
        this.selectedModelPath = this.r2BaseUrl + modelPath;
      }
      if (isEdit) {
        this.isEdit = isEdit;
      }
      if(productId){
        this.productId = productId || "93ac57689e3e";
        console.log('this.productId: ', this.productId);
      }
    });
  }
  ngAfterViewInit(): void {
    /**
     * init modal display
     */
    this.initState();
  }

  /**
   * initialize modal display
   */
  initState() {
    this.initScene();
    this.loadModel(this.selectedModelPath);
    this.isSavedDesign();
    this.animate();
    window.addEventListener('resize', () => this.onWindowResize());
    this.renderer.domElement.addEventListener('mousedown', (e) => this.onMouseDown(e));
    this.renderer.domElement.addEventListener('mousemove', (e) => this.onMouseMove(e));
    this.renderer.domElement.addEventListener('mouseup', (e) => this.onMouseUp(e));
  }

  /**
   * check if saved design is available against this model in local storage
   */
  isSavedDesign() {
    const storedKey = this.extractModelKey(this.selectedModelPath);
    const savedModalData = JSON.parse(localStorage.getItem(storedKey) || 'null');
    if (savedModalData) {
      setTimeout(() => {
        this.isShowLoad = true;
      }, 0);
    }
  }

  /**
   * select modal to display
   * @param path
   */
  selectModel(path: any): void {
    this.selectedModelPath = this.r2BaseUrl + path;
    this.modelPath = path;
    this.destroyScene();
    this.decals = [];
    this.initState();
  }

  /**
   * creating a scene for modal
   */
  private initScene() {
    const container = this.canvasContainer.nativeElement;
    // --- Scene setup ---
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff);
    // --- Camera setup ---
    const width = container.clientWidth;
    const height = container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(0, 1.3, 2.8);
    // --- Renderer setup ---
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);
    // add lights to scene
    this.addLights();
    // --- Orbit Controls (keep original behavior) ---
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.enableZoom = true;
    this.controls.enablePan = false;
    this.controls.minPolarAngle = Math.PI / 2;
    this.controls.maxPolarAngle = Math.PI / 2;
    this.controls.target.set(0, 0, 0);
    this.controls.update();
  }

  /**
   * add lights to modal
   */
  private addLights() {
    const lights = [
      new THREE.DirectionalLight(0xffffff, 2),
      new THREE.DirectionalLight(0xffffff, 2),
      new THREE.DirectionalLight(0xffffff, 2),
      new THREE.DirectionalLight(0xffffff, 2),
      new THREE.DirectionalLight(0xffffff, 2),
      new THREE.DirectionalLight(0xffffff, 2),
    ];
    const positions: [number, number, number][] = [
      [2, 3, 4],
      [-2, 3, -4],
      [0, 5, 0],
      [0, -5, 0],
      [-5, 2, 0],
      [5, 2, 0],
    ];
    lights.forEach((l, i) => {
      l.position.set(...positions[i]);
      this.scene.add(l);
    });
  }

  /**
   * load selected modal to display using its path
   * @param path
   */
  private async loadModel(path: string) {
    const loader = new GLTFLoader();
    this.spinner.start();

    loader.load(
      path,
      async (gltf) => {
        try {
          this.model = gltf.scene;
          this.scene.add(this.model);
          this.modelMeshes = [];

          // Collect all meshes & disable shadows
          this.model.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              this.modelMeshes.push(child);
              child.castShadow = false;
              child.receiveShadow = false;
            }
          });

          // Compute bounding box and center model
          const box = new THREE.Box3().setFromObject(this.model);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          this.modelCenter.copy(center);
          this.model.position.sub(center);

          // Scale model
          const maxDim = Math.max(size.x, size.y, size.z);
          const scaleFactor = 3 / maxDim;
          this.model.scale.setScalar(scaleFactor);

          // Adjust camera to fit
          await new Promise((resolve) => {
            requestAnimationFrame(() => {
              this.fitCameraToObject();
              resolve(true);
            });
          });

          if (this.renderer.compileAsync) {
            await this.renderer.compileAsync(this.scene, this.camera);
          }

          this.loadDecalTexture(this.decalImageUrl);

          if (this.isEdit) {
            await new Promise((resolve) => setTimeout(resolve, 500));
            this.loadDesign();
          }

          this.spinner.stop();
        } catch (err) {
          console.error('Error during model setup:', err);
          this.spinner.stop();
        }
      },
      (xhr) => {
        const progress = (xhr.loaded / xhr.total) * 100;
        // console.log(`Model loading: ${progress.toFixed(2)}%`);
      },
      (error) => {
        console.error('Error loading model:', error);
        this.spinner.stop();
      }
    );
  }

  /**
   * local decal texture for image
   * @param url
   */
  private loadDecalTexture(url: string) {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(url, (texture) => {
      this.decalMaterial = new THREE.MeshPhongMaterial({
        map: texture,
        transparent: true,
        opacity: 0.95,
        depthTest: true,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -4,
      });
    });
  }

  /**
   * extract modal name to display on select
   * @param path
   * @returns
   */
  getModelName(path: string): string {
    return (
      path
        .split('/')
        .pop()
        ?.replace(/_/g, ' ')
        .replace(/\.glb$/, '') || ''
    );
  }

  /**
   * toggle img or text to add on modal
   * @param mode
   */
  toggleMode(mode: 'image' | 'text') {
    this.decalMode = mode;
  }

  /**
   * selection event for text and image
   * @param event
   * @returns
   */
  private onMouseDown(event: MouseEvent) {
    if (this.isDraggingDecal) return;
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, this.camera);
    let hitDecal: THREE.Mesh | undefined;
    for (const d of this.decals) {
      const intersects = this.raycaster.intersectObject(d);
      if (intersects.length > 0) {
        const hit = intersects[0];
        const camDir = new THREE.Vector3();
        this.camera.getWorldDirection(camDir);
        const normal = hit.face?.normal
          ? hit.face.normal.clone().transformDirection(hit.object.matrixWorld)
          : new THREE.Vector3(0, 0, 1);
        if (normal.dot(camDir) < 0) {
          hitDecal = d;
          break;
        }
      }
    }
    if (hitDecal) {
      this.selectedDecal = hitDecal;
      this.isDraggingDecal = true;
      this.renderer.domElement.style.cursor = 'grabbing';
    }
  }

  /**
   * dragging event for text and image
   */
  private onMouseMove(event: MouseEvent) {
    if (!this.isDraggingDecal || !this.selectedDecal || !this.model) return;
    this.controls.enabled = false;
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.modelMeshes, true);
    if (intersects.length === 0) return;
    const hit = intersects[0];
    const mesh = hit.object as THREE.Mesh;
    const normal = hit.face?.normal
      ? hit.face.normal.clone().transformDirection(mesh.matrixWorld)
      : new THREE.Vector3(0, 0, 1);
    const camDir = new THREE.Vector3();
    this.camera.getWorldDirection(camDir);
    if (normal.dot(camDir) > 0) return;
    const point = hit.point.clone().addScaledVector(normal, 0.005);
    const orientationQuat = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      camDir.negate()
    );
    const orientation = new THREE.Euler().setFromQuaternion(orientationQuat);
    let decalSize;
    if (this.selectedDecal.userData['type'] === 'image') {
      const baseSize = this.selectedDecal.userData['baseSize'] as THREE.Vector3;
      let scaleFactor = this.selectedDecal.userData['currentScale'] ?? 1;
      decalSize = new THREE.Vector3(
        baseSize.x * scaleFactor,
        baseSize.y * scaleFactor,
        baseSize.z * scaleFactor
      );
    } else {
      decalSize = this.selectedDecal.userData['originalSize'];
    }
    this.selectedDecal.userData['position'] = point;
    const newGeom = new DecalGeometry(mesh, point, orientation, decalSize);
    this.selectedDecal.geometry.dispose();
    this.selectedDecal.geometry = newGeom;
    this.renderer.domElement.style.cursor = 'grabbing';
  }

  /**
   * remove dragging visiblities
   * @param event
   */
  private onMouseUp(event: MouseEvent) {
    this.isDraggingDecal = false;
    this.renderer.domElement.style.cursor = 'auto';
    this.controls.enabled = true;
  }

  /**
   * destroy all scene to realod new modal
   */
  private destroyScene(): void {
    cancelAnimationFrame(this.animationId);

    if (this.model) {
      this.scene.remove(this.model);
      this.model.traverse((obj: any) => {
        if (obj.geometry) obj.geometry.dispose?.();
        if (obj.material) {
          if (Array.isArray(obj.material))
            obj.material.forEach((m: { dispose: () => any }) => m.dispose?.());
          else obj.material.dispose?.();
        }
      });
      this.model = null;
    }

    if (this.renderer) {
      this.renderer.dispose();
      const canvas = this.renderer.domElement;
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    }

    this.scene = null as any;
    this.camera = null as any;
    this.controls = null as any;
  }

  /**
   * make modal correct display on load
   */
  private fitCameraToObject(padding = 1.5) {
    if (!this.model || !this.camera || !this.controls) {
      console.warn('⚠️ Model, camera, or controls missing in fitCameraToObject()');
      return;
    }

    // Compute bounding box and get its size + center
    const box = new THREE.Box3().setFromObject(this.model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    // Handle empty or invalid bounding box
    if (size.length() === 0 || !isFinite(size.x)) {
      console.warn('⚠️ Invalid bounding box for model');
      return;
    }

    // Re-center the model around origin
    this.model.position.sub(center);
    this.controls.target.set(0, 0, 0);

    // Compute distance based on largest dimension and camera FOV
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = THREE.MathUtils.degToRad(this.camera.fov);
    const cameraZ = maxDim / 2 / Math.tan(fov / 2);

    // Add padding (e.g., zoom out slightly)
    const adjustedDistance = cameraZ * padding;

    // Compute bounding sphere radius for stable positioning
    const sphere = box.getBoundingSphere(new THREE.Sphere());
    const direction = new THREE.Vector3(0, 0, 1); // camera looks down Z-axis
    const newPos = direction.multiplyScalar(adjustedDistance);

    // Position and update camera
    this.camera.position.copy(newPos);
    this.camera.lookAt(0, 0, 0);
    this.camera.updateProjectionMatrix();

    // Update orbit controls target and re-render
    this.controls.target.set(0, 0, 0);
    this.controls.update();
  }

  /**
   * on resize keep canvas container responsive
   */
  private onWindowResize() {
    const container = this.canvasContainer.nativeElement;
    const width = container.clientWidth;
    const height = container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.fitCameraToObject();
  }

  /**
   * place text decal on modal
   * @param event
   * @param textValue
   * @returns
   */
  private placeTextDecal(event: MouseEvent, textValue: string) {
    if (!this.model || !textValue.trim()) return;

    const rect = this.renderer.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, this.camera);

    const intersects: THREE.Intersection[] = [];
    this.model.traverse((child: any) => {
      if (child.isMesh) {
        const hits = raycaster.intersectObject(child);
        if (hits.length) intersects.push(...hits);
      }
    });

    if (intersects.length === 0) return;

    const hit = intersects[0];
    const mesh = hit.object as THREE.Mesh;

    const normal = hit.face?.normal
      ? hit.face.normal.clone().transformDirection(mesh.matrixWorld)
      : new THREE.Vector3(0, 0, 1);

    const point = hit.point.clone().addScaledVector(normal, 0.005);

    // --- Orientation ---
    const camDir = new THREE.Vector3();
    this.camera.getWorldDirection(camDir);
    const orientationQuat = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      camDir.negate()
    );
    const orientation = new THREE.Euler().setFromQuaternion(orientationQuat);

    // --- Canvas texture for text ---
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const color = this.textConfig.fontColor;
    const font = `${this.textConfig.bold ? 'bold ' : ''}${this.textConfig.italic ? 'italic ' : ''}${
      Number(this.textConfig.fontSize) + 80
    }px ${this.textConfig.fontFamily || 'Arial'}`;
    ctx.fillStyle = color;
    ctx.font = font;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillText(this.userText, canvas.width / 2, canvas.height / 2);

    const textTexture = new THREE.CanvasTexture(canvas);
    textTexture.needsUpdate = true;

    // --- Decal geometry ---
    const decalSize = new THREE.Vector3(1, 1 / 2, 1);
    const decalGeom = new DecalGeometry(mesh, point, orientation, decalSize);

    const decalMat = new THREE.MeshPhongMaterial({
      map: textTexture,
      transparent: true,
      opacity: 1,
      depthWrite: false,
      depthTest: true,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      side: THREE.DoubleSide,
      blending: THREE.NormalBlending,
    });

    if (decalMat.map) {
      decalMat.map.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
      decalMat.map.minFilter = THREE.LinearMipmapLinearFilter;
      decalMat.map.magFilter = THREE.LinearFilter;
    }

    // ✅ Create and add new decal
    const newDecal = new THREE.Mesh(decalGeom, decalMat);
    newDecal.renderOrder = this.decals.length + 1;
    newDecal.userData = {
      mesh,
      position: point,
      orientation,
      originalSize: decalSize.clone(),
      scaleFactor: 1,
      type: 'text',
      text: textValue,
      textSettings: {
        ...this.textConfig,
      },
    };
    this.scene.add(newDecal);
    this.decals.push(newDecal);

    this.userText = '';
    this.selectedDecal = null;
    this.textConfig = {
      fontFamily: 'Poppins',
      fontSize: 20,
      fontColor: '#000000',
      bold: false,
      italic: false,
      underline: false,
    };
  }

  /**
   * place image decal on modal
   * @param event
   * @param replaceOld
   * @returns
   */
  private placeDecal(event: MouseEvent, replaceOld = false) {
    if (!this.model || !this.decalMaterial) return;

    // ❌ Ignore clicks while dragging a gizmo
    // if (this.transform.dragging) return;

    const rect = this.renderer.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, this.camera);

    const intersects: THREE.Intersection[] = [];
    this.model.traverse((child: any) => {
      if (child.isMesh) {
        const hits = raycaster.intersectObject(child);
        if (hits.length) intersects.push(...hits);
      }
    });

    if (intersects.length === 0) return;

    const hit = intersects[0];
    const mesh = hit.object as THREE.Mesh;

    const normal = hit.face?.normal
      ? hit.face.normal.clone().transformDirection(mesh.matrixWorld)
      : new THREE.Vector3(0, 0, 1);

    const point = hit.point.clone().addScaledVector(normal, 0.005);

    const camDir = new THREE.Vector3();
    this.camera.getWorldDirection(camDir);
    const orientationQuat = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      camDir.negate()
    );
    const orientation = new THREE.Euler().setFromQuaternion(orientationQuat);
    let decalSize: THREE.Vector3;
    if (this.decalMesh) {
      decalSize = this.decalMesh!.userData['originalSize'];
    } else {
      decalSize = new THREE.Vector3(1, 1, 1);
    }
    const decalGeom = new DecalGeometry(mesh, point, orientation, decalSize);

    const decalMat = new THREE.MeshPhongMaterial({
      map: this.decalMaterial.map,
      transparent: true,
      opacity: 1,
      depthWrite: false,
      depthTest: true,
      polygonOffset: true,
      polygonOffsetFactor: -2,
      side: THREE.DoubleSide,
      blending: THREE.NormalBlending,
    });

    if (decalMat.map) {
      decalMat.map.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
      decalMat.map.minFilter = THREE.LinearMipmapLinearFilter;
      decalMat.map.magFilter = THREE.LinearFilter;
    }

    if (replaceOld && this.selectedDecal) {
      this.scene.remove(this.selectedDecal);
      this.decals = this.decals.filter((d) => d !== this.selectedDecal);
      this.transform.detach();
      this.selectedDecal = null;
    }

    const newDecal = new THREE.Mesh(decalGeom, decalMat);
    newDecal.renderOrder = this.decals.length + 1;
    this.scene.add(newDecal);
    this.decalMesh = newDecal;
    newDecal.userData = {
      mesh,
      position: point,
      orientation,
      originalSize: decalSize.clone(),
      baseSize: decalSize.clone(),
      scaleFactor: 1,
      type: 'image',
      image: this.decalImageUrl,
    };
    this.decals.push(newDecal);
    this.selectedDecal = newDecal;
  }

  /**
   * Apply a solid color to the entire model
   * @param color - THREE.Color, hex number, or CSS string (e.g., 0xff0000 or '#ff0000')
   */
  applySolidColor(color: THREE.Color | number | string) {
    if (!this.model) return;

    const solidColor = new THREE.Color(color);

    const clothMaterial = new THREE.MeshStandardMaterial({
      color: solidColor,
      roughness: 0.8,
      metalness: 0.0,
      side: THREE.DoubleSide,
      flatShading: false,
      emissive: new THREE.Color(0x000000),
    });

    this.model.traverse((child: any) => {
      if (child.isMesh) {
        if (Array.isArray(child.material)) {
          child.material.forEach((m: any) => {
            m.color = clothMaterial.color;
            m.roughness = clothMaterial.roughness;
            m.metalness = clothMaterial.metalness;
            m.side = clothMaterial.side;
            m.flatShading = clothMaterial.flatShading;
            m.emissive = clothMaterial.emissive;
            m.transparent = false;
            m.opacity = 1;
            m.depthWrite = true;
            m.needsUpdate = true;
          });
        } else {
          child.material.color = clothMaterial.color;
          child.material.roughness = clothMaterial.roughness;
          child.material.metalness = clothMaterial.metalness;
          child.material.side = clothMaterial.side;
          child.material.flatShading = clothMaterial.flatShading;
          child.material.emissive = clothMaterial.emissive;
          child.material.transparent = false;
          child.material.opacity = 1;
          child.material.depthWrite = true;
          child.material.needsUpdate = true;
        }
      }
    });
  }

  /**
   * edit text decal
   * @param decal
   * @returns
   */
  editTextDecal(decal: THREE.Mesh) {
    if (decal.userData['type'] !== 'text') return;
    this.editDecal = decal;
    this.selectedDecal = decal;
    this.decalMode = 'text';
    this.userText = decal.userData['text'] || '';
    this.textConfig = decal.userData['textSettings'];
  }

  /**
   * updaet text decal
   * @returns
   */
  updateTextDecal() {
    if (!this.editDecal || !this.userText.trim()) return;
    const decal = this.editDecal;
    // --- Update user data
    decal.userData['textValue'] = this.userText;
    decal.userData['textSettings'] = { ...this.textConfig };

    // --- Create new canvas texture
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // === Apply Text Styles ===
    const { fontFamily, fontSize, fontColor, bold, italic } = this.textConfig;
    const font = `${bold ? 'bold ' : ''}${italic ? 'italic ' : ''}${
      Number(fontSize) + 80
    }px ${fontFamily}`;
    ctx.font = font;
    ctx.fillStyle = fontColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ctx.fillText(this.userText, canvas.width / 2, canvas.height / 2);

    // === Create texture ===
    const textTexture = new THREE.CanvasTexture(canvas);
    textTexture.needsUpdate = true;

    // === Replace decal texture ===
    const mat = decal.material as THREE.MeshPhongMaterial;
    if (mat.map) mat.map.dispose();
    mat.map = textTexture;
    mat.needsUpdate = true;
    this.decals.forEach((decal) => {
      if (decal.uuid === this.editDecal?.uuid) {
        decal.userData['textSettings'] = { ...this.textConfig };
        decal.userData['text'] = this.userText;
      }
    });

    // === Clean state ===
    this.editDecal = null;
    this.selectedDecal = null;
    this.userText = '';
    this.textConfig = {
      fontFamily: 'Poppins',
      fontSize: 20,
      fontColor: '#000000',
      bold: false,
      italic: false,
      underline: false,
      align: 'center',
    };

    // === Ensure rerender ===
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * add update img on modal
   * @param event
   * @returns
   */
  onImageUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const imageUrl = reader.result as string;
      this.decalImageUrl = imageUrl;

      // If user is editing an existing decal — update it directly
      if (this.editDecal && this.editDecal.userData['type'] === 'image') {
        const decal = this.editDecal;

        const loader = new THREE.TextureLoader();
        loader.load(
          imageUrl,
          (texture) => {
            texture.needsUpdate = true;

            if (decal.material instanceof THREE.MeshPhongMaterial) {
              decal.material.map = texture;
              decal.material.needsUpdate = true;
            }

            // Update reference in userData
            decal.userData['image'] = imageUrl;
          },
          undefined,
          (error) => console.error('❌ Failed to load new decal texture:', error)
        );
        this.editDecal = null;
        this.selectedDecal = null;
      } else {
        this.loadDecalTexture(imageUrl);
        setTimeout(() => {
          this.placeImage();
        }, 500);
      }
    };

    reader.readAsDataURL(file);

    // Reset so same file can trigger again
    input.value = '';
  }

  get isEditingText(): boolean {
    return !!this.editDecal && this.editDecal.userData['type'] === 'text';
  }

  /**
   * reset edit state
   */
  cancelEdit() {
    this.textConfig = this.selectedDecal?.userData['textSettings'];
    this.userText = this.selectedDecal?.userData['text'];
    this.refreshDecal();
    this.selectedDecal = null;
    this.editDecal = null;
    this.userText = '';
    this.textConfig = {
      fontFamily: 'Poppins',
      fontSize: 20,
      fontColor: '#000000',
      bold: false,
      italic: false,
      underline: false,
    };
  }

  /**
   * remove select decal from scene
   * @param decal
   * @returns
   */
  removeSelectedDecal(decal: any) {
    if (!decal) return;
    this.scene.remove(decal);
    this.decals = this.decals.filter((d) => d !== decal);
  }

  /**
   * open img upload
   */
  openImageUpload() {
    const input = document.getElementById('imageUpload') as HTMLInputElement;
    input?.click();
  }

  /**
   *
   */
  editImage(decal: any) {
    this.editDecal = decal;
    this.selectedDecal = decal;
    this.decalMode = 'image';
    this.userText = '';
    setTimeout(() => {
      this.openImageUpload();
    }, 500);
  }

  /**
   * create fake event and upload it to center on modal
   * @returns
   */
  placeImage() {
    if (!this.model || !this.decalMaterial) {
      alert('Model or decal not ready yet!');
      return;
    }

    const box = new THREE.Box3().setFromObject(this.model);
    const center = box.getCenter(new THREE.Vector3());

    const camDir = new THREE.Vector3();
    this.camera.getWorldDirection(camDir);

    const offset = camDir.clone().multiplyScalar(box.getSize(new THREE.Vector3()).length() * 0.25);
    const decalWorldPos = center.clone().add(offset);

    const projected = decalWorldPos.clone().project(this.camera);
    const x = ((projected.x + 1) / 2) * this.renderer.domElement.clientWidth;
    const y = ((-projected.y + 1) / 2) * this.renderer.domElement.clientHeight;

    const fakeEvent = {
      clientX: x + this.renderer.domElement.getBoundingClientRect().left,
      clientY: y + this.renderer.domElement.getBoundingClientRect().top,
    } as MouseEvent;
    this.decalScale = 1;
    this.placeDecal(fakeEvent);
  }

  /**
   * change the size of decal
   */
  onDecalScaleChange(event: Event) {
    if (!this.selectedDecal) return;
    const slider = event.target as HTMLInputElement;
    const scaleValue = parseFloat(slider.value);
    this.decalScale = scaleValue;
    this.refreshDecal({ scale: scaleValue });
  }

  /**
   * create fake event and add it to center on modal
   * @returns
   */
  addText() {
    if (!this.userText) {
      alert('Please enter text before adding!');
      return;
    }

    if (!this.model) return;

    // Compute model center
    const box = new THREE.Box3().setFromObject(this.model);
    const center = box.getCenter(new THREE.Vector3());

    // Place the decal slightly in front of model along camera view
    const camDir = new THREE.Vector3();
    this.camera.getWorldDirection(camDir); // normalized

    // Offset in camera direction
    const offset = camDir.clone().multiplyScalar(box.getSize(new THREE.Vector3()).length() * 0.25);

    const decalWorldPos = center.clone().add(offset);

    // Project to screen coordinates
    const projected = decalWorldPos.clone().project(this.camera);
    const x = ((projected.x + 1) / 2) * this.renderer.domElement.clientWidth;
    const y = ((-projected.y + 1) / 2) * this.renderer.domElement.clientHeight;

    const fakeEvent = {
      clientX: x + this.renderer.domElement.getBoundingClientRect().left,
      clientY: y + this.renderer.domElement.getBoundingClientRect().top,
    } as MouseEvent;

    this.placeTextDecal(fakeEvent, this.userText);
  }

  /**
   * updaet text config
   * @param property
   * @param value
   */
  updateTextConfig(property: keyof typeof this.textConfig, value: any) {
    this.textConfig = {
      ...this.textConfig,
      [property]: property === 'fontSize' || property === 'fontFamily' ? value.target.value : value,
    };
    if (this.isEditingText) {
      this.refreshDecal();
    }
  }

  /**
   * refresh decal on its postion on every changes
   * @param options
   * @returns
   */
  refreshDecal(
    options: {
      scale?: number;
      texture?: THREE.Texture;
      text?: string;
      color?: string;
      font?: string;
    } = {}
  ) {
    const decal = this.selectedDecal;
    console.log('decal: ', decal);
    if (!decal?.userData?.['mesh'] || !decal.userData['position'] || !decal.userData['orientation'])
      return;

    const mesh = decal.userData['mesh'] as THREE.Mesh;
    const position = decal.userData['position'] as THREE.Vector3;
    const orientation = decal.userData['orientation'] as THREE.Euler;
    if (this.selectedDecal?.userData['type'] === 'image') {
      const baseSize = decal.userData['baseSize'] as THREE.Vector3;
      // --- Scale ---
      let scaleFactor = decal.userData['currentScale'] ?? 1;
      if (options.scale !== undefined) scaleFactor = options.scale;

      const size = new THREE.Vector3(
        baseSize.x * scaleFactor,
        baseSize.y * scaleFactor,
        baseSize.z * scaleFactor
      );
      decal.userData['currentScale'] = scaleFactor;
      decal.userData['scaleFactor'] = scaleFactor;

      // --- Geometry ---
      const newGeom = new DecalGeometry(mesh, position, orientation, size);
      decal.geometry.dispose();
      decal.geometry = newGeom;
    }

    // --- Texture ---
    let newTexture: THREE.Texture | undefined;

    if (decal.userData['type'] === 'text') {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 512;
      const ctx = canvas.getContext('2d')!;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = this.textConfig.fontColor || '#000000';
      ctx.font = `${this.textConfig.bold ? 'bold ' : ''}${this.textConfig.italic ? 'italic ' : ''}${
        Number(this.textConfig.fontSize) + 80
      }px ${this.textConfig.fontFamily || 'Arial'}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.userText, canvas.width / 2, canvas.height / 2);

      newTexture = new THREE.CanvasTexture(canvas);
    } else if (options.texture) {
      newTexture = options.texture;
    }

    // --- Apply texture ---
    if (newTexture) {
      newTexture.needsUpdate = true;
      const mats = Array.isArray(decal.material) ? decal.material : [decal.material];
      mats.forEach((mat) => {
        if (mat instanceof THREE.MeshPhongMaterial) {
          mat.map?.dispose?.();
          mat.map = newTexture;
          mat.needsUpdate = true;
        }
      });
    }
  }

  private animate = () => {
    this.animationFrameId = requestAnimationFrame(this.animate);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };

  /**
   * save all design modal updated design in local storage for now
   * @returns
   */
  saveDesign(showToast: boolean = true): void {
    if (!this.model) return;
    const storageKey = this.extractModelKey(this.selectedModelPath);
    // Extract material data
    const modelMaterialData: any[] = [];
    this.model.traverse((child: any) => {
      if (child.isMesh && child.material) {
        const mat = child.material;
        modelMaterialData.push({
          name: child.name,
          color: mat.color?.getHex(),
          roughness: mat.roughness,
          metalness: mat.metalness,
        });
      }
    });

    // Save all decal userData directly
    const decalsData = this.decals.map((decal) => {
      // clone userData to avoid circular refs or live object mutations
      const userData = { ...decal.userData };

      // ensure vectors/eulers are serializable
      if (userData['position']?.toArray) userData['position'] = userData['position'].toArray();
      if (userData['orientation']?.toArray)
        userData['orientation'] = userData['orientation'].toArray();
      if (userData['originalSize']?.toArray) userData['originalSize'] = [1, 1, 1];
      if (userData['baseSize']?.toArray) userData['baseSize'] = [1, 1, 1];
      if (userData['type'] === 'image')
        userData['image'] =
          'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPkNnMdPMYL0wJTAweRejy-TK0WslkwCikVg&s';
      return userData;
    });
    const cleanedDecals = decalsData.map(({ mesh, ...rest }) => rest);
    this. saveDesignData = {
      modelPath: this.selectedModelPath,
      materials: modelMaterialData,
      decals: cleanedDecals,
    };

    localStorage.setItem(storageKey, JSON.stringify(this.saveDesignData));
    if (showToast) {
      this.sharedService.showToast('Saved!', 'Your design has been saved successfully.');
    }
    this.isSavedDesign();
  }

  /**
   * extract model key on base of its path
   * @param modelPath
   * @returns
   */
  private extractModelKey(modelPath: string) {
    const fileName = modelPath.split('/').pop()?.replace('.glb', '') || 'unknown_model';
    return `design_model/${fileName}`;
  }

  /**
   *  load modal design
   * @returns
   */
  async loadDesign(): Promise<void> {
    if (!this.model) {
      console.warn('⚠️ No model loaded; cannot apply decals.');
      return;
    }
    this.selectedDecal = null;
    const storedKey = this.extractModelKey(this.selectedModelPath);
    const savedDesign = JSON.parse(localStorage.getItem(storedKey) || '{}');
    console.log('savedDesign: ', savedDesign);

    // Restore materials
    savedDesign.materials?.forEach((matData: any) => {
      const target = this.model!.getObjectByName(matData.name) as THREE.Mesh;
      if (target && target.material) {
        const mat = target.material as THREE.MeshStandardMaterial;
        mat.color = new THREE.Color(matData.color);
        mat.roughness = matData.roughness ?? 0.8;
        mat.metalness = matData.metalness ?? 0.0;
        mat.needsUpdate = true;
      }
    });

    // Remove previous decals
    this.decals.forEach((d) => this.scene.remove(d));
    this.decals = [];

    // Rebuild decals using stored userData directly
    for (const d of savedDesign.decals) {
      const position = new THREE.Vector3().fromArray(d.position);
      const rotation = new THREE.Euler().fromArray(d.orientation);
      const size = d.type === 'image' ? new THREE.Vector3().fromArray(d.baseSize).multiplyScalar(d.scaleFactor || 1): new THREE.Vector3(new THREE.Vector3().fromArray(d.originalSize).x, new THREE.Vector3().fromArray(d.originalSize).y/2, new THREE.Vector3().fromArray(d.originalSize).z);;

      const baseMesh = this.modelMeshes[0];
      const decalGeom = new DecalGeometry(baseMesh, position, rotation, size);

      let decalMat: THREE.MeshPhongMaterial;

      if (d.type === 'image') {
        const texture = await new Promise<THREE.Texture>((resolve, reject) => {
          new THREE.TextureLoader().load(d.image, resolve, undefined, reject);
        });

        decalMat = new THREE.MeshPhongMaterial({
          map: texture,
          transparent: true,
          depthWrite: false,
          polygonOffset: true,
          polygonOffsetFactor: -1, // negative pushes decal in front
          polygonOffsetUnits: -1,
        });
      } else if (d.type === 'text') {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 512;
        const ctx = canvas.getContext('2d')!;
        const s = d.textSettings || {};
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = s.fontColor || '#000';
        ctx.font = `${s.bold ? 'bold ' : ''}${s.italic ? 'italic ' : ''}${
          Number(s.fontSize) + 80
        }px ${s.fontFamily || 'Arial'}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(d.text, canvas.width / 2, canvas.height / 2);
        const textTexture = new THREE.CanvasTexture(canvas);
        decalMat = new THREE.MeshPhongMaterial({
          map: textTexture,
          transparent: true,
          depthWrite: false,
          polygonOffset: true,
          polygonOffsetFactor: -1,
          polygonOffsetUnits: -1,
        });
      } else {
        continue;
      }

      const decalMesh = new THREE.Mesh(decalGeom, decalMat);

      decalMesh.userData = {
        ...d,
        position,
        orientation: rotation,
        originalSize: size,
        mesh: baseMesh,
        baseSize: d.type === 'image' ? new THREE.Vector3().fromArray(d.baseSize): null,
      };

      this.scene.add(decalMesh);
      this.decals.push(decalMesh);
    }

    this.decals = this.decals.filter((d) => d?.userData?.['type']);
    // this.cdRef.detectChanges?.();

    this.fitCameraToObject();
  }
  addToCart() {
    this.saveDesign(false);
      const payload={
      components:"{}",
        pricelist_id: null,
        product_id: this.productId,
        quantity: 1,
        saved_for_later: true,
        user_id: "Cg0wLTM4NS0yODA4OS0wEgRtb2Nr",
        variants: {
          thumbnail_url: 'products/f5677192-e994-49e6-8cfa-ff5dbea4e02d_mahroon_color.png',
          hasCustom:true,
          model:this.saveDesignData          
        }
    }
    this.cartService.addCartItem(payload).subscribe({
      next: (res) => {
        console.log('Item added to cart successfully:', res);
        this.sharedService.showToast('Item added to cart successfully', 'success');
      },
      error: (err) => {
        console.error('Error adding item to cart:', err);
        this.sharedService.showToast('Error adding item to cart', 'error');
      }
    });
    
  }
  
  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationFrameId);
    this.renderer.dispose();
    window.removeEventListener('resize', () => this.onWindowResize());
    // this.renderer.domElement.addEventListener('click', (e) => this.onCanvasClick(e));
  }
}
