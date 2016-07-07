const SLIDER_MAX = 30
const SLIDER_MIN = 0
var MIDI = require('webmidi')
window.MIDI = MIDI
module.exports = function(THREE) {
    class Fader extends THREE.Object3D {
        constructor() {
            super()
            MIDI.enable((e) => {
                if (e) {
                    alert("No midi available", e)
                }
            })
            // this.midi = new MIDI()
            this.scale.set(0.1, 0.1, 0.1)
            var modelPath = 'assets/fader.obj'

            var mtlLoader = new THREE.MTLLoader()
            mtlLoader.setPath('assets/')
            mtlLoader.load('fader.mtl', (materials) => {
                materials.preload()
                var objLoader = new THREE.OBJLoader()
                objLoader.setMaterials(materials)
                objLoader.setPath('assets/')
                objLoader.load('fader.obj', (object) => {
                    this.add(object)
                    this.slider = object.children.filter((child) => {
                        return child.name == 'Cube.001_Cube.002'
                    })[0]
                    window.slider = this.slider
                })
            })

            document.body.addEventListener('keydown', (e) => {

                if (e.keyCode == 38) { // up
                    this.moveSlider(1.5)
                    e.preventDefault()
                } else if (e.keyCode == 40) { //down
                    this.moveSlider(-1.5)
                    e.preventDefault()
                }
            })
        }

        moveSlider(delta) {
            this.slider.position.y += delta
            this.slider.position.y = Math.clamp(this.slider.position.y, SLIDER_MIN, SLIDER_MAX)

            MIDI.outputs[0].sendControlChange(22, 127 * this.slider.position.y / SLIDER_MAX, "all")
        }
    }

    return Fader
}
