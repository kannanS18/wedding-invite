import React, { useRef, useState, useEffect, useCallback } from 'react';
import { CLOCK_CONFIG } from '../config';
import { weddingMusic } from '../lib/weddingMusic';

interface VideoSectionProps {
  onVideoEnd: () => void;
  onScrollToReveal: () => void;
  videoSrc?: string;
  isActive?: boolean;
}

export const VideoSection: React.FC<VideoSectionProps> = ({
  onVideoEnd,
  onScrollToReveal,
  videoSrc = `${import.meta.env.BASE_URL}intro_v2.mp4`,
  isActive = true,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLocked, setIsLocked] = useState(true);
  const [isEnded, setIsEnded] = useState(false);
  const hasEndedTriggeredRef = useRef(false);
  const hasStartedRef = useRef(false);

  // Strict scroll lock while video is playing
  useEffect(() => {
    if (!isLocked || !isActive) return;

    const preventScroll = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };

    const preventKeyScroll = (e: KeyboardEvent) => {
      if ([32, 33, 34, 35, 36, 37, 38, 39, 40].includes(e.keyCode)) {
        e.preventDefault();
        return false;
      }
    };

    document.documentElement.classList.add('scroll-locked');
    document.body.classList.add('scroll-locked');

    window.addEventListener('wheel', preventScroll, { passive: false });
    window.addEventListener('keydown', preventKeyScroll, { passive: false });

    return () => {
      document.documentElement.classList.remove('scroll-locked');
      document.body.classList.remove('scroll-locked');
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('keydown', preventKeyScroll);
    };
  }, [isLocked, isActive]);

  // Video end handler: freeze on last frame, unlock scroll
  const handleVideoFinished = useCallback(() => {
    if (hasEndedTriggeredRef.current) return;
    hasEndedTriggeredRef.current = true;

    const vid = videoRef.current;
    if (vid) {
      vid.pause();
    }

    setIsLocked(false);
    setIsEnded(true);
    document.documentElement.classList.remove('scroll-locked');
    document.body.classList.remove('scroll-locked');

    onVideoEnd();
  }, [onVideoEnd]);

  // Controlled video playback: ONLY plays when isActive flips to true
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    if (!isActive) {
      vid.pause();
      vid.currentTime = 0;
      return;
    }

    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    // Set strict DOM properties for mobile autoplay
    vid.muted = true;
    vid.defaultMuted = true;
    vid.volume = 0;
    vid.playsInline = true;
    vid.setAttribute('muted', '');
    vid.setAttribute('playsinline', '');
    vid.setAttribute('webkit-playsinline', 'true');
    vid.setAttribute('x5-playsinline', 'true');

    // Immediately stream video from server URL and play wedding song simultaneously
    const playPromise = vid.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Fallback retry if browser requires another tick
        setTimeout(() => {
          vid.play().catch(() => {});
        }, 50);
      });
    }
    weddingMusic.play().catch(() => {});

    // Safety timeout in case video stalls or ends without dispatching event
    const safetyTimer = setTimeout(() => {
      handleVideoFinished();
    }, 10400); // 10.4s for the 10.0s video

    return () => {
      clearTimeout(safetyTimer);
    };
  }, [isActive, handleVideoFinished]);

  // Monitor playback progress to trigger completion precisely at video end
  const handleTimeUpdate = () => {
    const vid = videoRef.current;
    if (!vid || hasEndedTriggeredRef.current) return;
    if (vid.duration > 0 && vid.currentTime >= vid.duration - 0.2) {
      handleVideoFinished();
    }
  };

  return (
    <section
      id="videoSection"
      style={{
        position: 'relative',
        width: '100%',
        height: '100dvh',
        overflow: 'hidden',
        backgroundColor: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 20,
        cursor: 'default',
        pointerEvents: isEnded ? 'auto' : 'none',
        touchAction: isEnded ? 'pan-y' : 'none',
      }}
    >
      {/* Fullscreen Video: native OS hardware scanout layer */}
      <video
        ref={videoRef}
        src={videoSrc}
        muted
        playsInline
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleVideoFinished}
        onError={handleVideoFinished}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          pointerEvents: 'none',
        }}
      />

      {/* Animated Glowing Scroll Down Cue */}
      {isEnded && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            weddingMusic.play().catch(() => {});
            onScrollToReveal();
          }}
          style={{
            position: 'absolute',
            bottom: 'max(env(safe-area-inset-bottom, 24px), 24px)',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            color: '#F7E7B4',
            fontFamily: '"Montserrat", sans-serif',
            fontSize: '11px',
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            zIndex: 40,
            cursor: 'pointer',
            animation: 'gentlePulse 1.8s infinite ease-in-out',
            background: 'rgba(10, 6, 8, 0.75)',
            padding: '10px 22px',
            borderRadius: '30px',
            border: '1px solid rgba(212, 175, 55, 0.55)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6), 0 0 15px rgba(212, 175, 55, 0.3)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <span style={{ fontWeight: 600, color: '#D4AF37' }}>✦ WEDDING INVITATION ✦</span>
          <span style={{ fontSize: '13px', fontWeight: 700 }}>↓ SCROLL DOWN ↓</span>
        </div>
      )}

      <style>{`
        @keyframes gentlePulse {
          0%, 100% {
            transform: translateX(-50%) translate3d(0, 0, 0);
          }
          50% {
            transform: translateX(-50%) translate3d(0, -6px, 0);
          }
        }
      `}</style>
    </section>
  );
};
