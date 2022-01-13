import * as THREE from 'three';
// Create a shiny, plasticy material
const meshPlasticTransparentMaterial = new THREE.MeshPhysicalMaterial(
  {
    metalness: 1,
    roughness: 0,
    opacity: 0.45,
    side: THREE.DoubleSide,
    transparent: true,
    premultipliedAlpha: true,
    refractionRatio: 1,
    reflectivity: 1,
    clearcoat: 1,
  },
);

export default meshPlasticTransparentMaterial;
