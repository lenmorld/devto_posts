import axios from 'axios';
import cheerio from 'cheerio';

import WebSpeechApi from './speech';

// let siteUrlInput, voiceSelect, rateSlider, pitchSlider;

// let synth, voices;

// const cacheDom = () => {
let siteUrlInput = document.querySelector('#siteUrlInput');
let voiceSelect = document.querySelector('select');
let rateSlider = document.querySelector('#rate');
let pitchSlider = document.querySelector('#pitch');
// }


// const initSpeech = () => {
// synth = window.speechSynthesis;
// voices = synth.getVoices();
// }

const populateVoiceList = () => {
	const selectedIndex = voiceSelect.selectedIndex === -1 ? 0 : voiceSelect.selectedIndex;

	voiceSelect.innerHTML = '';

	voices.forEach(voice => {
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
}

const getWebsiteTexts = siteUrl => new Promise((resolve, reject) => {
	axios.get(siteUrl).then((result) => {
		const $ = cheerio.load(result.data);
		const contents = $('p, h1, h2, h3').contents(); // get all <p> contents

		const texts = contents.toArray().map(p => p.data && p.data.trim()).filter(p => p);

		resolve(texts);
	}).catch(err => reject(err));
});

const speak

// START

populateVoiceList();

// bind listeners
if (synth.onvoiceschanged) {
	synth.onvoiceschanged = populateVoiceList;
}

const siteUrl = "https://dev.to/chrisrhymes/creating-my-first-npm-package-4o41";

getWebsiteTexts(siteUrl).then(texts => {
	texts.forEach(text => console.log(text));
});


