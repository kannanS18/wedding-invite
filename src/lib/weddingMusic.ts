/**
 * Global Wedding Music Service
 * - Controls playback of "Dumm Dumm" (Darbar) celebratory wedding song.
 * - Set to 70% mid-range volume (0.70) by default.
 * - Always unmuted by default (muted is strictly false).
 * - Synchronizes with the preloaded DOM <audio id="wedding-music-element">.
 */

type Listener = () => void;

class WeddingMusicManager {
  private audio: HTMLAudioElement | null = null;
  private isMuted: boolean = false;
  private isPlaying: boolean = false;
  private userMutedManually: boolean = false;
  private listeners: Set<Listener> = new Set();
  public readonly TARGET_VOLUME = 0.70;

  constructor() {
    if (typeof window !== 'undefined') {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.init());
      } else {
        this.init();
      }
    }
  }

  private init() {
    try {
      let el = document.getElementById('wedding-music-element') as HTMLAudioElement | null;
      if (!el) {
        el = document.createElement('audio');
        el.id = 'wedding-music-element';
        el.src = `${import.meta.env.BASE_URL}audio/wedding_music.mp3`;
        el.preload = 'auto';
        el.loop = true;
        el.setAttribute('playsinline', '');
        el.setAttribute('autoplay', '');
        document.body.appendChild(el);
      }
      this.audio = el;
      this.audio.volume = this.TARGET_VOLUME;
      this.audio.muted = false;

      // Event listeners on audio element
      this.audio.addEventListener('play', () => {
        this.isPlaying = true;
        this.notify();
      });

      this.audio.addEventListener('playing', () => {
        this.isPlaying = true;
        this.notify();
      });

      this.audio.addEventListener('pause', () => {
        this.isPlaying = false;
        this.notify();
      });

      // When audio is ready, volume is primed
      this.audio.addEventListener('canplay', () => {
        if (this.audio) {
          this.audio.volume = this.TARGET_VOLUME;
        }
      });

      // Listen for deliberate user interactions to unlock audio playback
      // (mobile browsers require a user gesture to start audio)
      // Only listen for discrete gesture events — NOT mousemove/pointermove/scroll
      // which fire hundreds of times per second and spam audio.play() calls
      const tryPlayOnInteraction = () => {
        if (this.userMutedManually) return;
        this.play().then((started) => {
          if (started) {
            removeListeners();
          }
        });
      };

      const removeListeners = () => {
        const events = ['touchstart', 'pointerdown', 'click', 'keydown'];
        events.forEach((evt) => {
          window.removeEventListener(evt, tryPlayOnInteraction, true);
          document.removeEventListener(evt, tryPlayOnInteraction, true);
        });
      };

      const events = ['touchstart', 'pointerdown', 'click', 'keydown'];
      events.forEach((evt) => {
        window.addEventListener(evt, tryPlayOnInteraction, { capture: true, passive: true, once: true });
        document.addEventListener(evt, tryPlayOnInteraction, { capture: true, passive: true, once: true });
      });

      // Tab visibility
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          if (this.audio && !this.audio.paused) {
            this.audio.pause();
          }
        } else {
          if (this.audio && !this.userMutedManually && !this.isMuted) {
            this.play();
          }
        }
      });
    } catch (e) {
      console.warn('WeddingMusicManager init notice:', e);
    }
  }

  public async play(): Promise<boolean> {
    if (!this.audio) return false;
    if (this.userMutedManually) return false;

    try {
      this.audio.volume = this.TARGET_VOLUME;
      this.audio.muted = false;
      const p = this.audio.play();
      if (p !== undefined) {
        await p;
        this.isPlaying = true;
        this.isMuted = false;
        this.notify();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }


  public pause(): void {
    if (this.audio) {
      this.audio.pause();
      this.isPlaying = false;
      this.notify();
    }
  }

  public toggle(): void {
    if (!this.audio) return;

    if (!this.isMuted && this.isPlaying) {
      // User explicitly clicked to mute
      this.userMutedManually = true;
      this.isMuted = true;
      this.pause();
    } else {
      // User clicked to unmute
      this.userMutedManually = false;
      this.isMuted = false;
      this.audio.muted = false;
      this.audio.volume = this.TARGET_VOLUME;
      this.play();
    }
    this.notify();
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public subscribe(cb: Listener): () => void {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  }

  private notify(): void {
    this.listeners.forEach((cb) => {
      try {
        cb();
      } catch (e) {
        console.error('Music subscriber error:', e);
      }
    });
  }
}

export const weddingMusic = new WeddingMusicManager();
