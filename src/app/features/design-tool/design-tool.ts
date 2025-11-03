import {
  Component,
  OnDestroy,
  AfterViewInit,
  ElementRef,
  ViewChild,
  Input,
} from '@angular/core';
import * as THREE from 'three';
import {
  GLTFLoader,
  DecalGeometry,
} from 'three-stdlib';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';

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
  private controls!: OrbitControls;
  private transform!: TransformControls; // 🆕 added for moving/rotating/scaling decal
  private animationFrameId = 0;
  private decalMaterial!: THREE.MeshPhongMaterial;
  private decalMesh!: THREE.Mesh;
  private decalScale = 3;
  private modelCenter = new THREE.Vector3();

  // 🆕 Add your decal texture path here (change as needed)
  private decalImageUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPkNnMdPMYL0wJTAweRejy-TK0WslkwCikVg&s';
  userText: string = '';

  decalMode: 'image' | 'text' = 'image';
  addDecalToggle: boolean = false;
   decals: THREE.Mesh[] = [];
  private selectedDecal: THREE.Mesh | null = null; // default mode
  selectedModelPath="";
modelPaths = [
    // 'assets/Drop_Shoulder_Sweatshirt/Drop_Shoulder_Sweatshirt_OBJ.gltf',
    'assets/Long_Sleeve_Shirt_OBJ/Long_Sleeve_Shirt_OBJ.gltf',
    'assets/Raglan_Sleeve_Hoodie_OBJ/Raglan_Sleeve_Hoodie_OBJ.gltf',
    'assets/Tank_Top_OBJ/Tank_Top_OBJ.gltf',
    'assets/V_Neck_T_Shirt_OBJ/V_Neck_T_Shirt_OBJ.gltf',
    'assets/Polo_Shirt_OBJ/Polo_Shirt_OBJ.gltf'
  ];

