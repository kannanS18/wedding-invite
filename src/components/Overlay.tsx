import React, { useState } from 'react';
import { CLOCK_CONFIG } from '../config';
import { audioController } from './AudioController';

interface OverlayProps {
  isGyroPermissionNeeded: boolean;
  requestGyroPermission: () => Promise<boolean>;
  onReplayFlip?: () => void;
}

export const Overlay: React.FC<OverlayProps> = ({
  isGyroPermissionNeeded,
  requestGyroPermission,
  onReplayFlip,
}) => {
  const [isMuted, setIsMuted] = useState(!audioController.getEnabled());
  const [gyroGranted, setGyroGranted] = useState(false);

  const toggleSound = () => {
    const nextEnabled = audioController.toggle();
    setIsMuted(!nextEnabled);
  };

  const handleEnableTilt = async () => {
    const granted = await requestGyroPermission();
    if (granted) setGyroGranted(true);
  };

  const handleAddToCalendar = () => {
    const title = encodeURIComponent(`${CLOCK_CONFIG.subtitle} — Wedding Ceremony`);
    const details = encodeURIComponent(
      `We heartfully invite you and your family to our wedding ceremony.\nDate: Sunday, 25 October 2026\nSubha Muhurtham: 10:30 AM – 11:30 AM\nVenue: ${CLOCK_CONFIG.venue.fullAddress}`
    );
    const loc = encodeURIComponent(CLOCK_CONFIG.venue.fullAddress);
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20261025T050000Z/20261025T060000Z&details=${details}&location=${loc}`;
    window.open(url, '_blank');
  };

  const handleDirections = () => {
    window.open(CLOCK_CONFIG.venue.mapsUrl, '_blank');
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 16px 32px',
        pointerEvents: 'none',
        zIndex: 10,
      }}
    >
      {/* Accessibility live region */}
      <div
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0,0,0,0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
        aria-live="polite"
      >
        Sri Krishna &amp; Swetha Wedding Date: Sunday, 25 October 2026 at Konnakulam, Manamadurai.
      </div>

      {/* TOP HEADER CONTROLS */}
      <header
        style={{
          width: '100%',
          maxWidth: '960px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pointerEvents: 'auto',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {onReplayFlip && (
            <button
              onClick={onReplayFlip}
              style={{
                background: 'rgba(255, 255, 255, 0.82)',
                border: '1px solid rgba(212, 175, 55, 0.45)',
                borderRadius: '20px',
                padding: '6px 12px',
                fontFamily: '"Montserrat", sans-serif',
                fontSize: '11px',
                fontWeight: 600,
                color: '#5E4E42',
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}
              title="Replay 3D Flip Cascade"
            >
              🔄 Replay 3D Flip
            </button>
          )}

          {isGyroPermissionNeeded && !gyroGranted && (
            <button
              onClick={handleEnableTilt}
              style={{
                background: 'rgba(255, 255, 255, 0.82)',
                border: '1px solid rgba(212, 175, 55, 0.45)',
                borderRadius: '20px',
                padding: '6px 12px',
                fontFamily: '"Montserrat", sans-serif',
                fontSize: '11px',
                fontWeight: 600,
                color: '#5E4E42',
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}
              title="Enable 3D Motion Parallax on iOS"
            >
              📱 Enable Tilt
            </button>
          )}
          {/* Flip FX Sound Toggle */}
          <button
            onClick={toggleSound}
            style={{
              background: 'rgba(255, 255, 255, 0.82)',
              border: '1px solid rgba(212, 175, 55, 0.45)',
              borderRadius: '20px',
              padding: '6px 12px',
              fontFamily: '"Montserrat", sans-serif',
              fontSize: '11px',
              fontWeight: 600,
              color: isMuted ? '#8A7A6E' : '#B39148',
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
            title={isMuted ? 'Turn Flip Clicks ON' : 'Turn Flip Clicks OFF'}
            aria-label={isMuted ? 'Unmute mechanical flip sound' : 'Mute flip sound'}
          >
            {isMuted ? '🔕 Flip FX' : '🔔 Flip FX'}
          </button>
        </div>
      </header>

      {/* ROMANTIC HEADING & DIVIDER */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          marginTop: '8px',
          marginBottom: 'auto',
          pointerEvents: 'auto',
        }}
      >
        <h1
          style={{
            fontFamily: '"Great Vibes", "Playfair Display", cursive',
            fontSize: 'clamp(38px, 7.5vw, 68px)',
            fontWeight: 400,
            color: '#2A1F1B',
            lineHeight: 1.15,
            textShadow: '0 2px 12px rgba(180, 150, 100, 0.18)',
          }}
        >
          {CLOCK_CONFIG.title}
        </h1>

        <p
          style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 'clamp(14px, 2.2vw, 19px)',
            fontStyle: 'italic',
            fontWeight: 600,
            color: '#B39148',
            letterSpacing: '0.08em',
            marginTop: '2px',
          }}
        >
          {CLOCK_CONFIG.subtitle}
        </p>

        {/* Gold Hairline Divider with Center Glowing Heart */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 'clamp(180px, 40vw, 300px)',
            margin: '10px auto 0',
            gap: '10px',
          }}
        >
          <div
            style={{
              flex: 1,
              height: '1px',
              background: 'linear-gradient(90deg, transparent, #D4AF37)',
            }}
          />
          <span
            style={{
              color: '#D4AF37',
              fontSize: '13px',
              display: 'inline-block',
              filter: 'drop-shadow(0 0 4px rgba(212, 175, 55, 0.5))',
            }}
          >
            ♥
          </span>
          <div
            style={{
              flex: 1,
              height: '1px',
              background: 'linear-gradient(90deg, #D4AF37, transparent)',
            }}
          />
        </div>
      </div>

      {/* BOTTOM WEDDING DETAILS & ACTION BUTTONS */}
      <footer
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          marginTop: 'auto',
          paddingTop: '16px',
          pointerEvents: 'auto',
        }}
      >
        <p
          style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 'clamp(12px, 1.9vw, 15px)',
            fontStyle: 'italic',
            color: '#6A5A4E',
            maxWidth: '440px',
            marginBottom: '8px',
          }}
        >
          “{CLOCK_CONFIG.quote}”
        </p>

        <p
          style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 'clamp(12px, 1.8vw, 14px)',
            fontWeight: 600,
            letterSpacing: '0.05em',
            color: '#342923',
            marginBottom: '4px',
          }}
        >
          {CLOCK_CONFIG.dateDisplay}
        </p>

        <p
          style={{
            fontFamily: '"Montserrat", sans-serif',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.12em',
            color: '#B39148',
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}
        >
          {CLOCK_CONFIG.muhurtham}
        </p>

        {/* Action Buttons: Add to Calendar & Google Maps */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={handleAddToCalendar}
            style={{
              background: 'linear-gradient(135deg, #D4AF37 0%, #B39148 100%)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '26px',
              padding: '9px 20px',
              fontFamily: '"Playfair Display", serif',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.04em',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(179, 145, 72, 0.35)',
            }}
          >
            📅 Add to Calendar
          </button>

          <button
            onClick={handleDirections}
            style={{
              background: 'rgba(255, 255, 255, 0.88)',
              color: '#4E3E34',
              border: '1px solid #D4AF37',
              borderRadius: '26px',
              padding: '9px 20px',
              fontFamily: '"Playfair Display", serif',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.04em',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
            }}
          >
            📍 Directions
          </button>
        </div>
      </footer>
    </div>
  );
};
