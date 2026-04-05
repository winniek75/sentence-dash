import { Howl, Howler } from 'howler';

class SoundManager {
    private static instance: SoundManager;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private sounds: { [key: string]: any } = {};

    private isMuted: boolean = false;

    private constructor() {}

    public static getInstance(): SoundManager {
        if (!SoundManager.instance) {
            SoundManager.instance = new SoundManager();
        }
        return SoundManager.instance;
    }

    public init() {
        // For MVP, use real Howl objects but with empty src (silent)
        // Replace with actual audio file paths later
        const silentSrc = ['data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjMyLjEwNAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAEAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV6urq6urq6urq6urq6urq6urq6urq6urq6v////////////////////////////////8AAAAATGF2YzU4LjU0AAAAAAAAAAAAAAAAJAAAAAAAAAAAASDs90hvAAAAAAAAAAAAAAAAAAAA//MUxAAHqAJATQhAAG11AAAATAAA'];
        this.sounds['correct'] = new Howl({ src: silentSrc, volume: 0.5 });
        this.sounds['wrong'] = new Howl({ src: silentSrc, volume: 0.5 });
        this.sounds['start'] = new Howl({ src: silentSrc, volume: 0.7 });
    }

    public playSound(key: string) {
        if (this.isMuted) return;
        if (this.sounds[key]) {
            this.sounds[key].play();
        }
    }

    public toggleMute() {
        this.isMuted = !this.isMuted;
        Howler.mute(this.isMuted);
    }
}

export const soundManager = SoundManager.getInstance();
