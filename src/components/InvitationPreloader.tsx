import React, { useState, useEffect, useRef } from 'react';
import { weddingMusic } from '../lib/weddingMusic';

interface InvitationPreloaderProps {
  onComplete: (videoBlobUrl?: string) => void;
}

export const InvitationPreloader: React.FC<InvitationPreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const hasTriggeredRef = useRef(false);
  const blobUrlRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    // Preload video 100% directly into device RAM as binary Blob
    // This guarantees ZERO network buffering/pausing during video playback!
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${import.meta.env.BASE_URL}intro_v2.mp4`, true);
    xhr.responseType = 'blob';

    xhr.onprogress = (e) => {
      if (e.lengthComputable && e.total > 0) {
        const pct = Math.min(99, Math.round((e.loaded / e.total) * 100));
        setProgress(pct);
      } else {
        setProgress((prev) => Math.min(98, prev + 5));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const blob = xhr.response as Blob;
          const blobUrl = URL.createObjectURL(blob);
          blobUrlRef.current = blobUrl;
        } catch {
          // Fallback to static URL if Blob URL creation fails
        }
      }
      setProgress(100);
      setIsLoaded(true);
    };

    xhr.onerror = () => {
      // Graceful fallback: allow entering even if offline
      setProgress(100);
      setIsLoaded(true);
    };

    xhr.send();

    // Safety timeout: if network takes longer than 30s, enable entry
    const safetyTimer = setTimeout(() => {
      setProgress(100);
      setIsLoaded(true);
    }, 30000);

    return () => {
      clearTimeout(safetyTimer);
      xhr.abort();
    };
  }, []);

  const handleOpenInvitation = () => {
    if (hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;

    // Trigger wedding music from user interaction
    weddingMusic.play().catch(() => {});

    // Handover immediately with RAM Blob URL for 100% smooth playback
    onComplete(blobUrlRef.current);
  };

  return (
    <div
      onClick={isLoaded ? handleOpenInvitation : undefined}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100000,
        backgroundColor: '#120B09',
        background: 'radial-gradient(circle at 50% 40%, #2A1A14 0%, #140C0A 60%, #080403 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px 20px',
        opacity: 1,
        transform: 'scale(1)',
        pointerEvents: 'auto',
        cursor: isLoaded ? 'pointer' : 'default',
        userSelect: 'none',
        overflow: 'hidden',
      }}
    >
      {/* Traditional Auspicious Mandap Border Inset */}
      <div
        style={{
          position: 'absolute',
          inset: '16px',
          border: '1px solid rgba(212, 175, 55, 0.35)',
          borderRadius: '16px',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: '22px',
          border: '1px solid rgba(212, 175, 55, 0.15)',
          borderRadius: '12px',
          pointerEvents: 'none',
        }}
      />

      {/* Auspicious Header Text */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          marginBottom: '20px',
          zIndex: 2,
        }}
      >
        <span
          style={{
            fontFamily: '"Montserrat", sans-serif',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.28em',
            color: '#D4AF37',
            textTransform: 'uppercase',
            marginBottom: '8px',
            textShadow: '0 0 12px rgba(212, 175, 55, 0.4)',
          }}
        >
          ✦ Sri Rama Jayam • Subha Muhurtham ✦
        </span>

        <h1
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: 'clamp(24px, 6vw, 34px)',
            fontWeight: 700,
            color: '#FBF4E6',
            letterSpacing: '0.04em',
            margin: '0 0 6px 0',
            textShadow: '0 2px 10px rgba(0,0,0,0.6)',
          }}
        >
          Sri Krishna &amp; Swetha
        </h1>

        <p
          style={{
            fontFamily: '"Montserrat", sans-serif',
            fontSize: '12px',
            color: '#C4A882',
            letterSpacing: '0.06em',
            maxWidth: '320px',
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          An auspicious wedding invitation has arrived for your family
        </p>
      </div>

      {/* Handcrafted Traditional Invitation Plate (Thamboolam) Presentation */}
      <div
        style={{
          position: 'relative',
          width: '210px',
          height: '210px',
          margin: '10px 0 24px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
        }}
      >
        {/* Soft Golden Ambient Light Halo (GPU composited) */}
        <div
          style={{
            position: 'absolute',
            width: '230px',
            height: '230px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.22) 0%, rgba(212, 175, 55, 0) 70%)',
            animation: 'ambientGlow 3.5s infinite alternate ease-in-out',
            transform: 'translate3d(0, 0, 0)',
            willChange: 'transform, opacity',
            pointerEvents: 'none',
          }}
        />

        {/* Realistic Grounded Drop Shadow (Scales naturally as plate floats) */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            width: '140px',
            height: '18px',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 72%)',
            filter: 'blur(3px)',
            animation: 'shadowBreathe 3s infinite cubic-bezier(0.45, 0, 0.55, 1)',
            transformOrigin: 'center center',
            transform: 'translate3d(0, 0, 0)',
            willChange: 'transform, opacity',
            pointerEvents: 'none',
          }}
        />

        {/* Hardware-Accelerated Floating Tray Container */}
        <div
          style={{
            position: 'relative',
            width: '190px',
            height: '190px',
            animation: 'floatTray 3s infinite cubic-bezier(0.45, 0, 0.55, 1)',
            transform: 'translate3d(0, 0, 0)',
            willChange: 'transform',
            backfaceVisibility: 'hidden',
          }}
        >
          {/* Vector SVG: Auspicious Thamboolam Plate with Betel Leaves, Diya Lamp & Royal Letter */}
          <svg
            width="190"
            height="190"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              display: 'block',
              overflow: 'visible',
            }}
          >
            {/* Outer Brass/Gold Plate Rim */}
            <circle cx="100" cy="100" r="92" fill="#281A12" stroke="#D4AF37" strokeWidth="3" />
            <circle cx="100" cy="100" r="86" stroke="#9E7D3B" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="100" cy="100" r="82" fill="radial-gradient(circle, #3D281C 0%, #1E120B 100%)" />

            {/* Traditional Auspicious Green Betel Leaves (Vethalai) */}
            <path
              d="M50 110 C40 70 85 50 100 85 C115 50 160 70 150 110 C140 145 100 160 100 160 C100 160 60 145 50 110 Z"
              fill="#2E6930"
              stroke="#438A46"
              strokeWidth="1.5"
              opacity="0.9"
            />
            <path d="M100 85 L100 155" stroke="#7CBD7F" strokeWidth="1.2" opacity="0.7" />
            <path d="M100 105 Q85 115 70 118" stroke="#7CBD7F" strokeWidth="0.8" opacity="0.6" />
            <path d="M100 105 Q115 115 130 118" stroke="#7CBD7F" strokeWidth="0.8" opacity="0.6" />
            <path d="M100 125 Q82 133 75 138" stroke="#7CBD7F" strokeWidth="0.8" opacity="0.6" />
            <path d="M100 125 Q118 133 125 138" stroke="#7CBD7F" strokeWidth="0.8" opacity="0.6" />

            {/* Royal Gold Invitation Envelope / Patrikai */}
            <rect
              x="68"
              y="65"
              width="64"
              height="46"
              rx="4"
              fill="#FAF6EE"
              stroke="#D4AF37"
              strokeWidth="1.5"
              transform="rotate(-5 100 88)"
            />
            {/* Envelope Flap & Wax Seal */}
            <path d="M68 66 L100 86 L132 63" stroke="#D4AF37" strokeWidth="1.2" fill="none" />
            <circle cx="99" cy="86" r="8" fill="#B32428" stroke="#D4AF37" strokeWidth="1" />
            <text x="99" y="89" fontSize="6" fill="#FDEEBF" textAnchor="middle" fontWeight="bold">S♥S</text>

            {/* Auspicious Supari / Areca Nut */}
            <ellipse cx="65" cy="130" rx="8" ry="6" fill="#8B4513" stroke="#5C2E0B" strokeWidth="1" />
            <ellipse cx="135" cy="130" rx="8" ry="6" fill="#8B4513" stroke="#5C2E0B" strokeWidth="1" />

            {/* Golden Diya Lamp Base */}
            <ellipse cx="100" cy="148" rx="16" ry="7" fill="#C59B27" stroke="#FDEEBF" strokeWidth="1" />
            <path d="M86 147 Q100 158 114 147 Z" fill="#8A6715" />

            {/* Soft Warm Flame Aura (Zero expensive CPU blur filters) */}
            <circle cx="100" cy="136" r="11" fill="#FFA500" opacity="0.25" />
            <circle cx="100" cy="136" r="7" fill="#FFD700" opacity="0.45" />

            {/* Glowing Divine Flame */}
            <path
              d="M100 144 Q94 135 100 124 Q106 135 100 144 Z"
              fill="url(#flameGrad)"
            />
            <circle cx="100" cy="138" r="2.5" fill="#FFFDE0" />

            {/* Jasmine Flowers (Mallipoo) */}
            <circle cx="82" cy="74" r="4" fill="#FFFFFF" opacity="0.9" />
            <circle cx="78" cy="78" r="3.5" fill="#FFFFFF" opacity="0.85" />
            <circle cx="118" cy="72" r="4" fill="#FFFFFF" opacity="0.9" />
            <circle cx="123" cy="76" r="3.5" fill="#FFFFFF" opacity="0.85" />

            {/* Gradients */}
            <defs>
              <linearGradient id="flameGrad" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#D9381E" />
                <stop offset="50%" stopColor="#FFA500" />
                <stop offset="100%" stopColor="#FFFF66" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Progress & Handover Action Area */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: '300px',
          zIndex: 2,
        }}
      >
        {!isLoaded ? (
          <>
            {/* Elegant Slim Gold Progress Bar */}
            <div
              style={{
                width: '100%',
                height: '4px',
                backgroundColor: 'rgba(212, 175, 55, 0.2)',
                borderRadius: '4px',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #B38F36 0%, #F5DE88 50%, #D4AF37 100%)',
                  borderRadius: '4px',
                  boxShadow: '0 0 10px #D4AF37',
                  transition: 'width 0.2s ease-out',
                }}
              />
            </div>

            {/* Percentage & Royal Invitation Status */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
                marginTop: '10px',
                fontFamily: '"Montserrat", sans-serif',
                fontSize: '11px',
                color: '#C4A882',
                letterSpacing: '0.08em',
              }}
            >
              <span>Opening royal invitation...</span>
              <span style={{ color: '#F7E7B4', fontWeight: 700 }}>{progress}%</span>
            </div>
          </>
        ) : (
          /* Auspicious Handover Call to Action Button */
          <button
            onClick={handleOpenInvitation}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              padding: '14px 28px',
              backgroundColor: '#D4AF37',
              background: 'linear-gradient(135deg, #ECC867 0%, #D4AF37 50%, #AA8222 100%)',
              color: '#1A1009',
              border: '1px solid #FFEBB0',
              borderRadius: '32px',
              fontFamily: '"Montserrat", sans-serif',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              boxShadow: '0 8px 30px rgba(0,0,0,0.6), 0 0 24px rgba(212, 175, 55, 0.65)',
              animation: 'buttonPulse 2.2s infinite ease-in-out',
              transform: 'translate3d(0, 0, 0)',
              willChange: 'transform',
              transition: 'transform 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translate3d(0, 0, 0) scale(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translate3d(0, 0, 0) scale(1)')}
          >
            <span>RECEIVE INVITATION</span>
            <span style={{ fontSize: '15px' }}>✦</span>
          </button>
        )}
      </div>

      {/* Embedded 60fps Hardware-Accelerated CSS Animations */}
      <style>{`
        @keyframes floatTray {
          0%, 100% {
            transform: translate3d(0, 0px, 0);
          }
          50% {
            transform: translate3d(0, -9px, 0);
          }
        }

        @keyframes shadowBreathe {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
            opacity: 0.7;
          }
          50% {
            transform: translate3d(0, 0, 0) scale(0.85);
            opacity: 0.42;
          }
        }

        @keyframes ambientGlow {
          0% {
            opacity: 0.5;
            transform: translate3d(0, 0, 0) scale(0.96);
          }
          100% {
            opacity: 0.95;
            transform: translate3d(0, 0, 0) scale(1.06);
          }
        }

        @keyframes buttonPulse {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(0, 0, 0) scale(1.035);
          }
        }
      `}</style>
    </div>
  );
};

export default InvitationPreloader;
