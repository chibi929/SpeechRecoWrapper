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

/**
 * SpeechRecognition のラッパークラス
 */
export class SpeechRecoWrapper {
  private readonly SpeechRecognitionStatic: any;
  private recognition: SpeechRecognition;

  constructor(private readonly listener: ISpeechRecoListener) {
    this.SpeechRecognitionStatic = window["SpeechRecognition"] || window["webkitSpeechRecognition"];
    if (!this.SpeechRecognitionStatic) {
      throw new Error("Unsupported Web Speech API.");
    }
  }

  /**
   * SpeechRecognition を初期化する
   *
   * @param continuous 音声認識を連続で行うかどうか
   * @param interimResults 途中経過も認識させるかどうか
   * @param lang 認識対象言語
   */
  initRecognition(
    continuous: boolean = true,
    interimResults: boolean = true,
    lang: string = 'ja-JP'
  ): void {
    console.log("[SpeechRecoWrapper] initRecognition");

    // 初期化
    this.recognition = new this.SpeechRecognitionStatic();
    this.recognition.continuous = continuous;
    this.recognition.interimResults = interimResults;
    this.recognition.lang = lang;

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

    // ハンドラーの登録
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

  /**
   * SpeechRecognition を開始する
   */
  start(): void {
    console.log("[SpeechRecoWrapper] start");
    this.recognition.start();
  }

  /**
   * SpeechRecognition を停止する
   */
  stop(): void {
    console.log("[SpeechRecoWrapper] stop");
    this.recognition.stop();
  }

  /**
   * SpeechRecognition を再起動する
   */
  restart(): void {
    console.log("[SpeechRecoWrapper] restart");
    this.stop();
    this.initRecognition();
    this.start();
  }
}
