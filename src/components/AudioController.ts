/**
 * Procedural mechanical flap-clock click synthesizer using Web Audio API.
 * Synthesizes a crisp physical click (filtered noise burst + resonant low thump).
 * Zero external audio files, zero 404s, 100% synchronized.
 */
class AudioController {
  private ctx: AudioContext | null = null;
  private isEnabled: boolean = false;
  private lastPlayTime: number = 0;
  private readonly minIntervalMs: number = 40; // Polyphony limiter

  public initUserGesture(): void {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
    if (enabled) {
      this.initUserGesture();
    }
  }

  public getEnabled(): boolean {
    return this.isEnabled;
  }

  public toggle(): boolean {
    this.setEnabled(!this.isEnabled);
    return this.isEnabled;
  }

  public playFlapClick(): void {
    if (!this.isEnabled) return;
    this.initUserGesture();
    if (!this.ctx) return;

    const now = performance.now();
    if (now - this.lastPlayTime < this.minIntervalMs) return;
    this.lastPlayTime = now;

    try {
      const audioNow = this.ctx.currentTime;

      // 1. High-frequency snappy noise burst (the plastic/paper card slap)
      const bufferSize = this.ctx.sampleRate * 0.035; // 35ms burst
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const bandpass = this.ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      // Slight pitch randomization per flip
      bandpass.frequency.setValueAtTime(2800 + (Math.random() - 0.5) * 400, audioNow);
      bandpass.Q.setValueAtTime(2.2, audioNow);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.28, audioNow);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, audioNow + 0.035);

      noise.connect(bandpass);
      bandpass.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(audioNow);

      // 2. Low-frequency resonant body thump (the mechanical hinge frame resonance)
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();

      osc.type = 'triangle';
      const baseFreq = 140 + (Math.random() - 0.5) * 20;
      osc.frequency.setValueAtTime(baseFreq, audioNow);
      osc.frequency.exponentialRampToValueAtTime(45, audioNow + 0.045);

      oscGain.gain.setValueAtTime(0.35, audioNow);
      oscGain.gain.exponentialRampToValueAtTime(0.001, audioNow + 0.045);

      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);

      osc.start(audioNow);
      osc.stop(audioNow + 0.05);
    } catch {
      // AudioContext might be restricted until next interaction
    }
  }
}

export const audioController = new AudioController();
