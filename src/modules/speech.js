// src/modules/speech.js
// Text-to-Speech Funktionen.
// Shared state (_ttsVoices, _spokenForQuestion) liegt auf window damit
// Legacy-Code in index.html direkt darauf zugreifen kann.

let _ttsReady = false;

export function _initTTS() {
  if (!window.speechSynthesis) return;
  window._ttsVoices = window.speechSynthesis.getVoices();
  if (window._ttsVoices.length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      window._ttsVoices = window.speechSynthesis.getVoices();
      _ttsReady = true;
    };
  } else {
    _ttsReady = true;
  }
  // Warmup: unhörbaren Utterance abspielen damit die Engine geladen ist
  try {
    const warm = new SpeechSynthesisUtterance(' ');
    warm.volume = 0; warm.rate = 10;
    window.speechSynthesis.speak(warm);
  } catch(e) {}
}

export function speakWord(word, onDone) {
  if (!window.speechSynthesis || !word) return;
  window.speechSynthesis.cancel();
  if (!window._ttsVoices || window._ttsVoices.length === 0) {
    window._ttsVoices = window.speechSynthesis.getVoices();
  }
  const utt = new SpeechSynthesisUtterance(word);
  utt.lang = 'en-US'; utt.rate = 0.85; utt.pitch = 1.0;
  const preferred = window._ttsVoices.find(v => v.lang === 'en-US' && (v.name.includes('Google US') || v.name.includes('Samantha') || v.name.includes('Alex')))
    || window._ttsVoices.find(v => v.lang === 'en-US')
    || window._ttsVoices.find(v => v.lang.startsWith('en'));
  if (preferred) utt.voice = preferred;
  if (onDone) utt.onend = onDone;
  window.speechSynthesis.speak(utt);
}

export function speakWordOnce(word) {
  if (window._spokenForQuestion) return;
  window._spokenForQuestion = true;
  speakWord(word);
}

// TTS beim window.load initialisieren (Warmup für Desktop)
window.addEventListener('load', () => { _initTTS(); });

// Bei erstem Klick nochmal initialisieren (Mobile braucht User-Geste)
document.addEventListener('click', function _ttsWarmup() {
  _initTTS();
}, { once: true });
