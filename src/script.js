import * as THREE from 'three'
import { GUI } from 'lil-gui';
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Size
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

/**
 * Debug
*/
const gui = new GUI()
gui.close()
const debugObjects = {}

/**
 * Loaders
*/
const hdrLoader = new HDRLoader()
const textureLoader = new THREE.TextureLoader()
const dracoLoader = new DRACOLoader()
const gltfLoader = new GLTFLoader()

dracoLoader.setDecoderPath('/draco/')
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * Sand
*/
const sandColor = textureLoader.load('/terrain/color.jpg')
const sandNormal = textureLoader.load('/terrain/normal.jpg')
const sandARM = textureLoader.load('/terrain/arm.jpg')
const sandDisplacement = textureLoader.load('/terrain/displacement.jpg')

const scene = new THREE.Scene()

hdrLoader.load('/Environment.hdr', (envMap) => {
    envMap.mapping = THREE.EquirectangularReflectionMapping
    scene.background = envMap
    // scene.environment = envMap
})


window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio))
})

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff,3)
scene.add(directionalLight)
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.castShadow = true
directionalLight.position.set(5,5,5)

/**
 * Objects
*/
// Plane
const planeGeometry = new THREE.PlaneGeometry(10,10,5,5)
const planeMaterial = new THREE.MeshStandardMaterial({
    // color: 0xff0000,
    // side: THREE.DoubleSide,
    map: sandColor,
    // aoMap: sandARM,
    // normalMap: sandNormal,
    // roughnessMap: sandARM,
    // metalnessMap: sandARM,
    // displacementMap: sandDisplacement,
    // displacementScale: 2,
    // displacementBias: -1.5
})
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.rotation.x = - Math.PI / 2
plane.receiveShadow = true
scene.add(plane)

// Basketball
gltfLoader.load('/basketball/basketball.glb', (model) => {
    // console.log(model)
    model.scene.position.set(0,1,0)
    model.scene.castShadow = true
    model.scene.children[0].castShadow = true
    scene.add(model.scene)
    model.scene.visible = false
})

// Court
gltfLoader.load('/court/court.glb', (model) => {
    console.log(model)
    model.scene.position.set(0,1,0)
    model.scene.castShadow = true
    model.scene.children[0].castShadow = true
    scene.add(model.scene)
    model.scene.visible = true
})

// Renderer
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio))
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

// Timer
const timer = new THREE.Timer()

const tick = () => {
    timer.update()
    const elaspedTime = timer.getElapsed()
    
    // sphere.rotation.y = elaspedTime
    
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()