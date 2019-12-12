class WebSpeechApi {
  constructor() {
    this.synth = window.speechSynthesis;
    this.voices = this.synth.getVoices();
  }

  getVoices() {
    return this.voices;
  }

  speak(string, voice, pitch, rate) {
    if (this.synth.speaking) {
      console.error('🗣 already speaking');
      return;
    }

    if (string) {
      const utterance = new SpeechSynthesisUtterance(string);

      utterance.onend = () => console.log('speak finished');
      utterance.onerror = () => console.log('speak error');

      utterance.voice = voice;
      utterance.pitch = pitch;
      utterance.rate = rate;

      this.synth.speak(utterance);
    }
  }
}

export default WebSpeechApi;
