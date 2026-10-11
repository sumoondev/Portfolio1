import * as THREE from 'three'
import { GUI } from 'lil-gui';
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';

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
    scene.environment = envMap
})

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio))
})

/**
 * Objects
*/
// Plane
const planeGeometry = new THREE.PlaneGeometry(5,5,5,5)
const planeMaterial = new THREE.MeshStandardMaterial({
    // color: 0xff0000,
    // side: THREE.DoubleSide,
    map: sandColor,
    aoMap: sandARM,
    normalMap: sandNormal,
    roughnessMap: sandARM,
    metalnessMap: sandARM,
    displacementMap: sandDisplacement,
    // displacementScale: 2,
    // displacementBias: 1
})
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.rotation.x = - Math.PI / 2
scene.add(plane)

// Earth
// const center = 100
// const earthGeomrtry = new THREE.SphereGeometry(center, 64, 15, 0.785, 1.6, 1, 1.57)
// const earth = new THREE.Mesh(
//     earthGeomrtry,
//     new THREE.MeshBasicMaterial({
//         color: 0xff0000,
//         side: THREE.DoubleSide
//     })
// )
// scene.add(earth)
// earth.rotation.x = - Math.PI / 2
// earth.position.y = - center

// Renderer
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio))

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