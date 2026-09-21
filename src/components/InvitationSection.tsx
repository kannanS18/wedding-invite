import React, { useEffect, useRef, useState } from 'react';
import { CLOCK_CONFIG } from '../config';

interface InvitationSectionProps {
  onScrollToDate: () => void;
}

export const InvitationSection: React.FC<InvitationSectionProps> = ({ onScrollToDate }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="invitationSection"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100dvh',
        backgroundColor: '#FAF7F2',
        background: 'radial-gradient(circle at 50% 30%, #FFFDF8 0%, #FAF6EE 55%, #F0E8DC 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 20px 60px',
        overflow: 'hidden',
      }}
    >
      {/* Subtle Background Traditional Gold Mandalas */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '420px',
          height: '420px',
          borderRadius: '50%',
          border: '1px dashed rgba(212, 175, 55, 0.18)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-10%',
          left: '-5%',
          width: '460px',
          height: '460px',
          borderRadius: '50%',
          border: '1px dashed rgba(212, 175, 55, 0.15)',
          pointerEvents: 'none',
        }}
      />

      {/* 3D Royal Invitation Card Unfold Container */}
      <div
        style={{
          maxWidth: '880px',
          width: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.88)',
          borderRadius: '24px',
          border: '1px solid rgba(212, 175, 55, 0.45)',
          boxShadow: '0 20px 60px rgba(78, 62, 52, 0.12), 0 2px 10px rgba(212, 175, 55, 0.1)',
          backdropFilter: 'blur(12px)',
          padding: 'clamp(28px, 5vw, 56px) clamp(20px, 4vw, 48px)',
          textAlign: 'center',
          position: 'relative',
          transform: isVisible ? 'translateY(0) scale(1) rotateX(0deg)' : 'translateY(60px) scale(0.96) rotateX(8deg)',
          opacity: isVisible ? 1 : 0,
          transition: 'transform 1.1s cubic-bezier(0.16, 1, 0.3, 1), opacity 1.1s cubic-bezier(0.16, 1, 0.3, 1)',
          perspective: '1000px',
        }}
      >
        {/* Ornate Corner Gold Accents */}
        <div style={{ position: 'absolute', top: '14px', left: '16px', color: '#D4AF37', fontSize: '18px' }}>✦</div>
        <div style={{ position: 'absolute', top: '14px', right: '16px', color: '#D4AF37', fontSize: '18px' }}>✦</div>
        <div style={{ position: 'absolute', bottom: '14px', left: '16px', color: '#D4AF37', fontSize: '18px' }}>✦</div>
        <div style={{ position: 'absolute', bottom: '14px', right: '16px', color: '#D4AF37', fontSize: '18px' }}>✦</div>

        {/* Traditional Auspicious Header */}
        <div
          style={{
            fontFamily: '"Montserrat", "Playfair Display", sans-serif',
            fontSize: 'clamp(10px, 1.8vw, 12px)',
            fontWeight: 700,
            letterSpacing: '0.28em',
            color: '#B39148',
            textTransform: 'uppercase',
            marginBottom: '8px',
          }}
        >
          {CLOCK_CONFIG.messages.blessingsHeading}
        </div>

        <p
          style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 'clamp(13px, 2.2vw, 16px)',
            fontStyle: 'italic',
            color: '#6E5C50',
            letterSpacing: '0.06em',
            marginBottom: '20px',
          }}
        >
          {CLOCK_CONFIG.messages.formalSubheading}
        </p>

        {/* Couple Hero Photo & 3D Depth Card */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '20px auto 24px',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: 'clamp(220px, 45vw, 320px)',
              height: 'clamp(300px, 60vw, 420px)',
              borderRadius: '160px 160px 24px 24px',
              overflow: 'hidden',
              boxShadow: '0 16px 40px rgba(50, 36, 25, 0.22), 0 0 0 4px rgba(212, 175, 55, 0.5)',
              transform: isVisible ? 'scale(1)' : 'scale(0.92)',
              transition: 'transform 1.3s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <picture style={{ width: '100%', height: '100%', display: 'block' }}>
              <source srcSet={`${import.meta.env.BASE_URL}images/couple_royal_steps.webp`} type="image/webp" />
              <img
                src={`${import.meta.env.BASE_URL}images/couple_royal_steps.jpg`}
                alt="Sri Krishna and Swetha in Royal Attire"
                loading="eager"
                decoding="async"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center 18%',
                  display: 'block',
                }}
              />
            </picture>
            {/* Elegant Soft Vignette Overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, transparent 60%, rgba(20, 14, 12, 0.4) 100%)',
              }}
            />
          </div>
        </div>

        {/* Royal Names in Great Vibes Script */}
        <h2
          style={{
            fontFamily: '"Great Vibes", cursive',
            fontSize: 'clamp(44px, 8.5vw, 76px)',
            fontWeight: 400,
            color: '#2A1F1B',
            lineHeight: 1.15,
            margin: '0 auto 6px',
            textShadow: '0 2px 14px rgba(212, 175, 55, 0.2)',
          }}
        >
          Sri Krishna &amp; Swetha
        </h2>

        {/* Gold Hairline Divider with Center Glowing Heart */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 'clamp(180px, 40vw, 280px)',
            margin: '12px auto 18px',
            gap: '10px',
          }}
        >
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, #D4AF37)' }} />
          <span style={{ color: '#D4AF37', fontSize: '14px', filter: 'drop-shadow(0 0 6px rgba(212, 175, 55, 0.6))' }}>♥</span>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, #D4AF37, transparent)' }} />
        </div>

        {/* Heartfelt Story Quote */}
        <p
          style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 'clamp(14px, 2.2vw, 17px)',
            color: '#554438',
            maxWidth: '620px',
            margin: '0 auto 16px',
            lineHeight: 1.75,
          }}
        >
          {CLOCK_CONFIG.messages.heroInvitation}
        </p>

        <p
          style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: 'clamp(13px, 2.0vw, 15px)',
            fontStyle: 'italic',
            color: '#7E6B5D',
            maxWidth: '560px',
            margin: '0 auto 28px',
            lineHeight: 1.7,
          }}
        >
          “{CLOCK_CONFIG.messages.storyBody[0]} {CLOCK_CONFIG.messages.storyBody[1]}”
        </p>

        {/* Action Button: Scroll to 3D Date Reveal */}
        <button
          onClick={onScrollToDate}
          style={{
            background: 'linear-gradient(135deg, #D4AF37 0%, #B39148 100%)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '30px',
            padding: '12px 28px',
            fontFamily: '"Montserrat", sans-serif',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(179, 145, 72, 0.35)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'transform 0.25s ease, box-shadow 0.25s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(179, 145, 72, 0.45)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(179, 145, 72, 0.35)';
          }}
        >
          <span>✦ REVEAL AUSPICIOUS DATE ✦</span>
          <span style={{ fontSize: '14px' }}>↓</span>
        </button>
      </div>
    </section>
  );
};
