import React, { useState, useEffect } from 'react';
import { weddingMusic } from '../lib/weddingMusic';

export const BackgroundMusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(weddingMusic.getIsPlaying());
  const [isMuted, setIsMuted] = useState(weddingMusic.getIsMuted());

  useEffect(() => {
    // Subscribe to state changes from the global music service
    const unsubscribe = weddingMusic.subscribe(() => {
      setIsPlaying(weddingMusic.getIsPlaying());
      setIsMuted(weddingMusic.getIsMuted());
    });
    return unsubscribe;
  }, []);

  const handleToggle = () => {
    weddingMusic.toggle();
  };

  return (
    <aside
      aria-label="Wedding Music Control"
      style={{
        position: 'fixed',
        top: 'max(env(safe-area-inset-top, 16px), 18px)',
        right: 'max(env(safe-area-inset-right, 16px), 18px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}
    >

      {/* Master Floating Music Controller Button */}
      <button
        onClick={handleToggle}
        title={isMuted ? 'Click to Unmute' : 'Click to Mute'}
        aria-label={isMuted ? 'Unmute wedding music' : 'Mute wedding music'}
        style={{
          position: 'relative',
          height: '42px',
          padding: isPlaying ? '0 14px 0 10px' : '0 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: isPlaying
            ? 'radial-gradient(circle at 30% 30%, rgba(55, 40, 32, 0.95), rgba(22, 16, 14, 0.96))'
            : !isMuted
            ? 'radial-gradient(circle at 30% 30%, rgba(65, 48, 38, 0.95), rgba(30, 22, 18, 0.96))'
            : 'rgba(30, 24, 21, 0.88)',
          border: !isMuted ? '1.5px solid #D4AF37' : '1px solid rgba(212, 175, 55, 0.45)',
          borderRadius: '24px',
          color: !isMuted ? '#F7E7B4' : '#B8A89A',
          cursor: 'pointer',
          boxShadow: isPlaying
            ? '0 6px 20px rgba(0, 0, 0, 0.45), 0 0 16px rgba(212, 175, 55, 0.5)'
            : !isMuted
            ? '0 4px 15px rgba(0, 0, 0, 0.4), 0 0 12px rgba(212, 175, 55, 0.35)'
            : '0 4px 12px rgba(0, 0, 0, 0.35)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
          transform: 'scale(1)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        {!isMuted ? (
          <>
            {/* Spinning Vinyl / Note Icon */}
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, #3D2D20 30%, #150F0C 70%)',
                border: '1px solid #D4AF37',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: isPlaying ? 'vinylSpin 4s linear infinite' : 'none',
                boxShadow: '0 0 8px rgba(212, 175, 55, 0.5)',
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: '11px', color: '#F7E7B4', lineHeight: 1 }}>♫</span>
            </div>

            {/* Dancing Equalizer Bars */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: '3px',
                height: '16px',
                paddingBottom: '2px',
              }}
              aria-hidden="true"
            >
              <span className={`eq-bar eq-bar-1 ${isPlaying ? 'dancing' : 'idle'}`} />
              <span className={`eq-bar eq-bar-2 ${isPlaying ? 'dancing' : 'idle'}`} />
              <span className={`eq-bar eq-bar-3 ${isPlaying ? 'dancing' : 'idle'}`} />
              <span className={`eq-bar eq-bar-4 ${isPlaying ? 'dancing' : 'idle'}`} />
            </div>

            {/* Label */}
            <span
              style={{
                fontFamily: '"Montserrat", sans-serif',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.06em',
                color: '#F7E7B4',
                textTransform: 'uppercase',
              }}
            >
              Music
            </span>
          </>
        ) : (
          <>
            {/* Muted Speaker Icon */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ opacity: 0.85, color: '#C4A47C' }}
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>

            <span
              style={{
                fontFamily: '"Montserrat", sans-serif',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.05em',
                color: '#B8A89A',
                textTransform: 'uppercase',
              }}
            >
              Muted
            </span>
          </>
        )}
      </button>

      {/* Embedded CSS for animations */}
      <style>{`
        @keyframes vinylSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes hintPulse {
          0%, 100% { transform: translateY(0); opacity: 0.95; }
          50% { transform: translateY(-3px); opacity: 1; }
        }

        .eq-bar {
          display: inline-block;
          width: 2.5px;
          background-color: #D4AF37;
          border-radius: 2px;
          transform-origin: bottom;
        }

        .eq-bar.idle {
          height: 8px;
          opacity: 0.7;
          animation: eqIdlePulse 1.5s ease-in-out infinite alternate;
        }

        @keyframes eqIdlePulse {
          0% { transform: scaleY(0.4); }
          100% { transform: scaleY(0.8); }
        }

        .eq-bar.dancing.eq-bar-1 {
          height: 14px;
          animation: eqDance 0.8s ease-in-out infinite alternate;
        }
        .eq-bar.dancing.eq-bar-2 {
          height: 10px;
          animation: eqDance 0.95s ease-in-out 0.15s infinite alternate;
        }
        .eq-bar.dancing.eq-bar-3 {
          height: 16px;
          animation: eqDance 0.7s ease-in-out 0.3s infinite alternate;
        }
        .eq-bar.dancing.eq-bar-4 {
          height: 12px;
          animation: eqDance 0.85s ease-in-out 0.45s infinite alternate;
        }

        @keyframes eqDance {
          0% { transform: scaleY(0.25); }
          100% { transform: scaleY(1); }
        }
      `}</style>
    </aside>
  );
};

export default BackgroundMusicPlayer;
