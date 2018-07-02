export interface ISpeechRecoListener {
  /**
   * オーディオのキャプチャを開始したときのイベント
   */
  onAudioStart?: (evt: Event) => any;

  /**
   * オーディオのキャプチャを終了したときのイベント
   */
  onAudioEnd?: (evt: Event) => any;

  /**
   * 音声認識サービスが切断されたときのイベント
   */
  onEnd?: (evt: Event) => any;

  /**
   * 音声認識エラーが発生したときのイベント
   */
  onError?: (evt: SpeechRecognitionError) => any;

  /**
   * 音声認識サービスが有意な認識無しに最終結果を返すときのイベント
   */
  onNoMatch?: (evt: SpeechRecognitionEvent) => any;

  /**
   * 音声認識サービスが結果を返すときのイベント
   * 単語やフレーズが確実に認識され、これがアプリに返されます
   */
  onResult?: (evt: SpeechRecognitionEvent) => any;

  /**
   * 音声認識可能な発話かどうかが検出されたときのイベント
   */
  onSoundStart?: (evt: Event) => any;

  /**
   * 音声認識可能な発話かどうかが検出されなくなったときのイベント
   */
  onSoundEnd?: (evt: Event) => any;

  /**
   * 音声認識サービスによって音声が検出されたときのイベント
   */
  onSpeechStart?: (evt: Event) => any;

  /**
   * 音声認識サービスによって音声が検出されなくなったときのイベント
   */
  onSpeechEnd?: (evt: Event) => any;

  /**
   * 音声認識サービスが開始したときのイベント
   */
  onStart?: (evt: Event) => any;
}

/**
 * SpeechRecognition のラッパークラス
 */
export class SpeechRecoWrapper {
  private readonly SpeechRecognitionStatic: any;
  private recognition: SpeechRecognition;

  /**
   * コンストラクタ
   * @param listener コールバック用リスナー
   * @param autoRestart 自動リスタートフラグ
   */
  constructor(
    private readonly listener: ISpeechRecoListener,
    private readonly autoRestart: boolean = false
  ) {
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
      onaudiostart: (evt: Event) => {
        console.log("[SpeechRecoWrapper] onaudiostart");
        this.listener.onAudioStart && this.listener.onAudioStart(evt);
      },
      onaudioend: (evt: Event) => {
        console.log("[SpeechRecoWrapper] onaudioend");
        this.listener.onAudioEnd && this.listener.onAudioEnd(evt);
      },
      onend: (evt: Event) => {
        console.log("[SpeechRecoWrapper] onend");
        this.listener.onEnd && this.listener.onEnd(evt);
      },
      onerror: (evt: SpeechRecognitionError) => {
        console.log("[SpeechRecoWrapper] onerror");
        this.listener.onError && this.listener.onError(evt);
        if (this.autoRestart) {
          this.restart(500);
        }
      },
      onnomatch: (evt: SpeechRecognitionEvent) => {
        console.log("[SpeechRecoWrapper] onnomatch");
        this.listener.onNoMatch && this.listener.onNoMatch(evt);
      },
      onresult: (evt: SpeechRecognitionEvent) => {
        console.log("[SpeechRecoWrapper] onresult");
        this.listener.onResult && this.listener.onResult(evt);
        if (this.autoRestart) {
          for (var i = evt.resultIndex; i < evt.results.length; ++i) {
            const result = evt.results[i];
            if (result.isFinal) {
              this.restart(500);
            }
          }
        }
      },
      onsoundstart: (evt: Event) => {
        console.log("[SpeechRecoWrapper] onsoundstart");
        this.listener.onSoundStart && this.listener.onSoundStart(evt);
      },
      onsoundend: (evt: Event) => {
        console.log("[SpeechRecoWrapper] onsoundend");
        this.listener.onSoundEnd && this.listener.onSoundEnd(evt);
        if (this.autoRestart) {
          this.restart(500);
        }
      },
      onspeechstart: (evt: Event) => {
        console.log("[SpeechRecoWrapper] onspeechstart");
        this.listener.onSpeechStart && this.listener.onSpeechStart(evt);
      },
      onspeechend: (evt: Event) => {
        console.log("[SpeechRecoWrapper] onspeechend");
        this.listener.onSpeechEnd && this.listener.onSpeechEnd(evt);
      },
      onstart: (evt: Event) => {
        console.log("[SpeechRecoWrapper] onstart");
        this.listener.onStart && this.listener.onStart(evt);
      }
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
   * SpeechRecognition を再起動
   * @param delay 遅延時間
   */
  restart(delay: number = 0): void {
    console.log(`[SpeechRecoWrapper] restart: delay = "${delay}"`);
    setTimeout(() => {
      this.stop();
      this.initRecognition();
      this.start();
    }, delay);
  }
}
