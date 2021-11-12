import './css/style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
// import * as CANNON from 'cannon-es'
import * as CANNON from 'cannon'
// import { CannonDebugRenderer } from 'cannon/tools/threejs/CannonDebugRenderer'
import { CannonDebugRenderer } from './js/CannonDebugRenderer'


/**
 * Debug
 */
const gui = new dat.GUI()
const debugObject = {}




// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xa0aabe)



/**
 * Physics
 */
let objectsToUpdate = [];

const world = new CANNON.World()
world.broadphase = new CANNON.SAPBroadphase(world)
world.allowSleep = true
world.gravity.set(0, - 9.82, 0)
world.allowSleep = false;


// Default material
const defaultMaterial = new CANNON.Material('default')
const springMaterial = new CANNON.Material('default')
const defaultContactMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  {
    friction: 0.1,
    restitution: 0.2
  }
)
world.defaultContactMaterial = defaultContactMaterial
const springContactMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
  springMaterial,
  {
    friction: 0.1,
    restitution: 1
  }
)
world.addContactMaterial(springContactMaterial);

/*
ADDING MODELS
*/

// Floor
const floorMesh = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    color: '#777777',
    metalness: 0.3,
    roughness: 0.4
  })
)
floorMesh.receiveShadow = true
floorMesh.rotation.x = - Math.PI * 0.5
scene.add(floorMesh)
const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body()
floorBody.mass = 0
floorBody.addShape(floorShape)
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5)
world.addBody(floorBody)

// Create SQUARE
const playerGeometry = new THREE.BoxBufferGeometry(1, 2, 1)
const playerMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4
})
const playerMesh = new THREE.Mesh(playerGeometry, playerMaterial)
playerMesh.castShadow = true
playerMesh.position.set(3, 6, 0);
// playerMesh.scale.set(0.1, 0.1, 0.1)
scene.add(playerMesh)
// const shape = new CANNON.Sphere(1)
const playerShape = new CANNON.Box(new CANNON.Vec3(0.5, 1, 0.5))
const playerBody = new CANNON.Body({
  mass: 1,
  shape: playerShape,
  material: defaultMaterial,
  position: new CANNON.Vec3(3, 6, 0)
})
world.addBody(playerBody)
objectsToUpdate.push({ model: playerMesh, body: playerBody })

let cannonDebugRenderer = new THREE.CannonDebugRenderer(scene, world);



/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(- 3, 3, 3)
scene.add(camera)


// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let oldElapsedTime = 0

const tick = () => {
  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - oldElapsedTime
  oldElapsedTime = elapsedTime

  // Update physics
  world.step(1 / 60, deltaTime, 3)

  if (cannonDebugRenderer) {
    cannonDebugRenderer.update();
  }

  // Update controls
  controls.update();

  for (const object of objectsToUpdate) {
    object.model.position.copy(object.body.position)
    object.model.quaternion.copy(object.body.quaternion)
  }

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()