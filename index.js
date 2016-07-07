window.THREE = require('THREE')
require('three-vive-controller')(THREE)
require('./VRControls')
require('./VREffect')
require('./MTLLoader')
require('./OBJLoader')
require('./utils')
var GrabManager = require('./Grab')
var Fader = require('./fader')(THREE)
var Palette = require('./palette')
var Shapes = require('./shapes')
var TrackballControls = require('three-trackballcontrols')
WEBVR = require('./WEBVR')
var Tween = require('tween.js')
document.body.style.margin = 0

var camera, scene, renderer;
var effect, controls;
var controller1, controller2;
var grabManager;

var room;
var USE_HMD = false;

init();
animate();

function init() {
  container = document.createElement('div')
  document.body.appendChild(container)

  scene = new THREE.Scene()
  grabManager = new GrabManager({debug: true, scene: scene})

  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 10000)
  scene.add(camera)

  camera.position.z = -2
  camera.position.y = 2
  camera.x = 3

  room = new THREE.Mesh(
    new THREE.BoxGeometry(6, 6, 6, 10, 10, 10),
    new THREE.MeshBasicMaterial({color: 0x202020, wireframe: true})
  )

  room.position.y = 3
  scene.add(room)

  var sphere = new THREE.Mesh(
    new THREE.SphereGeometry(.3, 32, 32),
    new THREE.MeshPhongMaterial({color:0xcf32fa})
  )
  sphere.grabbable = true
  sphere.position.z = 1
  scene.add(sphere)
  scene.add(new THREE.HemisphereLight(0x404020, 0x202040, 1.0))
  var light = new THREE.DirectionalLight(0xffffff)
  light.position.set(10, 10, 10).normalize()
  scene.add(light)

  renderer = require('./renderer')
  container.appendChild(renderer.domElement)


  controls = new THREE.VRControls(camera)
  controls.standing = true

  var controllers = require('./setup-controllers')(controls, scene);
  controller1 = controllers[0]
  controller2 = controllers[1]
  grabManager.addController(controller1)

  var palette = new Palette(controller1)

  var fader = new Fader({type: 'cc', note: 22})
  scene.add(fader)

  if (!USE_HMD) {
    controls = new TrackballControls(camera)
  }

  if (USE_HMD) effect = new THREE.VREffect(renderer)
    document.body.appendChild(WEBVR.getButton(effect))
}

function animate(time) {
  requestAnimationFrame(animate)
  Tween.update(time)
  render()
}

function render() {
  controls.update()

  if (USE_HMD) {
    effect.render(scene, camera)
  } else {
    camera.position = controller1.position
    // camera.position.z -= 10
    // camera.lookAt(controller1)
    renderer.render(scene, camera)
  }
}
