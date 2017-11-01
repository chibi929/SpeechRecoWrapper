import { SpeechRecognitionWrapper } from './speech-recognition-wrapper';
const errorStateElement = document.getElementById('error-state');
const recoStateElement = document.getElementById('reco-state');
const interimElement = document.getElementById('interim-result');

const listener = {
  onStart: (evt) => {
    errorStateElement.innerHTML = "None"
    recoStateElement.innerHTML = "onStart";
  },
  onResult: (evt) => {
    recoStateElement.innerHTML = "onResult";

    for (var i = evt.resultIndex; i < evt.results.length; ++i) {
      const result = evt.results[i];
      if (result.isFinal) {
        interimElement.innerHTML = result[0].transcript;
      } else {
        interimElement.innerHTML = "[途中経過] " + result[0].transcript;
      }
    }
  },
  onEnd: (evt) => {
    recoStateElement.innerHTML = "onEnd";
  },
  onError: (evt) => {
    errorStateElement.innerHTML = evt.error;
    recoStateElement.innerHTML = "onError";
  }
}

try {
  const recognition = new SpeechRecognitionWrapper(listener);
  recognition.initRecognition();
  recognition.start();
} catch (e) {
  errorStateElement.innerHTML = e.message;
}
