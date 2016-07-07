var originalAdd = THREE.Object3D.prototype.add
THREE.Object3D.prototype.add = function(child) {
	originalAdd.call(this, child)
	this.dispatchEvent({type: "addedChild", child: child})
	this.traverseAncestors(function(a) {
		a.dispatchEvent({type: "addedChild", child: child})
	})
}