selectModel(path: any): void {
   this.selectedModelPath=path.target.value;
    this.initState();
  }
  
  getModelName(path: string): string {
    return path.split('/').pop()?.replace(/_/g, ' ').replace(/\.gltf$/, '') || '';
  }

  
  addTextDecal(event: MouseEvent) {
    this.placeTextDecal(event, this.userText);
  }
  onCanvasClick(event: MouseEvent) {
    console.log(this.decals)
    if (this.transform.dragging) return;

    const rect = this.renderer.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, this.camera);

    // Check for decal hit first
    const decalHit = this.decals.find(d => raycaster.intersectObject(d).length > 0);
    if (decalHit) {
      this.selectDecal(decalHit);
      return; // stop here, don't place a new decal
    }

    // If toggle is ON, add new decal to list
    if (this.addDecalToggle) {
      if (this.decalMode === 'image') {
        this.placeDecal(event);
      }
      else{
       this.placeTextDecal(event, this.userText);
      } 
    } else {
      // Otherwise, replace previous decal
      if (this.decalMode === 'image') this.placeDecal(event, true); // pass flag to remove old
      else this.placeTextDecal(event, this.userText, true);
    }
  }

  toggleMode(mode: 'image' | 'text') {
    console.log('this.decalMesh: ', this.decalMesh);
    if(this.decalMesh!=undefined ){
      if(this.decals.length>0){
        if(this.decals[this.decals.length-1].uuid!=this.decalMesh.uuid){
this.decals.push(this.decalMesh);
        console.log('this.decals: ', this.decals);
        this.addDecalToggle=true
      }
      
    }
    else{

      this.decals.push(this.decalMesh);
      console.log('this.decals: ', this.decals);
      this.addDecalToggle=true
    }
    }
    
    this.decalMode = mode;
  }

  ngAfterViewInit(): void {
    this.initState();

  }
  initState(){
    this.initScene();
    this.loadModel(this.selectedModelPath || 'assets/uploads_files_3704025_High+Neck+T-shirt (1).gltf');
    this.animate();

    window.addEventListener('resize', () => this.onWindowResize());
    this.renderer.domElement.addEventListener('click', (e) => this.onCanvasClick(e));
  }

  private initScene() {
    const container = this.canvasContainer.nativeElement;

    // --- Scene setup ---
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xec8951); // ✅ from 2nd function

    // --- Camera setup ---
    const width = container.clientWidth;
    const height = container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(0, 1.3, 2.8); // ✅ from 2nd function

    // --- Renderer setup ---
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // alpha support ✅
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace; // ✅ from 2nd function
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping; // ✅ from 2nd function
    this.renderer.toneMappingExposure = 1.1; // ✅ from 2nd function
    this.renderer.shadowMap.enabled = true; // keep original
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // keep original
    container.appendChild(this.renderer.domElement);

    this.addLights();

    // --- Orbit Controls (keep original behavior) ---
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.enableZoom = true; // ✅ keep zoom
    this.controls.enablePan = false;
    this.controls.minPolarAngle = Math.PI / 2;
    this.controls.maxPolarAngle = Math.PI / 2;
    this.controls.target.set(0, 0, 0); // can adjust later if needed
    this.controls.update();

    // --- TransformControls for decal manipulation ---
    this.transform = new TransformControls(this.camera, this.renderer.domElement);
    this.transform.addEventListener('dragging-changed', (event) => {
      this.controls.enabled = !event.value; // disable orbit while dragging
    });
    this.scene.add(this.transform as unknown as THREE.Object3D);
  }
  private addLights() {
    const lights = [
      new THREE.DirectionalLight(0xffffff, 3),
      new THREE.DirectionalLight(0xffffff, 3),
      new THREE.DirectionalLight(0xffffff, 3),
      new THREE.DirectionalLight(0xffffff, 3),
      new THREE.DirectionalLight(0xffffff, 3),
      new THREE.DirectionalLight(0xffffff, 3),
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
  private loadModel(path: string) {
    console.log('path: ', path);
    const loader = new GLTFLoader();
    loader.load(
      path,
      (gltf) => {
        this.model = gltf.scene;
        this.scene.add(this.model);

        const box = new THREE.Box3().setFromObject(this.model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        this.modelCenter.copy(center);

        this.model.position.sub(center);

        const maxDim = Math.max(size.x, size.y, size.z);
        const scaleFactor = 3 / maxDim;
        this.model.scale.setScalar(scaleFactor);

        requestAnimationFrame(() => {
          this.fitCameraToObject();
        });

        // 🆕 Preload decal texture after model
        this.loadDecalTexture(this.decalImageUrl);
      },
      undefined,
      (error) => console.error('Error loading model:', error)
    );
  }

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
      console.log('✅ Decal ready: click on model to place it.');
    });
  }

  private fitCameraToObject() {
    if (!this.model) return;

    const box = new THREE.Box3().setFromObject(this.model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    this.modelCenter.copy(center);

    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = this.camera.fov * (Math.PI / 180);
    let cameraZ = Math.abs(maxDim / (2 * Math.tan(fov / 2)));
    cameraZ *= 1.6;

    this.camera.position.set(0, 0, cameraZ);
    this.camera.lookAt(center);
    this.controls.target.copy(center);
    this.controls.update();
  }

  private onWindowResize() {
    const container = this.canvasContainer.nativeElement;
    const width = container.clientWidth;
    const height = container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.fitCameraToObject();
  }


  private placeTextDecal(event: MouseEvent, textValue: string, replaceOld = false) {
    if (!this.model || !textValue.trim()) return;

    // ❌ Ignore clicks while dragging a gizmo
    if (this.transform.dragging) return;

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

    

    // --- Create canvas texture
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 80px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(textValue, canvas.width / 2, canvas.height / 2);

    const textTexture = new THREE.CanvasTexture(canvas);
    textTexture.needsUpdate = true;

    const decalSize = new THREE.Vector3(this.decalScale / 3, this.decalScale / 3, this.decalScale / 3);
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

    if (replaceOld && this.selectedDecal) {
      this.scene.remove(this.selectedDecal);
      this.decals = this.decals.filter(d => d !== this.selectedDecal);
      this.transform.detach();
      this.selectedDecal = null;
    }

    const newDecal = new THREE.Mesh(decalGeom, decalMat);
    this.scene.add(newDecal);
     this.decalMesh=newDecal

    // Add to list only if toggle is ON
    if (this.addDecalToggle) {
      this.decals.push(newDecal);
      this.addDecalToggle=false
    }

    // Attach transform to the new decal
    this.selectedDecal = newDecal;
    this.transform.attach(this.selectedDecal);
    this.transform.setMode('translate');
    this.transform.size = 10;

    this.transform.addEventListener('dragging-changed', (e) => {
      this.controls.enabled = !e.value; // disable orbit while dragging
    });
  }

  private placeDecal(event: MouseEvent, replaceOld = false) {
    if (!this.model || !this.decalMaterial) return;

    // ❌ Ignore clicks while dragging a gizmo
    if (this.transform.dragging) return;

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

    
    const decalSize = new THREE.Vector3(this.decalScale / 3, this.decalScale / 3, this.decalScale / 3);
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
      this.decals = this.decals.filter(d => d !== this.selectedDecal);
      this.transform.detach();
      this.selectedDecal = null;
    }

    const newDecal = new THREE.Mesh(decalGeom, decalMat);
    this.scene.add(newDecal);
    this.decalMesh=newDecal
    

    // Attach transform to the new decal
    this.selectedDecal = newDecal;
    this.transform.attach(this.selectedDecal);
    this.transform.setMode('translate');
    this.transform.size = 1;


    this.transform.attach(this.decalMesh);
    this.transform.setMode('translate'); // default mode
    this.transform.size = 1; // make arrows visible

    this.transform.addEventListener('dragging-changed', (e) => {
      this.controls.enabled = !e.value;
    });
  }


  /**
 * Apply a solid color to the entire model
 * @param color - THREE.Color, hex number, or CSS string (e.g., 0xff0000 or '#ff0000')
 */
