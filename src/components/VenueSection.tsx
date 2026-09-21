import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CLOCK_CONFIG } from '../config';

export const VenueSection: React.FC = () => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [shakeDetected, setShakeDetected] = useState(false);
  const lastShakeTimeRef = useRef<number>(0);

  // Trigger QR & Map Bubble Reveal
  const handleReveal = useCallback(() => {
    setIsRevealed(true);
    setShakeDetected(true);
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([100, 60, 150]);
    }
  }, []);

  // Shake Detection via devicemotion
  useEffect(() => {
    let lastX = 0;
    let lastY = 0;
    let lastZ = 0;

    const handleMotion = (e: DeviceMotionEvent) => {
      const acc = e.accelerationIncludingGravity;
      if (!acc || acc.x === null || acc.y === null || acc.z === null) return;

      const deltaX = Math.abs(acc.x - lastX);
      const deltaY = Math.abs(acc.y - lastY);
      const deltaZ = Math.abs(acc.z - lastZ);

      lastX = acc.x;
      lastY = acc.y;
      lastZ = acc.z;

      const speed = deltaX + deltaY + deltaZ;
      const now = Date.now();

      // Shake threshold
      if (speed > 22 && now - lastShakeTimeRef.current > 1200) {
        lastShakeTimeRef.current = now;
        handleReveal();
      }
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [handleReveal]);

  // Google Calendar Link
  const handleAddToCalendar = () => {
    const title = encodeURIComponent(`${CLOCK_CONFIG.subtitle} — Wedding Ceremony`);
    const details = encodeURIComponent(
      `We cordially invite you to the wedding ceremony of Sri Krishna & Swetha.\nDate: Sunday, 25 October 2026\nSubha Muhurtham: 10:30 AM – 11:30 AM\nVenue: ${CLOCK_CONFIG.venue.fullAddress}`
    );
    const loc = encodeURIComponent(CLOCK_CONFIG.venue.fullAddress);
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20261025T050000Z/20261025T060000Z&details=${details}&location=${loc}`;
    window.open(url, '_blank');
  };

  const handleOpenMaps = () => {
    window.open(CLOCK_CONFIG.venue.mapsUrl, '_blank');
  };

  return (
    <section
      id="venueSection"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100dvh',
        backgroundColor: '#FAF7F2',
        background: 'radial-gradient(circle at 50% 30%, #FFFDF8 0%, #FAF6EE 55%, #F0E8DC 100%)',
        padding: '90px 20px 140px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#2A1F1B',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          maxWidth: '780px',
          width: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
          borderRadius: '24px',
          border: '1px solid rgba(212, 175, 55, 0.45)',
          boxShadow: '0 20px 60px rgba(78, 62, 52, 0.12), 0 2px 10px rgba(212, 175, 55, 0.1)',
          backdropFilter: 'blur(12px)',
          padding: 'clamp(28px, 5vw, 56px) clamp(20px, 4vw, 44px)',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        {/* Ornate Gold Corners */}
        <div style={{ position: 'absolute', top: '14px', left: '16px', color: '#D4AF37', fontSize: '18px' }}>✦</div>
        <div style={{ position: 'absolute', top: '14px', right: '16px', color: '#D4AF37', fontSize: '18px' }}>✦</div>
        <div style={{ position: 'absolute', bottom: '14px', left: '16px', color: '#D4AF37', fontSize: '18px' }}>✦</div>
        <div style={{ position: 'absolute', bottom: '14px', right: '16px', color: '#D4AF37', fontSize: '18px' }}>✦</div>

        {/* Section Tag */}
        <span
          style={{
            fontFamily: '"Montserrat", sans-serif',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.28em',
            color: '#B39148',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '8px',
          }}
        >
          ✦ SACRED CEREMONY &amp; VENUE ✦
        </span>

        {/* Heading */}
        <h2
          style={{
            fontFamily: '"Great Vibes", cursive',
            fontSize: 'clamp(42px, 7.5vw, 68px)',
            fontWeight: 400,
            color: '#2A1F1B',
            margin: '0 auto 10px',
          }}
        >
          Auspicious Muhurtham
        </h2>

        {/* Muhurtham Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(212, 175, 55, 0.14)',
            border: '1px solid rgba(212, 175, 55, 0.45)',
            borderRadius: '20px',
            padding: '8px 20px',
            margin: '6px auto 20px',
          }}
        >
          <span style={{ color: '#B39148', fontSize: '14px' }}>🕉</span>
          <span
            style={{
              fontFamily: '"Montserrat", sans-serif',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.12em',
              color: '#8B6F30',
              textTransform: 'uppercase',
            }}
          >
            {CLOCK_CONFIG.muhurtham}
          </span>
        </div>

        {/* Date Display */}
        <p
          style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 'clamp(16px, 2.5vw, 20px)',
            fontWeight: 700,
            color: '#2A1F1B',
            letterSpacing: '0.04em',
            marginBottom: '6px',
          }}
        >
          Sunday, 25 October 2026
        </p>

        {/* Venue Address */}
        <p
          style={{
            fontFamily: '"Montserrat", sans-serif',
            fontSize: '13px',
            color: '#5E4E42',
            maxWidth: '520px',
            margin: '0 auto 28px',
            lineHeight: 1.7,
          }}
        >
          <strong>{CLOCK_CONFIG.venue.name}</strong>
          <br />
          {CLOCK_CONFIG.venue.fullAddress}
        </p>

        {/* ══════════════════════════════════════════════════════════════
            SHAKE-TO-REVEAL QR CODE CONTAINER
            ══════════════════════════════════════════════════════════════ */}
        <div
          style={{
            margin: '24px auto 32px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {!isRevealed ? (
            /* Shake / Tap Trigger Prompt */
            <div
              onClick={handleReveal}
              style={{
                cursor: 'pointer',
                background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.12) 0%, rgba(179, 145, 72, 0.2) 100%)',
                border: '2px dashed #D4AF37',
                borderRadius: '20px',
                padding: '28px 32px',
                maxWidth: '360px',
                width: '100%',
                animation: 'pulseGlow 2s infinite ease-in-out',
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <div style={{ fontSize: '38px', marginBottom: '8px', animation: 'wiggle 1.5s infinite' }}>📱✨</div>
              <h3
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#8B6F30',
                  margin: '0 0 6px',
                }}
              >
                Shake Phone to Reveal QR
              </h3>
              <p
                style={{
                  fontFamily: '"Montserrat", sans-serif',
                  fontSize: '11px',
                  color: '#6E5C50',
                  margin: 0,
                  letterSpacing: '0.04em',
                }}
              >
                (or click / tap here to reveal the Venue QR Code &amp; Maps)
              </p>
            </div>
          ) : (
            /* Revealed Royal QR Code Card */
            <div
              onClick={handleOpenMaps}
              style={{
                background: 'linear-gradient(145deg, #FFFDF9 0%, #FAF5EA 50%, #F5ECDD 100%)',
                borderRadius: '24px',
                padding: '24px 20px',
                boxShadow: '0 24px 65px rgba(179, 145, 72, 0.32), 0 0 0 2px #D4AF37',
                maxWidth: '340px',
                width: '100%',
                animation: 'qrBurst 0.65s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                cursor: 'pointer',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02) translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 28px 75px rgba(179, 145, 72, 0.42), 0 0 0 2px #D4AF37';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) translateY(0)';
                e.currentTarget.style.boxShadow = '0 24px 65px rgba(179, 145, 72, 0.32), 0 0 0 2px #D4AF37';
              }}
              title="Click to Open Venue on Google Maps"
            >
              {/* Corner Gold Filigree Ornaments */}
              <div style={{ position: 'absolute', top: '10px', left: '12px', color: '#D4AF37', fontSize: '13px' }}>✦</div>
              <div style={{ position: 'absolute', top: '10px', right: '12px', color: '#D4AF37', fontSize: '13px' }}>✦</div>
              <div style={{ position: 'absolute', bottom: '10px', left: '12px', color: '#D4AF37', fontSize: '13px' }}>✦</div>
              <div style={{ position: 'absolute', bottom: '10px', right: '12px', color: '#D4AF37', fontSize: '13px' }}>✦</div>

              {/* Royal Header */}
              <div
                style={{
                  fontFamily: '"Montserrat", sans-serif',
                  fontSize: '9.5px',
                  fontWeight: 700,
                  letterSpacing: '0.22em',
                  color: '#B39148',
                  textTransform: 'uppercase',
                  marginBottom: '4px',
                }}
              >
                ⚜ SRI KRISHNA &amp; SWETHA ⚜
              </div>

              <h4
                style={{
                  fontFamily: '"Playfair Display", serif',
                  fontSize: '15px',
                  fontWeight: 700,
                  color: '#2A1F1B',
                  margin: '0 0 6px',
                  letterSpacing: '0.04em',
                }}
              >
                Subha Muhurtham Venue Pass
              </h4>

              {/* Gold Divider Line with Heart */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '180px',
                  margin: '4px auto 14px',
                  gap: '8px',
                }}
              >
                <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, #D4AF37)' }} />
                <span style={{ color: '#D4AF37', fontSize: '11px' }}>♥</span>
                <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, #D4AF37, transparent)' }} />
              </div>

              {/* Ornate QR Frame Container */}
              <div
                style={{
                  position: 'relative',
                  padding: '12px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '18px',
                  border: '2px solid rgba(212, 175, 55, 0.65)',
                  boxShadow: 'inset 0 0 12px rgba(212, 175, 55, 0.15), 0 8px 24px rgba(0, 0, 0, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* QR Code Image */}
                <img
                  src={CLOCK_CONFIG.venue.qrImage}
                  alt="Venue Location QR Code"
                  style={{
                    width: '200px',
                    height: '200px',
                    objectFit: 'contain',
                    display: 'block',
                    borderRadius: '10px',
                  }}
                />

                {/* Corner Golden Accent Brackets */}
                <span style={{ position: 'absolute', top: '3px', left: '4px', color: '#D4AF37', fontSize: '13px', lineHeight: 1 }}>⌜</span>
                <span style={{ position: 'absolute', top: '3px', right: '4px', color: '#D4AF37', fontSize: '13px', lineHeight: 1 }}>⌝</span>
                <span style={{ position: 'absolute', bottom: '3px', left: '4px', color: '#D4AF37', fontSize: '13px', lineHeight: 1 }}>⌞</span>
                <span style={{ position: 'absolute', bottom: '3px', right: '4px', color: '#D4AF37', fontSize: '13px', lineHeight: 1 }}>⌟</span>
              </div>

              {/* Interactive Call-to-Action Pill */}
              <div
                style={{
                  marginTop: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: 'rgba(212, 175, 55, 0.15)',
                  border: '1px solid rgba(212, 175, 55, 0.5)',
                  borderRadius: '20px',
                  padding: '6px 14px',
                }}
              >
                <span style={{ fontSize: '12px' }}>📷</span>
                <span
                  style={{
                    fontFamily: '"Montserrat", sans-serif',
                    fontSize: '10.5px',
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    color: '#8B6F30',
                    textTransform: 'uppercase',
                  }}
                >
                  SCAN OR TAP TO OPEN MAPS
                </span>
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#27ae60',
                    boxShadow: '0 0 8px #27ae60',
                    animation: 'radarPing 1.8s infinite',
                  }}
                />
              </div>

              {/* Location Tag */}
              <span
                style={{
                  fontFamily: '"Montserrat", sans-serif',
                  fontSize: '10px',
                  color: '#7E6B5D',
                  marginTop: '8px',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                }}
              >
                Meeting Hall Konnakulam, Manamadurai
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons: Add to Calendar & Directions */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={handleAddToCalendar}
            style={{
              background: 'linear-gradient(135deg, #D4AF37 0%, #B39148 100%)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '28px',
              padding: '11px 24px',
              fontFamily: '"Playfair Display", serif',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '0.04em',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(179, 145, 72, 0.35)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>📅</span>
            <span>Add to Calendar</span>
          </button>

          <button
            onClick={handleOpenMaps}
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              color: '#4E3E34',
              border: '1px solid #D4AF37',
              borderRadius: '28px',
              padding: '11px 24px',
              fontFamily: '"Playfair Display", serif',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '0.04em',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>📍</span>
            <span>Get Directions</span>
          </button>
        </div>

        {/* Heartfelt Footer Note */}
        <div style={{ marginTop: '36px', borderTop: '1px solid rgba(212, 175, 55, 0.25)', paddingTop: '20px' }}>
          <p
            style={{
              fontFamily: '"Great Vibes", cursive',
              fontSize: '32px',
              color: '#8B6F30',
              margin: '0 0 6px',
            }}
          >
            Sri Krishna &amp; Swetha
          </p>
          <p
            style={{
              fontFamily: '"Montserrat", sans-serif',
              fontSize: '11px',
              letterSpacing: '0.12em',
              color: '#8A7A6E',
              margin: 0,
            }}
          >
            CELEBRATING FOREVER • 25 OCTOBER 2026
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          FLOATING ACTION BUBBLE BUTTON (Appears upon shake/reveal)
          Positioned comfortably above mobile home/navigation bars!
          ══════════════════════════════════════════════════════════════ */}
      {isRevealed && (
        <aside
          aria-label="Venue location action"
          style={{
            position: 'fixed',
            bottom: 'max(env(safe-area-inset-bottom, 24px), 88px)',
            right: '24px',
            zIndex: 9999,
          }}
        >
          <button
            onClick={handleOpenMaps}
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#2A1F1B',
              border: '2px solid #D4AF37',
              color: '#F7E7B4',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(212, 175, 55, 0.5)',
              animation: 'bubblePulse 2.2s infinite ease-in-out',
              backdropFilter: 'blur(8px)',
              transform: 'scale(1)',
              transition: 'transform 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            title="Open Venue on Google Maps"
          >
            <span style={{ fontSize: '20px', lineHeight: 1 }}>📍</span>
            <span
              style={{
                fontFamily: '"Montserrat", sans-serif',
                fontSize: '8px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                marginTop: '3px',
                color: '#D4AF37',
              }}
            >
              MAPS
            </span>
          </button>
        </aside>
      )}

      <style>{`
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 15px rgba(212, 175, 55, 0.25); }
          50% { box-shadow: 0 0 30px rgba(212, 175, 55, 0.6); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-8deg); }
          75% { transform: rotate(8deg); }
        }
        @keyframes qrBurst {
          0% { transform: scale(0.6) rotate(-6deg); opacity: 0; }
          60% { transform: scale(1.05) rotate(2deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes bubblePulse {
          0%, 100% { transform: scale(1); box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5), 0 0 15px rgba(212, 175, 55, 0.4); }
          50% { transform: scale(1.06); box-shadow: 0 12px 35px rgba(0, 0, 0, 0.6), 0 0 28px rgba(212, 175, 55, 0.75); }
        }
        @keyframes radarPing {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.45; }
        }
      `}</style>
    </section>
  );
};
