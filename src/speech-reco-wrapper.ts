export interface SpeechRecoListener {
  onAudioStart?: (evt) => void;
  onAudioEnd?: (evt) => void;
  onEnd?: (evt) => void;
  onError?: (evt) => void;
  onNoMatch?: (evt) => void;
  onResult?: (evt) => void;
  onSoundStart?: (evt) => void;
  onSoundEnd?: (evt) => void;
  onSpeechStart?: (evt) => void;
  onSpeechEnd?: (evt) => void;
  onStart?: (evt) => void;
}

export class SpeechRecoWrapper {
  private readonly SpeechRecognition: any;
  private recognition;

  constructor(private listener: SpeechRecoListener) {
    this.SpeechRecognition = (<any>window).SpeechRecognition || (<any>window).webkitSpeechRecognition;
    if (!this.SpeechRecognition) {
      throw new Error("Unsupported Web Speech API.");
    }
  }

  initRecognition(): void {
    console.log("[SpeechRecoWrapper] initRecognition");
    this.recognition = new this.SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'ja-JP';

    const handlers = {
      onaudiostart: this.listener.onAudioStart,
      onaudioend: this.listener.onAudioEnd,
      onend: this.listener.onEnd,
      onerror: this.listener.onError,
      onnomatch: this.listener.onNoMatch,
      onresult: this.listener.onResult,
      onsoundstart: this.listener.onSoundStart,
      onsoundend: this.listener.onSoundEnd,
      onspeechstart: this.listener.onSpeechStart,
      onspeechend: this.listener.onSpeechEnd,
      onstart: this.listener.onStart
    };
    Object.keys(handlers).forEach(key => {
      if (!handlers[key]) {
        return;
      }

      this.recognition[key] = (evt) => {
        console.log(`[SpeechRecoWrapper] ${key}`);
        handlers[key](evt);
      }
    });
  }

  start(): void {
    console.log("[SpeechRecoWrapper] start");
    this.recognition.start();
  }

  stop(): void {
    console.log("[SpeechRecoWrapper] stop");
    this.recognition.stop();
  }

  restart(): void {
    console.log("[SpeechRecoWrapper] restart");
    this.stop();
    this.initRecognition();
    this.start();
  }
}
