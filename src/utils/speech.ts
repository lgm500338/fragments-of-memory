/**
 * Web Speech API Integration:
 * 1. Speech-to-Text (STT) for voice input
 * 2. Text-to-Speech (TTS) for AI voice reading aloud
 * Works 100% natively in browsers without external API keys or server costs.
 */

interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export class SpeechHandler {
  private recognition: any = null;
  private isListening: boolean = false;
  private isSTTSupported: boolean = false;
  private isTTSSupported: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const win = window as IWindow;
      const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;
      if (SpeechRecognitionClass) {
        this.recognition = new SpeechRecognitionClass();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.isSTTSupported = true;
      }
      this.isTTSSupported = 'speechSynthesis' in window;
    }
  }

  public getIsSTTSupported(): boolean {
    return this.isSTTSupported;
  }

  public getIsListening(): boolean {
    return this.isListening;
  }

  // Speech-to-Text (Voice input)
  public startListening(
    lang: 'ko' | 'en',
    onResult: (transcript: string) => void,
    onError?: (errorMsg: string) => void
  ) {
    if (!this.recognition) {
      if (onError) {
        onError(
          lang === 'ko'
            ? '이 환경에서는 마이크 인식이 제한되어 있습니다. 키보드로 입력해 주세요.'
            : 'Microphone recognition is restricted in this frame. Please type your answer.'
        );
      }
      return;
    }

    try {
      this.recognition.lang = lang === 'ko' ? 'ko-KR' : 'en-US';

      this.recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript.trim()) {
          onResult(transcript.trim());
        }
      };

      this.recognition.onerror = (event: any) => {
        this.isListening = false;
        if (onError) {
          if (event.error === 'not-allowed') {
            onError(
              lang === 'ko'
                ? '브라우저 상단의 마이크 권한을 허용해 주세요.'
                : 'Please allow microphone access in your browser.'
            );
          } else {
            onError(
              lang === 'ko'
                ? '음성을 인식하지 못했습니다. 다시 시도해 주세요.'
                : 'Could not capture speech. Please try again.'
            );
          }
        }
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };

      this.recognition.start();
      this.isListening = true;
    } catch {
      this.isListening = false;
      if (onError) {
        onError(
          lang === 'ko'
            ? '마이크 권한을 확인해 주세요.'
            : 'Please check microphone permissions.'
        );
      }
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch {}
      this.isListening = false;
    }
  }

  // Text-to-Speech (AI Reads Sentence Aloud)
  public speakText(text: string, lang: 'ko' | 'en', onEnd?: () => void) {
    if (!this.isTTSSupported || typeof window === 'undefined') return;

    try {
      window.speechSynthesis.cancel(); // Stop any previous speech

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'ko' ? 'ko-KR' : 'en-US';
      utterance.rate = 0.88; // Calm, clear, storytelling pace
      utterance.pitch = 1.0;

      // Select natural voice if available
      const voices = window.speechSynthesis.getVoices();
      const targetLang = lang === 'ko' ? 'ko' : 'en';
      const preferredVoice = voices.find((v) => v.lang.startsWith(targetLang));
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      if (onEnd) {
        utterance.onend = onEnd;
      }

      window.speechSynthesis.speak(utterance);
    } catch {
      // Speech synthesis fallback
    }
  }

  public stopSpeaking() {
    if (this.isTTSSupported && typeof window !== 'undefined') {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
  }
}

export const speechHandler = new SpeechHandler();
