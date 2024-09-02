import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import WebGL from 'three/addons/capabilities/WebGL.js'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'


//SETUP RENDER
const renderer = new THREE.WebGLRenderer({ antialias: true})
renderer.setClearColor(0x505050)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setSize(window.innerWidth/2, window.innerHeight/2, false)
//renderer.setSize(window.innerWidth, window.innerHeight)
renderer.toneMapping = THREE.NeutralToneMapping
renderer.toneMappingExposure = 0.35
renderer.shadowMap.enabled = true
//renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.shadowMap.type = THREE.BasicShadowMap
document.body.appendChild(renderer.domElement)

//SETUP CAMERA
const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1 / 1000)
const controls = new OrbitControls(camera, renderer.domElement)
camera.position.set(5, 1.5, 5)
//camera.position.z = 5;
controls.target.set(0, 0.5, 0)
controls.update()

//SETUP SCENE
const scene = new THREE.Scene()
const floorTexture = new THREE.TextureLoader().load('ground/Texturelabs_Concrete_146L.jpg')
floorTexture.repeat = new THREE.Vector2(20, 20)
floorTexture.wrapS = THREE.ReplaceWrapping
floorTexture.wrapT = THREE.ReplaceWrapping

new RGBELoader().load('enviorment/rosendal_park_sunset_puresky_4k.hdr', (enviormentMap) => {
    enviormentMap.mapping = THREE.EquirectangularReflectionMapping
    scene.background = enviormentMap
    scene.environment = enviormentMap
})

//LIGHTNING
const ambient = new THREE.AmbientLight(0xffffff, 0.1)
scene.add(ambient)

const light = new THREE.DirectionalLight(0xffffff, 5)
light.position.set(0, 10, 0)
light.castShadow = true
light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;
light.shadow.camera.near = 0.5;
light.shadow.camera.far = 50;
scene.add(light)

//MODELS
const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20), 
    new THREE.MeshStandardMaterial({
        map: floorTexture,
        roughness: 0, 
        envMapIntensity: 0.2
    }))
plane.rotation.x = -Math.PI / 2
plane.receiveShadow = true
//scene.add(plane)

const loader = new GLTFLoader()
loader.load('porsche-1975/scene.gltf', function (gltf){
    scene.add(gltf.scene)
}, undefined, function(error) {
        console.error(error)
})

//RENDER LOOP
function animate() {
    requestAnimationFrame(animate)
    //cube.rotation.x += 0.01;
	//cube.rotation.y += 0.01;

    renderer.render(scene, camera)
    controls.update
}
renderer.setAnimationLoop(animate)

//EVENTS
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})

if(WebGL.isWebGL2Available()) {
    animate()
} else {
    const warning = WebGL.getWebGL2ErrorMessage()
    document.getElementById('container').appendChild(warning)
}