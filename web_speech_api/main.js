import axios from 'axios';
import cheerio from 'cheerio';

import WebSpeechApi from './speech';

const speechApi = new WebSpeechApi();
const voices = speechApi.getVoices();

// init dom elements
const siteUrlInput = document.querySelector('#siteUrlInput');
const voiceSelect = document.querySelector('select');
const rateSlider = document.querySelector('#rate');
const pitchSlider = document.querySelector('#pitch');
const playButton = document.querySelector('#play');

const rateValue = document.querySelector('.rate-value');
const pitchValue = document.querySelector('.pitch-value');

const getSelectedVoice = () => {
  const selectedOption = voiceSelect.selectedOptions[0].getAttribute(
    'data-name',
  );

  return voices.find((v) => v.name === selectedOption);
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

const getWebsiteTexts = (siteUrl) => new Promise((resolve, reject) => {
  axios
    .get(siteUrl)
    .then((result) => {
      const $ = cheerio.load(result.data);
      const contents = $('p, h1, h2, h3').contents(); // get all <p> contents

      const texts = contents
        .toArray()
        .map((p) => p.data && p.data.trim())
        .filter((p) => p);

      resolve(texts);
    })
    .catch((err) => reject(err));
});

const read = () => {
  const url = siteUrlInput.value;

  // simple check if valid URL
  try {
    new URL(url);
  } catch (error) {
    console.error('not valid URL!');
    return;
  }

  const voice = getSelectedVoice();

  getWebsiteTexts(url).then((texts) => {
    const allTextsWithPauseBetween = texts.join(' . ');
    speechApi.speak(allTextsWithPauseBetween, voice, pitchSlider.value, rateSlider.value);
  });
};

// listeners
if (speechApi.onvoiceschanged !== undefined) {
  speechApi.onvoiceschanged = populateVoiceList;
}

pitchSlider.onchange = function () {
  pitchValue.textContent = pitchSlider.value;
};

rateSlider.onchange = function () {
  rateValue.textContent = rateSlider.value;
};

playButton.addEventListener('click', () => {
  read();
});

// FIRE
populateVoiceList();

// TODO

// pause, play, restart
