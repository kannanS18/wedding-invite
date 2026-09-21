import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CLOCK_CONFIG } from './config';
import { useQualityTier } from './hooks/useQualityTier';
import { useTiltInput } from './hooks/useTiltInput';
import { Scene } from './components/Scene';
import { Overlay } from './components/Overlay';
import { VideoSection } from './components/VideoSection';
import { InvitationSection } from './components/InvitationSection';
import { PhotoGallerySection } from './components/PhotoGallerySection';
import { VenueSection } from './components/VenueSection';
import { BackgroundMusicPlayer } from './components/BackgroundMusicPlayer';
import { InvitationPreloader } from './components/InvitationPreloader';
import { weddingMusic } from './lib/weddingMusic';
import { ensureFontsLoaded, preheatDigitTextures } from './lib/digitTextures';

function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = (canvas.getContext('webgl2') || canvas.getContext('webgl')) as WebGLRenderingContext | null;
    if (!gl) return false;
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
}

export const App: React.FC = () => {
  const quality = useQualityTier(CLOCK_CONFIG.quality);
  const { tiltRef, isGyroPermissionNeeded, requestGyroPermission } = useTiltInput();

  const [isAssetsLoaded, setIsAssetsLoaded] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);

  // Preloader State
  const [isPreloading, setIsPreloading] = useState(true);
  const [videoSrc, setVideoSrc] = useState(`${import.meta.env.BASE_URL}intro_v2.mp4`);

  // Section visibility & 3D Flip Cascade triggers
  const [isDateSectionVisible, setIsDateSectionVisible] = useState(false);
  const [isAnimationTriggered, setIsAnimationTriggered] = useState(false);
  const [flipSessionKey, setFlipSessionKey] = useState(0);

  const videoSectionRef = useRef<HTMLDivElement>(null);
  const invitationSectionRef = useRef<HTMLDivElement>(null);
  const revealSectionRef = useRef<HTMLElement>(null);
  const gallerySectionRef = useRef<HTMLDivElement>(null);
  const venueSectionRef = useRef<HTMLDivElement>(null);

  // Initial WebGL and typography preparation
  useEffect(() => {
    setWebglSupported(isWebGLAvailable());
    ensureFontsLoaded().then(() => {
      preheatDigitTextures().then(() => {
        setIsAssetsLoaded(true);
      });
    });
  }, []);

  const warmup3DAssets = useCallback(() => {
    ensureFontsLoaded()
      .then(() => preheatDigitTextures())
      .finally(() => {
        setIsAssetsLoaded(true);
      });
  }, []);

  // IntersectionObserver: Trigger 3D flip cascade ONLY when user scrolls down to the Date section
  useEffect(() => {
    const target = revealSectionRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            warmup3DAssets();
            setIsDateSectionVisible(true);
            // Delay 300ms so the user comfortably sees the cards begin flipping from empty/current date
            setTimeout(() => {
              setIsAnimationTriggered(true);
            }, 300);
          }
        });
      },
      {
        rootMargin: '250px', // Pre-mount smoothly 250px before scrolling into view
        threshold: 0.15,
      }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [isAssetsLoaded, flipSessionKey, warmup3DAssets]);

  // Smooth scroll to Section 2 (Invitation & Couple)
  const handleScrollToInvitation = useCallback(() => {
    warmup3DAssets();
    if (invitationSectionRef.current) {
      invitationSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [warmup3DAssets]);

  // Smooth scroll to Section 3 (Date Reveal)
  const handleScrollToDate = useCallback(() => {
    if (revealSectionRef.current) {
      revealSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Replay 3D flip animation
  const handleReplayFlip = useCallback(() => {
    setIsAnimationTriggered(false);
    setFlipSessionKey((prev) => prev + 1);
    setTimeout(() => {
      setIsAnimationTriggered(true);
    }, 150);
  }, []);

  // Handle preloader completion: start video from RAM Blob URL & audio immediately
  const handlePreloadComplete = useCallback((blobUrl?: string) => {
    if (blobUrl) {
      setVideoSrc(blobUrl);
    }
    setIsPreloading(false);
    weddingMusic.play().catch(() => {});
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        backgroundColor: CLOCK_CONFIG.colors.background,
        overflowX: 'hidden',
      }}
    >
      {/* ══════════════════════════════════════════════════════════════
          ROYAL INVITATION PRELOADER (LOADS 100% INTO CACHE)
          - Cultural Thamboolam plate presentation (Vethalai, Diya, Letter)
          - Pre-buffers 100% of video and audio into memory
          - Smooth handover: starts video & audio simultaneously!
          ══════════════════════════════════════════════════════════════ */}
      {isPreloading && (
        <InvitationPreloader onComplete={handlePreloadComplete} />
      )}

      {/* ══════════════════════════════════════════════════════════════
          BACKGROUND WEDDING MUSIC & FLOATING MUTE CONTROLLER
          - Plays festive celebratory wedding song ("Dumm Dumm" - Darbar)
          - Autoplays smoothly or unlocks immediately on first user touch/scroll
          - Persistent floating gold badge with vinyl animation & equalizer bars
          ══════════════════════════════════════════════════════════════ */}
      <BackgroundMusicPlayer />

      {/* ══════════════════════════════════════════════════════════════
          SECTION 1: FULLSCREEN VIDEO INTRO
          - Muted video, plays once from cached stream.
          - Freezes on the last frame once ended; NEVER removed.
          - NO auto-scroll! Scroll is unlocked and glowing widget appears
            saying "✦ WEDDING INVITATION ✦ ↓ SCROLL DOWN ↓".
          ══════════════════════════════════════════════════════════════ */}
      <div ref={videoSectionRef}>
        <VideoSection
          videoSrc={videoSrc}
          isActive={!isPreloading}
          onVideoEnd={warmup3DAssets}
          onScrollToReveal={handleScrollToInvitation}
        />
      </div>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 2: ROYAL INVITATION & COUPLE REVEAL (BEFORE DATE)
          - 3D royal card unfold with couple hero portrait.
          - Auspicious blessings, heartfelt story & formal invite text.
          - Animates cleanly when scrolled into view.
          - Button navigates to Section 3 (Date Reveal).
          ══════════════════════════════════════════════════════════════ */}
      <div ref={invitationSectionRef}>
        <InvitationSection onScrollToDate={handleScrollToDate} />
      </div>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 3: 3D SPLIT-FLAP DATE REVEAL (DATE SECTION)
          - Three.js photorealistic split-flap clock with gold rim kicks.
          - Cards start completely empty, then dynamically tumble forward
            from the real current date (new Date()) to SUN • 25 • OCT • 2026.
          - 50/50 vertical text split, large bold numbers, full 180° complete flip.
          - Animation triggers ONLY when scrolled into this section.
          ══════════════════════════════════════════════════════════════ */}
      <section
        ref={revealSectionRef}
        id="revealSection"
        style={{
          position: 'relative',
          width: '100vw',
          minHeight: '100dvh',
          overflow: 'hidden',
          backgroundColor: CLOCK_CONFIG.colors.background,
          background: 'radial-gradient(circle at 50% 35%, #FFFDF9 0%, #FAF7F2 60%, #F0E8DC 100%)',
        }}
      >
        {/* 3D Photorealistic Three.js Scene: mounted reliably so it is immediately ready when scrolled to */}
        {!isPreloading && webglSupported && (
          <Scene
            key={flipSessionKey}
            startAnimation={isAnimationTriggered && isDateSectionVisible}
            quality={quality}
            tiltRef={tiltRef}
            isVisible={isDateSectionVisible}
          />
        )}

        {/* Sharp DOM Overlay: Title, Divider, Details, Audio & Replay Controls */}
        <Overlay
          isGyroPermissionNeeded={isGyroPermissionNeeded}
          requestGyroPermission={requestGyroPermission}
          onReplayFlip={handleReplayFlip}
        />
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 4: DUAL-ROW HORIZONTAL SCROLL-DRIVEN 3D PHOTO GALLERY
          - Opposing horizontal movement on page scroll (Row 1: Left -> Right,
            Row 2: Right -> Left) back and forth.
          - 8 authentic couple photos with romantic captions.
          - Interactive zoom lightbox on click.
          ══════════════════════════════════════════════════════════════ */}
      <div ref={gallerySectionRef}>
        <PhotoGallerySection />
      </div>

      {/* ══════════════════════════════════════════════════════════════
          SECTION 5: SACRED MUHURTHAM & SHAKE-TO-REVEAL VENUE QR CODE
          - Subha Muhurtham: 10:30 AM – 11:30 AM
          - Exact Venue: PFMG+PX5 Meeting Hall Konnakulam, konnakulam,
            Manamadurai, Soorakulam, Tamil Nadu 630606
          - Accelerometer phone shake detection (or tap prompt) reveals QR.
          - Floating elevated bubble button [📍 MAPS] appears in bottom-right
            safely above mobile navigation/home bars.
          ══════════════════════════════════════════════════════════════ */}
      <div ref={venueSectionRef}>
        <VenueSection />
      </div>
    </div>
  );
};

export default App;
