import * as THREE from 'three';
import * as ZapparThree from '@zappar/zappar-threejs';

class Renderer extends THREE.WebGLRenderer {
  constructor() {
    super({ antialias: true, preserveDrawingBuffer: true });
    // Append canvas to body
    document.body.appendChild(this.domElement);
    // The Zappar component needs to know our WebGL context, so set it like this:
    ZapparThree.glContextSet(this.getContext());

    // Setup shadow settings
    this.shadowMap.enabled = true;
    this.shadowMap.type = THREE.PCFSoftShadowMap;
    // Set sRGB encoding for the renderer and the camera.
    this.outputEncoding = THREE.sRGBEncoding;
    this.physicallyCorrectLights = true;
    this.toneMapping = THREE.ACESFilmicToneMapping;

    // Resize the canvas if the window resizes
    window.addEventListener('resize', () => this.resize());
    this.resize();
  }

  private resize() {
    this.setSize(window.innerWidth, window.innerHeight);
  }
}

export default Renderer;
