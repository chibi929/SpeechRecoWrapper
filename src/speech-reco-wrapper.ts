export interface ISpeechRecoListener {
  onAudioStart?: (evt: Event) => any;
  onAudioEnd?: (evt: Event) => any;
  onSoundStart?: (evt: Event) => any;
  onSpeechStart?: (evt: Event) => any;
  onSpeechEnd?: (evt: Event) => any;
  onSoundEnd?: (evt: Event) => any;
  onResult?: (evt: SpeechRecognitionEvent) => any;
  onNoMatch?: (evt: SpeechRecognitionEvent) => any;
  onError?: (evt: SpeechRecognitionError) => any;
  onStart?: (evt: Event) => any;
  onEnd?: (evt: Event) => any;
}

export class SpeechRecoWrapper {
  private readonly SpeechRecognitionStatic: any;
  private recognition: SpeechRecognition;

  constructor(private listener: ISpeechRecoListener) {
    this.SpeechRecognitionStatic = window["SpeechRecognition"] || window["webkitSpeechRecognition"];
    if (!this.SpeechRecognitionStatic) {
      throw new Error("Unsupported Web Speech API.");
    }
  }

  initRecognition(): void {
    console.log("[SpeechRecoWrapper] initRecognition");
    this.recognition = new this.SpeechRecognitionStatic();
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
