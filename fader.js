const SLIDER_MAX = 30
const SLIDER_MIN = 0
var MIDI = require('webmidi')
window.MIDI = MIDI
module.exports = function(THREE) {
    class Fader extends THREE.Object3D {
        constructor(params) {
            if (!params) {
                console.error("Fader needs a params object with the properties type:'note|cc' and note:notenumber")
            }
            super(params)
            this.type = params.type
            this.note = params.note
            this.name = "Fader"
            MIDI.enable((e) => {
                if (e) {
                    alert("No midi available", e)
                }
            })
            // this.midi = new MIDI()
            this.scale.set(0.01, 0.01, 0.01)
            var modelPath = 'assets/fader.obj'

            var mtlLoader = new THREE.MTLLoader()
            mtlLoader.setPath('assets/')
            mtlLoader.load('fader.mtl', (materials) => {
                materials.preload()
                var objLoader = new THREE.OBJLoader()
                objLoader.setMaterials(materials)
                objLoader.setPath('assets/')
                objLoader.load('fader.obj', (object) => {
                    this.slider = object.children.filter((child) => {
                        return child.name == 'Cube.001_Cube.002'
                    })[0]
                    this.slider.grabbable = true
                    this.slider.name = "Slider"
                    this.name = "Fader"
                    this.add(object)
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
            if (this.type == 'cc')
                MIDI.outputs[0].sendControlChange(this.note, 127 * this.slider.position.y / SLIDER_MAX, "all")
            else if (this.type == 'note')
                MIDI.outputs[0].noteOn(this.note, 127 * this.slider.position.y / SLIDER_MAX, "all")
        }
    }

    return Fader
}