applySolidColor(color: THREE.Color | number | string) {
  if (!this.model) return;

  const solidColor = new THREE.Color(color);

  // Create a standard material with the color
  const material = new THREE.MeshStandardMaterial({
    color: solidColor,
    metalness: 0.2, // adjust as needed
    roughness: 0.8, // adjust as needed
  });

  // Traverse all meshes in the model and assign the material
  this.model.traverse((child: any) => {
    if (child.isMesh) {
      child.material = material;
      child.material.needsUpdate = true; // ensure material updates
    }
  });
}




  // private showDecalControlsHint(position: THREE.Vector3) {
  //   const hintDiv = document.getElementById('decalHint');
  //   if (!hintDiv) {
  //     const div = document.createElement('div');
  //     div.id = 'decalHint';
  //     div.innerHTML = 'Press <b>W</b> Move | <b>E</b> Rotate | <b>R</b> Scale';
  //     div.style.position = 'absolute';
  //     div.style.color = 'white';
  //     div.style.background = 'rgba(0,0,0,0.6)';
  //     div.style.padding = '4px 8px';
  //     div.style.borderRadius = '4px';
  //     div.style.pointerEvents = 'none';
  //     div.style.fontFamily = 'monospace';
  //     div.style.fontSize = '12px';
  //     document.body.appendChild(div);
  //   }

  //   // Update position every frame
  //   const updateHint = () => {
  //     const proj = position.clone().project(this.camera);
  //     const x = (proj.x * 0.5 + 0.5) * window.innerWidth;
  //     const y = (-proj.y * 0.5 + 0.5) * window.innerHeight;
  //     const div = document.getElementById('decalHint')!;
  //     div.style.left = `${x - 80}px`;
  //     div.style.top = `${y - 20}px`;
  //   };
  //   this.renderer.setAnimationLoop(() => {
  //     updateHint();
  //     this.renderer.render(this.scene, this.camera);
  //   });
  // }
  private selectDecal(decal: THREE.Mesh) {
    if (this.selectedDecal === decal) return; // already selected
    if (this.selectedDecal) this.transform.detach();
    this.selectedDecal = decal;
    this.transform.attach(this.selectedDecal);
  }
  private removeSelectedDecal() {
    if (!this.selectedDecal) return;
    this.scene.remove(this.selectedDecal);
    this.decals = this.decals.filter(d => d !== this.selectedDecal);
    this.transform.detach();
    this.selectedDecal = null;
  }





  private animate = () => {
    this.animationFrameId = requestAnimationFrame(this.animate);
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  };

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationFrameId);
    this.renderer.dispose();
    window.removeEventListener('resize', () => this.onWindowResize());
    this.renderer.domElement.addEventListener('click', (e) => this.onCanvasClick(e));

  }
}
