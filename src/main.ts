import { ISpeechRecoListener, SpeechRecoWrapper } from './speech-reco-wrapper';
const errorStateElement = document.getElementById('error-state');
const recoStateElement = document.getElementById('reco-state');
const interimElement = document.getElementById('interim-result');

const listener: ISpeechRecoListener = {
  onAudioStart: (evt: Event) => {
    console.log("CHIBI: onAudioStart");
  },
  onAudioEnd: (evt: Event) => {
    console.log("CHIBI: onAudioEnd");
  },
  onSoundStart: (evt: Event) => {
    console.log("CHIBI: onSoundStart");
  },
  onSpeechStart: (evt: Event) => {
    console.log("CHIBI: onSpeechStart");
  },
  onSpeechEnd: (evt: Event) => {
    console.log("CHIBI: onSpeechEnd");
  },
  onSoundEnd: (evt: Event) => {
    console.log("CHIBI: onSoundEnd");
  },
  onResult: (evt: SpeechRecognitionEvent) => {
    console.log("CHIBI: onResult");
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
  onNoMatch: (evt: SpeechRecognitionEvent) => {
    console.log("CHIBI: onNoMatch");
  },
  onError: (evt: SpeechRecognitionError) => {
    console.log("CHIBI: onError");
    errorStateElement.innerHTML = evt.error;
    recoStateElement.innerHTML = "onError";
  },
  onStart: (evt: Event) => {
    console.log("CHIBI: onStart");
    errorStateElement.innerHTML = "None"
    recoStateElement.innerHTML = "onStart";
  },
  onEnd: (evt: Event) => {
    console.log("CHIBI: onEnd");
    recoStateElement.innerHTML = "onEnd";
  },
}

try {
  const recognition = new SpeechRecoWrapper(listener);
  recognition.initRecognition();
  recognition.start();
} catch (e) {
  errorStateElement.innerHTML = e.message;
}
