import axios from 'axios';
import cheerio from 'cheerio';

import WebSpeechApi from './speech';

const speechApi = new WebSpeechApi();
let voices;

// init dom elements
const urlOrTextInput = document.querySelector('textarea');
const voiceSelect = document.querySelector('select');
const rateSlider = document.querySelector('#rate');
const pitchSlider = document.querySelector('#pitch');
const playButton = document.querySelector('#play');
const pauseButton = document.querySelector('#pause');
const stopButton = document.querySelector('#stop');

const rateValue = document.querySelector('.rate-value');
const pitchValue = document.querySelector('.pitch-value');

const getSelectedVoice = () => {
  const selectedOption = voiceSelect.selectedOptions[0].getAttribute(
    'data-name',
  );

  return voices.find(v => v.name === selectedOption);
};

const populateVoiceList = () => {
  const selectedIndex = voiceSelect.selectedIndex === -1 ? 0 : voiceSelect.selectedIndex;

  voiceSelect.innerHTML = '';

  voices.forEach((voice) => {
    const option = document.createElement('option');
    option.textContent = `${voice.name} (${voice.lang})`;

    if (voice.default) {
      option.textContent += ' -- DEFAULT';
    }

    option.setAttribute('data-lang', voice.lang);
    option.setAttribute('data-name', voice.name);

    voiceSelect.appendChild(option);
  });

  voiceSelect.selectedIndex = selectedIndex;
};

const getWebsiteTexts = siteUrl => new Promise((resolve, reject) => {
  axios
    .get(siteUrl)
    .then((result) => {
      const $ = cheerio.load(result.data);
      const contents = $('p, h1, h2, h3').contents(); // get all "readable" element contents

      const texts = contents
        .toArray()
        .map(p => p.data && p.data.trim())
        .filter(p => p);

      resolve(texts);
    })
    .catch((err) => {
      // handle err
      const errorObj = err.toJSON();
      alert(`${errorObj.message} on ${errorObj.config.url}\nPlease try a different website`);
      urlOrTextInput.value = '';
    });
});

const finishUtteranceCallback = () => {
  playButton.disabled = false;
  pauseButton.disabled = true;
  stopButton.disabled = true;

  rateSlider.disabled = false;
  pitchSlider.disabled = false;
};

const read = () => {
  const urlOrText = urlOrTextInput.value;
  let isUrl = false;

  // simple check if valid URL
  try {
    new URL(urlOrText);
    isUrl = true;
  } catch (error) {
    // not a URL, treat as string
    isUrl = false;
  }

  const voice = getSelectedVoice();

  if (isUrl) {
    getWebsiteTexts(urlOrText).then((texts) => {
      const allTextsWithPauseBetween = texts.join(' . ');
      speechApi.speak(
        allTextsWithPauseBetween,
        voice,
        pitchSlider.value,
        rateSlider.value,
        finishUtteranceCallback,
      );
    });
  } else {
    speechApi.speak(urlOrText, voice, pitchSlider.value, rateSlider.value, finishUtteranceCallback);
  }
};

// listeners
pitchSlider.onchange = function () {
  pitchValue.textContent = pitchSlider.value;
};

rateSlider.onchange = function () {
  rateValue.textContent = rateSlider.value;
};

playButton.addEventListener('click', () => {
  if (speechApi.synth.paused) {
    speechApi.synth.resume();
  } else {
    // start from beginning
    read();
  }

  playButton.disabled = true;
  pauseButton.disabled = false;
  stopButton.disabled = false;

  rateSlider.disabled = true;
  pitchSlider.disabled = true;
  pitchSlider.disabled = true;

  voiceSelect.disabled = true;
});

pauseButton.addEventListener('click', () => {
  speechApi.synth.pause();

  playButton.disabled = false;
  pauseButton.disabled = true;
  stopButton.disabled = false;

  rateSlider.disabled = true;
  pitchSlider.disabled = true;
  voiceSelect.disabled = true;
});

stopButton.addEventListener('click', () => {
  speechApi.synth.cancel();

  playButton.disabled = false;
  pauseButton.disabled = true;
  stopButton.disabled = true;

  rateSlider.disabled = false;
  pitchSlider.disabled = false;
  voiceSelect.disabled = false;
});

// FIRE
const fire = () => {
  speechApi.getVoices().then((_voices) => {
    voices = _voices;
    populateVoiceList();
  });
};

fire();

// chrome
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = fire;
}
