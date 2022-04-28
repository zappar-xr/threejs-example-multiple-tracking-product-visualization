/* eslint-disable no-useless-constructor */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
import * as THREE from 'three';
import * as ZapparThree from '@zappar/zappar-threejs';
import ZapparSharing from '@zappar/sharing';
import getLights from './lights';
import Models from './models';
import SoundManager from './sound';

class World {
  public scene :THREE.Scene = new THREE.Scene();

  public camera : ZapparThree.Camera = new ZapparThree.Camera();

  private environmentMap = new ZapparThree.CameraEnvironmentMap();

  public models!: Models;

  public soundManager = new SoundManager();

  public onLoaded = (callback: ()=> void) => callback();

  // ZapparThree provides a LoadingManager that shows a progress bar while
  // the assets are downloaded. You can use this if it's helpful, or use
  // your own loading UI - it's up to you :-)
  private loadingManager = new ZapparThree.LoadingManager();

  public trackers = {
    instant: new ZapparThree.InstantWorldTracker(),
    face: new ZapparThree.FaceTrackerLoader(this.loadingManager).load(),
  }

  public trackerGroups = {
    // Create an InstantWorldTracker and wrap it in an InstantWorldAnchorGroup for us
    // to put our ThreeJS content into
    instant: new ZapparThree.InstantWorldAnchorGroup(this.camera, this.trackers.instant),
    face: new ZapparThree.FaceAnchorGroup(this.camera, this.trackers.face),
  }

  constructor(public renderer : THREE.WebGLRenderer) {
    // Store a reference to the renderer.
  }

  public async load() {
    this.models = new Models(this.loadingManager);
    this.setupRenderer();
    this.setupCamera();
    this.enableEnvironmentMap();
    this.setupLights();
    this.setupFaceTracker();
    await this.setupModels();

    // Add our instant tracker group into the ThreeJS scene
    this.scene.add(this.trackerGroups.face, this.trackerGroups.instant);
  }

  private setupRenderer() {
    document.body.appendChild(this.renderer.domElement);

    // As with a normal ThreeJS scene, resize the canvas if the window resizes
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    window.addEventListener('resize', () => this.onResize());
  }

  private async setupModels() {
    // Floor plane to receive shadows
    // Add it to the instrant_tracker_group.
    this.trackerGroups.instant.add(this.models.floor);
    // Load a 3D model to place within our group (using ThreeJS's GLTF loader)
    // Pass our loading manager in to ensure the progress bar works correctly
    await this.models.load();
    const {
      instantTrackingHeadset, adaptor, controller, anchor, faceTrackingHeadset, phone,
    } = this.models;
    this.trackerGroups.instant.add(instantTrackingHeadset, adaptor, controller, anchor);

    this.trackerGroups.face.add(faceTrackingHeadset, phone);
  }

  private onResize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  public takeSnapshot() {
    // Play the camera sound, if it's already playing,
    // reset so that it will play whenever we click on it
    this.soundManager.cameraPlay();

    // Get canvas from dom
    const canvas = document.querySelector('canvas');

    // Convert canvas data to url
    const url = canvas!.toDataURL('image/jpeg', 0.8);

    // Take snapshot
    ZapparSharing({
      data: url,
    });
  }

  public enableEnvironmentMap(enable: boolean = true) {
    // Set up the real time environment map
    if (enable) {
      this.scene.environment = this.environmentMap.environmentMap;
    } else {
      this.scene.environment = null;
    }
  }

  private setupFaceTracker() {
    // We want the user's face to appear in the center of the helmet
    // so use ZapparThree.HeadMaskMesh to mask out the back of the helmet.
    // In addition to constructing here we'll call mask.updateFromFaceAnchorGroup(...)
    // in the frame loop later.
    this.trackerGroups.face.add(this.models.faceMask);

    // Disable on load
    this.trackers.face.enabled = false;

    this.trackers.face.onVisible.bind(() => {
      this.trackerGroups.face.visible = true;
      this.models.faceTrackingHeadset.visible = true;
    });

    this.trackers.face.onNotVisible.bind(() => { this.trackerGroups.face.visible = false; });
  }

  private setupCamera() {
    // Set the background of our scene to be the camera background texture
    // that's provided by the Zappar camera
    this.scene.background = this.camera.backgroundTexture;
    this.camera.backgroundTexture.encoding = THREE.sRGBEncoding;
    this.camera.poseMode = ZapparThree.CameraPoseMode.AnchorOrigin;
  }

  private setupLights() {
    // Get Lights and add to scene
    const lights = getLights();
    this.scene.add(lights);
  }

  update() {
    this.camera.updateFrame(this.renderer);

    // Update the head mask so it fits the user's head in this frame
    this.models.faceMask.updateFromFaceAnchorGroup(this.trackerGroups.face);
    // Update Zappar environment map
    this.environmentMap.update(this.renderer, this.camera);
  }
}

export default World;
