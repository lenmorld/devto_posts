const WebSpeechApi = (function () {

	let synth = window.speechSynthesis;
	let voices = synth.getVoices();

	return {
		getVoices: function () {

		},

		speak: function (string, voice, pitch, rate) {
			if (synth.speaking) {
				console.error('🗣 already speaking');
				return;
			}

			if (string) {
				const utterThis = new SpeechSynthesisUtterance(string);

				utterThis.onend = () => console.log('speak finished');
				utterThis.onerror = () => console.log('speak error');

				const utterance = {
					voice: voice,
					pitch: pitch,
					rate: rate,
					// handlers
					onend: () => console.log('speak finished'),
					onerror: () => console.log('speak error'),
				};

				synth.speak(utterance);
			}
		}
	}

})();

export default WebSpeechApi;
