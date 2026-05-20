class SoundManager {
    private static instance: SoundManager;
    private audioCtx: AudioContext | null = null;
    private isMuted: boolean = false;

    private constructor() {}

    public static getInstance(): SoundManager {
        if (!SoundManager.instance) {
            SoundManager.instance = new SoundManager();
        }
        return SoundManager.instance;
    }

    public init() {
        // AudioContext is created lazily on first user interaction
        // to comply with browser autoplay policies
    }

    private ensureContext(): AudioContext | null {
        if (!this.audioCtx) {
            try {
                this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            } catch (_e) {
                console.warn('Web Audio API not supported');
                return null;
            }
        }
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
        return this.audioCtx;
    }

    public playSound(key: string) {
        if (this.isMuted) return;
        const ctx = this.ensureContext();
        if (!ctx) return;

        if (key === 'correct') {
            this.playCorrectChime(ctx);
        } else if (key === 'wrong') {
            this.playWrongBuzz(ctx);
        }
    }

    /**
     * Correct: C-E-G chime (523.25, 659.25, 783.99 Hz)
     * Sine wave, gain 0.2, 0.3s each, 0.1s apart
     */
    private playCorrectChime(ctx: AudioContext) {
        const frequencies = [523.25, 659.25, 783.99];
        const now = ctx.currentTime;

        frequencies.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);

            gain.gain.setValueAtTime(0, now + i * 0.1);
            gain.gain.linearRampToValueAtTime(0.2, now + i * 0.1 + 0.02);
            gain.gain.setValueAtTime(0.2, now + i * 0.1 + 0.25);
            gain.gain.linearRampToValueAtTime(0, now + i * 0.1 + 0.3);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now + i * 0.1);
            osc.stop(now + i * 0.1 + 0.3);
        });
    }

    /**
     * Wrong: square wave 150Hz -> 100Hz, gain 0.3, 0.2s
     */
    private playWrongBuzz(ctx: AudioContext) {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(100, now + 0.2);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.setValueAtTime(0.3, now + 0.15);
        gain.gain.linearRampToValueAtTime(0, now + 0.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.2);
    }

    /**
     * Speak English text using the browser's Speech Synthesis API
     */
    public speak(text: string, rate: number = 0.9) {
        if (this.isMuted) return;
        if (!('speechSynthesis' in window)) return;

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = rate;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        // Try to find an English voice
        const voices = window.speechSynthesis.getVoices();
        const englishVoice = voices.find(v => v.lang.startsWith('en'));
        if (englishVoice) {
            utterance.voice = englishVoice;
        }

        window.speechSynthesis.speak(utterance);
    }

    public stopSpeech() {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
    }

    public toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted) {
            this.stopSpeech();
        }
    }

    public getMuted(): boolean {
        return this.isMuted;
    }
}

export const soundManager = SoundManager.getInstance();
