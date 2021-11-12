import * as THREE from 'three'

let YAXIS = new THREE.Vector3(0, 1, 0);
let tmp_DIRECTION = new THREE.Vector3();

class PlayerControls {
  constructor(player) {
    this._keysPressed = {};
    this._player = player;
    this._wantsToJump = false;
    this._currMoveAction = 'walk';

    this._currentCameraDirection = new THREE.Vector3();
    this._directionToMove = new THREE.Vector3();

    player._camera.getWorldDirection(this._currentCameraDirection);
    this._initControls();
  }

  _initControls() {
    this._keysPressed = {};
    window.addEventListener('keydown', (event) => {
      const keyCode = event.keyCode;
      if (event.key.toLowerCase() === "shift") {
        // RUN or WALK
        this._currMoveAction = 'run';
      } else if (event.key.toLowerCase() === " " && !event.repeat) {
        //JUMP SPACEBAR
        this._wantsToJump = true;
      } else {
        this._keysPressed[event.key.toLowerCase()] = true;
      }
      this._getDirections();
    })

    window.addEventListener('keyup', (event) => {
      if (event.key.toLowerCase() === "shift") {
        // RUN or WALK
        this._currMoveAction = 'walk';
      } else if (event.key.toLowerCase() === " ") {
        //JUMP SPACEBAR
        this._wantsToJump = false;
      } else {
        this._keysPressed[event.key.toLowerCase()] = false;
      }
      this._getDirections();
    });
  }

  _getDirections() {
    this._player._camera.getWorldDirection(this._currentCameraDirection);
    this._currentCameraDirection = this._currentCameraDirection.normalize();

    this._directionToMove.set(0, 0, 0);
    if (this._keysPressed['w']) {
      this._directionToMove.add(this._currentCameraDirection);
    }
    if (this._keysPressed['a']) {
      tmp_DIRECTION.copy(this._currentCameraDirection);
      tmp_DIRECTION.applyAxisAngle(YAXIS, Math.PI / 2);
      this._directionToMove.add(tmp_DIRECTION);
    }
    if (this._keysPressed['s']) {
      tmp_DIRECTION.copy(this._currentCameraDirection);
      tmp_DIRECTION.applyAxisAngle(YAXIS, Math.PI);
      this._directionToMove.add(tmp_DIRECTION);
    }
    if (this._keysPressed['d']) {
      tmp_DIRECTION.copy(this._currentCameraDirection);
      tmp_DIRECTION.applyAxisAngle(YAXIS, -Math.PI / 2);
      this._directionToMove.add(tmp_DIRECTION);
    }
  }

  _isShouldMoveNow() {
    if (this._keysPressed['w'] || this._keysPressed['a'] || this._keysPressed['s'] || this._keysPressed['d']) {
      return true;
    }
    return false;
  }
}

export { PlayerControls };