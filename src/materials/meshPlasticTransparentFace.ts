import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

const faceTrackingEnvMapImg = new URL('../../assets/EnvMap.hdr', import.meta.url).href;

// Create environmentMap for this section
const faceTrackingEnvMap = new RGBELoader().load(faceTrackingEnvMapImg, () => {
  faceTrackingEnvMap.mapping = THREE.EquirectangularReflectionMapping;
});

// Create a shiny, plasticy material
const meshPlasticTransparentMaterialFace = new THREE.MeshPhysicalMaterial(
  {
    roughness: 0,
    reflectivity: 0.5,
    clearcoat: 1,
    clearcoatRoughness: 0,
    transmission: 0.7,
    transparent: true,
    opacity: 0.5,
    side: THREE.DoubleSide,
    envMap: faceTrackingEnvMap,
    envMapIntensity: 0.9,
  },
);

export default meshPlasticTransparentMaterialFace;
