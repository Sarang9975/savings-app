import React, { useEffect, useRef, useState } from 'react';

/**
 * SavingsJar — Animated glass jar with:
 *  • Liquid fill that animates to the target percentage
 *  • SVG sine-wave surface (two layered waves)
 *  • Rising bubble particles
 *  • Coin-drop animation when savings increase
 *  • Glass glare + shimmer
 */

// ── BUBBLE PARTICLE ────────────────────────────────────────────────
function Bubble({ x, delay, size }) {
  return (
    <circle
      cx={x}
      cy="95"
      r={size}
      fill="rgba(255,255,255,0.25)"
      style={{
        animation: `bubble-rise ${1.8 + Math.random()}s ${delay}s ease-in infinite`,
        transformOrigin: `${x}px 95px`
      }}
    />
  );
}

// ── COIN ────────────────────────────────────────────────────────────
function CoinDrop({ x, delay, onDone }) {
  return (
    <div
      onAnimationEnd={onDone}
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: '-10px',
        width: '18px',
        height: '18px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #fbbf24, #d97706)',
        border: '2px solid #f59e0b',
        boxShadow: '0 0 8px rgba(251,191,36,0.6)',
        fontSize: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontWeight: 800,
        animation: `coin-drop 0.7s ${delay}s cubic-bezier(0.4,0,1,1) both`,
        zIndex: 10,
        pointerEvents: 'none'
      }}
    >
      ₹
    </div>
  );
}

