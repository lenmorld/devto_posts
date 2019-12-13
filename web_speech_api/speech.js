class WebSpeechApi {
  constructor() {
    this.synth = window.speechSynthesis;
  }

  getVoices() {
    // return this.voices;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const voices = this.synth.getVoices();
          resolve(voices);
        } catch (error) {
          reject(error);
        }
      }, 100);
    });
  }

  speak(string, voice, pitch, rate, finishUtteranceCallback) {
    if (this.synth.speaking) {
      console.error('🗣 already speaking');
      return;
    }

    if (string) {
      const utterance = new SpeechSynthesisUtterance(string);

      // https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance
      utterance.onstart = () => console.log('utterance started');
      utterance.onpause = () => console.log('utterance pause');
      utterance.onresume = () => console.log('utterance resume');
      utterance.onend = () => {
        console.log('utterance end');

        finishUtteranceCallback();
      };
      utterance.onerror = () => console.log('utterance error');

      utterance.voice = voice;
      utterance.pitch = pitch;
      utterance.rate = rate;

      //   debugger;
      this.synth.speak(utterance);
    }
  }
}

export default WebSpeechApi;
