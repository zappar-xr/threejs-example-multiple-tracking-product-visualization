import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

// Load a 3D model to place within our group (using ThreeJS's GLTF loader)
// Pass our loading manager in to ensure the progress bar works correctly
class AsyncGLTFLoader {
  private static gltfLoaderSingleton : GLTFLoader;

  static load(path: string, manger : THREE.LoadingManager): Promise<THREE.Scene> {
    if (!AsyncGLTFLoader.gltfLoaderSingleton) {
      AsyncGLTFLoader.gltfLoaderSingleton = new GLTFLoader(manger);
    }

    return new Promise((resolve, reject) => {
      AsyncGLTFLoader.gltfLoaderSingleton.load(
        path,
        (gltf) => resolve(<any>gltf.scene),
        undefined,
        () => reject(new Error('Failed Loading model')),
      );
    });
  }

  static loadAll(
    models : string[], loadingManager : THREE.LoadingManager,
  ) : Promise<THREE.Scene[]> {
    return Promise.all(models.map((model) => AsyncGLTFLoader.load(model, loadingManager)));
  }
}

export default AsyncGLTFLoader;
