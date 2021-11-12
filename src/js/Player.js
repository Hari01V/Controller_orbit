import * as CANNON from 'cannon'
import * as THREE from 'three'
import { PlayerControls } from './PlayerControls'

let WALK_SPEED = 200;
let RUN_SPEED = 400;
let MOVE_SPEED = {
  'walk': WALK_SPEED,
  'run': RUN_SPEED
}
let JUMP_VELOCITY = 5;
let UP_DIRECTION = new THREE.Vector3(0, 1, 0);
let DOWN_DIRECTION = new THREE.Vector3(0, -1, 0);

class Player {
  constructor(body, world, mesh, scene, camera) {
    this._body = body;
    this._world = world;
    this._mesh = mesh;
    this._camera = camera;
    this._scene = scene;
    this._rayCaster = new THREE.Raycaster(this._mesh.position, DOWN_DIRECTION);
    this._isJumping = false;

    this._body.angularDamping = 1;

    // PLAYER CONTROLS
    this._playerControls = new PlayerControls(this);
  }

  jump() {
    // FLatten Velocity
    this._body.velocity.y = 0;

    this._body.velocity.y += JUMP_VELOCITY;
  }

  move(direction, delta) {
    this._body.velocity.x = direction.x * MOVE_SPEED[this._playerControls._currMoveAction] * delta;
    this._body.velocity.z = direction.z * MOVE_SPEED[this._playerControls._currMoveAction] * delta;
  }

  _isGrounded() {
    this._rayCaster.set(this._mesh.position, DOWN_DIRECTION);
    const intersects = this._rayCaster.intersectObjects(this._scene.children, true);
    if (intersects[0] && intersects[0].distance < this._mesh.geometry.parameters.height / 2) {
      return true;
    } else {
      return false;
    }
  }

  _flattenVelocity() {
    this._body.velocity.y = 0;
  }

  Update(deltaTime) {
    if (this._playerControls._isShouldMoveNow()) {
      this.move(this._playerControls._directionToMove.normalize(), deltaTime);
    }
    if (this._isGrounded()) {
      if (this._playerControls._wantsToJump) {
        this.jump();
        this._playerControls._wantsToJump = false;
      } else if (this._playerControls._isShouldMoveNow()) {
        this._flattenVelocity();
      }
    }
  }
}

export { Player };