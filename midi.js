class MIDI {
	constructor() {
		if (navigator.requestMIDIAccess) {
			navigator.requestMIDIAccess({}).then(this.onAccess.bind(this))
		} else {
			alert("No MIDI Support")
		}
	}

	onAccess(midiAccess) {
		this.midiAccess = midiAccess
		this.output = midiAccess.outputs.values().next().value
		window.output = this.output
	}

	onFailure(e) {
		console.log("Could not get access to midi")
	}

	send(note, value) {
		this.output.send([note, value, 0])
	}


}

module.exports = MIDI
