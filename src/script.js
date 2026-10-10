import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'

const canvas = document.querySelector('canvas.webgl')

const scene = new THREE.Scene()

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio))
})

const boxGeometry = new THREE.BoxGeometry()
const sphereMaterial = new THREE.MeshBasicMaterial({
    color: 0xff0000
})
const sphere = new THREE.Mesh(boxGeometry, sphereMaterial)
scene.add(sphere)

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio))

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 4
camera.lookAt(sphere.position)
scene.add(camera)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const timer = new THREE.Clock()

const tick = () => {
    
    const elaspedTime = timer.getElapsedTime()
    
    controls.update()
    // sphere.rotation.y = elaspedTime
    
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()