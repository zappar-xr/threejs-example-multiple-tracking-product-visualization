import * as THREE from 'three';

export default function getLights() {
  const lightGroup = new THREE.Group();

  const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);

  const directionalLight = new THREE.DirectionalLight();
  directionalLight.castShadow = true;
  directionalLight.position.set(0, 1, 0);
  directionalLight.lookAt(0, 0, 0);

  const d = 10;
  directionalLight.shadow.camera.left = -d;
  directionalLight.shadow.camera.right = d;
  directionalLight.shadow.camera.top = d;
  directionalLight.shadow.camera.bottom = -d;

  directionalLight.shadow.camera.near = -1000;
  directionalLight.shadow.camera.far = 1000;

  directionalLight.shadow.mapSize.x = 1024;
  directionalLight.shadow.mapSize.y = 1024;

  lightGroup.add(hemisphereLight, directionalLight);

  return lightGroup;
}
