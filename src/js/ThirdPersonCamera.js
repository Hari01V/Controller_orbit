import * as THREE from 'three'
import { Vector3 } from 'three';

let target_Direction = new THREE.Vector3();

class ThirdPersonCamera {
  constructor(camera, target, orbitControls) {
    this._camera = camera;
    this._target = target;
    this._orbitControls = orbitControls;

    this._currentPosition = new THREE.Vector3();
    this._currentLookat = new THREE.Vector3();

    this._targetRadius = 5;
    this._yOffset = 2.5;
  }

  _init() {
    this._camera.lookAt(this._target.position);
    this._camera.position.set(this._target.position.x, this._target.position.y + 2.5, this._target.position.z - 3.5);
  }

  Update(timeElasped) {
    let newPos = this._target.position.clone().add(new THREE.Vector3().subVectors(this._camera.position, this._target.position).normalize().multiplyScalar(this._targetRadius));
    this._camera.position.x = newPos.x;
    this._camera.position.y = this._target.position.y + this._yOffset;
    this._camera.position.z = newPos.z;

    this._orbitControls.target = this._target.position;
    this._orbitControls.update();
  }
}

export { ThirdPersonCamera };