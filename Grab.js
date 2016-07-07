const GrabManager = function(params) {
  if (params == null) {
    console.error("GrabManager needs a params object with a scene at least")
  }
  this.scene = params.scene
  this.debug = params.debug
	this.controllers = []
	this.grabbables = []

  this.scene.addEventListener('addedChild', (e) => {
    var child = e.child
    if (child.grabbable) this.addGrabbable(child)
    child.traverse((c) => {
      if (c.grabbable) this.addGrabbable(c)
    })
  })

  if (this.debug) {
    this.boundUpdateDebugView = this.updateDebugView.bind(this)
    requestAnimationFrame(this.boundUpdateDebugView)
  }
}

GrabManager.prototype.addController = function(controller) {
	this.controllers.push(controller)
  window.controller = controller
  controller.on(controller.Gripped, this.onGrip.bind(this))
  controller.on(controller.Ungripped, this.onUngrip.bind(this))
  controller.cursor = new THREE.Mesh(
    new THREE.BoxGeometry(0.01, 0.01, 0.01),
    new THREE.MeshBasicMaterial()
  )
  controller.add(controller.cursor)
  controller.cursor.position.z = -.1
}

GrabManager.prototype.onGrip = function(controller) {
  console.log("Grip", controller)
  var cPos = controller.cursor.getWorldPosition()
  for (var i = 0; i < this.grabbables.length; i++) {
    var g = this.grabbables[i]
    if (g.helper.box.containsPoint(cPos)) {
      controller.grabbedObject = g
      g.originalParent = g.parent
      THREE.SceneUtils.detach(g, g.originalParent, this.scene)
      THREE.SceneUtils.attach(g, this.scene, controller)
    }
  }
}

GrabManager.prototype.onUngrip = function(controller) {
  console.log("Ungrip", controller.grabbedObject)
  var g = controller.grabbedObject
  if (g) {
    THREE.SceneUtils.detach(g, controller, this.scene)
    THREE.SceneUtils.attach(g, this.scene, g.originalParent)
  }
  controller.grabbedObject = null
}

GrabManager.prototype.addGrabbable = function(o) {
  if (this.grabbables.indexOf(o) != -1) return
	this.grabbables.push(o)
	o.helper = new THREE.BoundingBoxHelper(o, 0xff0000);
	this.scene.add(o.helper);
  console.log(this.grabbables)
}

GrabManager.prototype.updateDebugView = function() {
  requestAnimationFrame(this.boundUpdateDebugView)
  if (!this.debug) return
  this.grabbables.forEach((o) => {
    o.helper.update()
  })
}

module.exports = GrabManager