// ── MAIN JAR COMPONENT ─────────────────────────────────────────────
export default function SavingsJar({ percentage = 0, currency = '₹', savedAmount = 0, targetAmount = 0, label = '' }) {
  const pct = Math.min(100, Math.max(0, percentage));
  const prevPct = useRef(pct);
  const [coins, setCoins] = useState([]);
  const [displayPct, setDisplayPct] = useState(0);
  const animFrame = useRef(null);
  const coinId = useRef(0);

  // Animate fill level
  useEffect(() => {
    const target = pct;
    const start = displayPct;
    const startTime = performance.now();
    const duration = 1200;

    const tick = (now) => {
      const t = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 4);
      setDisplayPct(start + (target - start) * ease);
      if (t < 1) animFrame.current = requestAnimationFrame(tick);
    };
    animFrame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrame.current);
  }, [pct]);

  // Drop coins when percentage increases
  useEffect(() => {
    if (pct > prevPct.current) {
      const count = Math.min(6, Math.ceil((pct - prevPct.current) / 5) + 1);
      const newCoins = Array.from({ length: count }, (_, i) => ({
        id: ++coinId.current,
        x: 20 + Math.random() * 60,
        delay: i * 0.12
      }));
      setCoins(c => [...c, ...newCoins]);
    }
    prevPct.current = pct;
  }, [pct]);

  const removeCoin = (id) => setCoins(c => c.filter(coin => coin.id !== id));

  // Liquid fill — y position (SVG is 120px tall, jar interior from y=15 to y=108)
  const jarHeight = 93;  // interior height in SVG units
  const liquidY = 108 - (jarHeight * displayPct / 100); // top of liquid
  const clampedY = Math.max(15, Math.min(108, liquidY));

  const bubbles = [
    { x: 42, delay: 0,    size: 1.5 },
    { x: 55, delay: 0.6,  size: 1 },
    { x: 65, delay: 1.1,  size: 2 },
    { x: 38, delay: 1.8,  size: 1.2 },
    { x: 72, delay: 0.3,  size: 0.9 },
  ];

  // Wave path generator
  const wave = (offset, amp = 3) => {
    const y = clampedY + offset;
    return `M0,${y} C20,${y - amp} 40,${y + amp} 60,${y} C80,${y - amp} 100,${y + amp} 120,${y} L120,110 L0,110 Z`;
  };

  const isCompleted = pct >= 100;
  const liquidColor = isCompleted
    ? ['rgba(16,185,129,0.85)', 'rgba(16,185,129,0.6)']
    : pct > 60
    ? ['rgba(99,102,241,0.85)', 'rgba(99,102,241,0.6)']
    : pct > 30
    ? ['rgba(6,182,212,0.8)', 'rgba(6,182,212,0.55)']
    : ['rgba(139,92,246,0.75)', 'rgba(139,92,246,0.5)'];

  return (
    <div style={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center', userSelect: 'none' }}>
      {/* Coin drops */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', borderRadius: '50%', zIndex: 5 }}>
        {coins.map(coin => (
          <CoinDrop key={coin.id} x={coin.x} delay={coin.delay} onDone={() => removeCoin(coin.id)} />
        ))}
      </div>

      {/* Outer glow */}
      {isCompleted && (
        <div style={{
          position: 'absolute',
          inset: '-12px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.25) 0%, transparent 70%)',
          animation: 'jar-glow-pulse 2s ease-in-out infinite',
          pointerEvents: 'none'
        }} />
      )}

      {/* SVG Jar */}
      <svg
        width="120" height="140" viewBox="0 0 120 140"
        style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.4))' }}
      >
        <defs>
          <clipPath id="jar-clip">
            {/* Jar interior shape */}
            <path d="M22,18 L98,18 L108,108 L12,108 Z" />
          </clipPath>
          <linearGradient id="glass-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="rgba(255,255,255,0.12)" />
            <stop offset="40%"  stopColor="rgba(255,255,255,0.04)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.08)" />
          </linearGradient>
          <linearGradient id={`liquid-grad-${pct}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={liquidColor[0]} />
            <stop offset="100%" stopColor={liquidColor[1]} />
          </linearGradient>
          <filter id="liquid-blur">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.4" />
          </filter>
        </defs>

        {/* Jar body outline */}
        <path
          d="M22,18 L98,18 L108,108 L12,108 Z"
          fill="rgba(255,255,255,0.04)"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Liquid — clipped inside jar */}
        <g clipPath="url(#jar-clip)">
          {pct > 0 && (
            <>
              {/* Back wave (lighter, slightly behind) */}
              <path
                d={wave(2.5, 2.5)}
                fill={liquidColor[1]}
                style={{ animation: 'wave-back 3.2s ease-in-out infinite' }}
              />
              {/* Front wave */}
              <path
                d={wave(0, 4)}
                fill={`url(#liquid-grad-${pct})`}
                style={{ animation: 'wave-front 2.2s ease-in-out infinite' }}
              />
              {/* Bubbles */}
              {displayPct > 5 && bubbles.map((b, i) => (
                <Bubble key={i} {...b} />
              ))}
            </>
          )}
        </g>

        {/* Jar mouth rim */}
        <rect x="18" y="12" width="84" height="10" rx="5"
          fill="rgba(255,255,255,0.08)"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1"
        />

        {/* Glass glare — left highlight */}
        <rect x="27" y="20" width="5" height="60" rx="3"
          fill="rgba(255,255,255,0.12)"
        />
        {/* Glass glare — right small */}
        <rect x="88" y="24" width="3" height="30" rx="2"
          fill="rgba(255,255,255,0.07)"
        />

        {/* Lid */}
        <rect x="14" y="6" width="92" height="8" rx="4"
          fill="rgba(255,255,255,0.1)"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="1"
        />
        {/* Lid knob */}
        <ellipse cx="60" cy="5" rx="10" ry="4"
          fill="rgba(255,255,255,0.12)"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1"
        />

        {/* Glass body overlay gradient */}
        <path
          d="M22,18 L98,18 L108,108 L12,108 Z"
          fill="url(#glass-grad)"
        />

        {/* Percentage label inside jar */}
        {pct > 15 && (
          <text
            x="60" y={clampedY + 22}
            textAnchor="middle"
            fontSize="13"
            fontWeight="800"
            fontFamily="JetBrains Mono, monospace"
            fill="rgba(255,255,255,0.92)"
            style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}
          >
            {Math.round(displayPct)}%
          </text>
        )}

        {/* Completed star */}
        {isCompleted && (
          <text x="60" y="68" textAnchor="middle" fontSize="22" style={{ animation: 'pop-in 0.5s var(--ease)' }}>⭐</text>
        )}
      </svg>

      {/* Label below jar */}
      <div style={{ marginTop: '10px', textAlign: 'center' }}>
        <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--t1)', letterSpacing: '-0.02em' }}>
          {label}
        </div>
        <div style={{ fontSize: '0.72rem', color: 'var(--t3)', marginTop: '2px', fontFamily: 'var(--mono)' }}>
          {currency}{savedAmount.toLocaleString('en-IN')} / {currency}{targetAmount.toLocaleString('en-IN')}
        </div>
      </div>

      <style>{`
        @keyframes wave-front {
          0%,100% { transform: translateX(0px); }
          50%      { transform: translateX(-8px); }
        }
        @keyframes wave-back {
          0%,100% { transform: translateX(0px); }
          50%      { transform: translateX(6px); }
        }
        @keyframes bubble-rise {
          0%   { transform: translateY(0) scale(1); opacity: 0.8; }
          80%  { opacity: 0.4; }
          100% { transform: translateY(-${Math.random() * 60 + 40}px) scale(0.3); opacity: 0; }
        }
        @keyframes coin-drop {
          0%   { transform: translateY(0) rotate(0deg) scale(1); opacity: 1; }
          60%  { transform: translateY(80px) rotate(360deg) scale(0.9); opacity: 1; }
          100% { transform: translateY(110px) rotate(450deg) scale(0.6); opacity: 0; }
        }
        @keyframes jar-glow-pulse {
          0%,100% { opacity: 0.6; transform: scale(1); }
          50%      { opacity: 1; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}
