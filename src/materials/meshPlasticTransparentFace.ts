import * as THREE from 'three';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import faceTrackingEnvMapImg from '../../assets/EnvMap.hdr';

// Create environmentMap for this section
const faceTrackingEnvMap = new RGBELoader().load(faceTrackingEnvMapImg, () => {
  faceTrackingEnvMap.mapping = THREE.EquirectangularReflectionMapping;
});

// Create a shiny, plasticy material
const meshPlasticTransparentMaterialFace = new THREE.MeshPhysicalMaterial(
  {
    roughness: 0.2,
    transmission: 0.9,
    refractionRatio: 0.5,
    side: THREE.DoubleSide,
    premultipliedAlpha: true,
    envMap: faceTrackingEnvMap,
    envMapIntensity: 0.7,
    clearcoat: 1,
  },
);

export default meshPlasticTransparentMaterialFace;
