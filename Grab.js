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
  controller.on(controller.Gripped, this.onGrip.bind(this))
}

GrabManager.prototype.onGrip = function(controller) {
  console.log("Grip")
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
