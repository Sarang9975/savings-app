import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, AlertTriangle, Flame, ShieldAlert, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { playTickSound, playShatterSound, playVictoryChime } from '../utils/audio';

export default function TheRaceAnimation({ currency = 'INR' }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasRevealed, setHasRevealed] = useState(false);
  const [step, setStep] = useState(0); // 0 to 18 months
  const [soundEnabled, setSoundEnabled] = useState(true);

  const timerRef = useRef(null);

  // Month progression
  const months = [
    'Aug 2026', 'Sep 2026', 'Oct 2026', 'Nov 2026', 'Dec 2026',
    'Jan 2027', 'Feb 2027', 'Mar 2027', 'Apr 2027', 'May 2027',
    'Jun 2027', 'Jul 2027', 'Aug 2027', 'Sep 2027', 'Oct 2027',
    'Nov 2027', 'Dec 2027', 'Jan 2028', 'Feb 2028'
  ];

  // Base parameters
  const initialPrice = 80000;
  const initialSaved = 20000;
  const monthlySaving = 5000;
  const interestRate = 0.06; // 6% annual on savings
  const techInflationRate = 0.12; // 12% annual tech price increase / model updates

  // Calculate values at current step
  const monthlyInterest = interestRate / 12;
  const monthlyInflation = techInflationRate / 12;

  let currentSavings = initialSaved;
  for (let i = 0; i < step; i++) {
    currentSavings = currentSavings * (1 + monthlyInterest) + monthlySaving;
  }
  currentSavings = Math.round(currentSavings);

  const currentPrice = Math.round(initialPrice * Math.pow(1 + monthlyInflation, step));
  const naivePrice = initialPrice;

  // Percentage calculations relative to a dynamic canvas
  const maxScale = 110000;
  const savingsPct = Math.min(100, Math.round((currentSavings / maxScale) * 100));
  const naiveGoalPct = Math.min(100, Math.round((naivePrice / maxScale) * 100));
  const realGoalPct = Math.min(100, Math.round((currentPrice / maxScale) * 100));

  // Check if cracked
  const isCracked = step >= 12; // When Aug 2027 arrives and passes without catching up

  const handlePlayRace = () => {
    setIsPlaying(true);
    setHasRevealed(true);
    setStep(0);

    let currentStep = 0;
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      currentStep++;
      if (currentStep <= 18) {
        setStep(currentStep);
        if (soundEnabled) {
          if (currentStep === 12) {
            playShatterSound();
          } else {
            playTickSound();
          }
        }
      } else {
        clearInterval(timerRef.current);
        setIsPlaying(false);
      }
    }, 450);
  };

  const handleReset = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsPlaying(false);
    setStep(0);
    setHasRevealed(false);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="glass-panel animate-slide-down" style={{
      padding: '28px',
      background: 'radial-gradient(ellipse at 50% 20%, rgba(99, 102, 241, 0.15) 0%, rgba(10, 14, 25, 0.95) 75%)',
      border: isCracked ? '1.5px solid #f43f5e' : '1px solid rgba(99, 102, 241, 0.3)',
      boxShadow: isCracked ? '0 0 35px rgba(244, 63, 94, 0.25)' : 'none',
      transition: 'all 0.3s ease'
    }}>
      {/* Top Header & Speaker Prompt */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '22px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-rose" style={{ fontSize: '0.7rem' }}>
              ACT 1: THE RUNAWAY GOAL
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>0:00 - 1:00 Pitch Moment</span>
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '4px' }}>
            "Every savings app says this laptop is yours in August 2027. That date is a lie."
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="btn btn-secondary btn-icon btn-sm"
            title={soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
          >
            {soundEnabled ? <Volume2 size={16} color="#34d399" /> : <VolumeX size={16} />}
          </button>

          {!isPlaying ? (
            <button
              onClick={handlePlayRace}
              className="btn btn-emerald"
              style={{ fontWeight: 800, padding: '10px 20px', boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)' }}
            >
              <Play size={16} />
              <span>{hasRevealed ? 'Replay The Race' : 'Watch The Goal Run Away'}</span>
            </button>
          ) : (
            <button
              onClick={handleReset}
              className="btn btn-secondary"
            >
              <RotateCcw size={15} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* The Duel Banner: Typical App vs The Reality */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '16px',
        marginBottom: '26px'
      }}>
        {/* Typical App Card (Cracks when false) */}
        <div style={{
          background: isCracked ? 'rgba(244, 63, 94, 0.12)' : 'rgba(255, 255, 255, 0.03)',
          border: isCracked ? '2px solid #f43f5e' : '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '18px 20px',
          position: 'relative',
          transition: 'all 0.3s ease',
          transform: isCracked ? 'scale(1.02)' : 'scale(1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Standard Savings App (Static Math)
            </span>
            {isCracked && (
              <span className="badge badge-rose" style={{ animation: 'pulseGlow 1s infinite' }}>
                💥 CRACKED: FALSE PROMISE
              </span>
            )}
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: isCracked ? '#fb7185' : 'var(--text-muted)', textDecoration: isCracked ? 'line-through' : 'none' }}>
            August 2027 (12 Months)
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            Assumes static ₹80,000 price. Ignores spec upgrades and inflation.
          </div>
        </div>

        {/* The Reality Card */}
        <div style={{
          background: hasRevealed ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.18) 0%, rgba(16, 185, 129, 0.08) 100%)' : 'rgba(255, 255, 255, 0.02)',
          border: hasRevealed ? '2px solid #6366f1' : '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '18px 20px',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.74rem', color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>
              GoalCast Ground Truth
            </span>
            <span className="badge badge-indigo">
              {months[step]} (Month {step})
            </span>
          </div>
          <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#38bdf8' }}>
            {step < 12 ? 'Chasing Finish Line...' : step <= 15 ? 'Target Moved to Nov 2027!' : 'True Arrival: Feb 2028'}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#c7d2fe', marginTop: '4px' }}>
            Your cash: <strong>₹{currentSavings.toLocaleString()}</strong> vs Inflated Target: <strong>₹{currentPrice.toLocaleString()}</strong>
          </div>
        </div>
      </div>

      {/* The Visual Physical Track Race (The Finish Line Physically Moves!) */}
      <div style={{
        background: '#070b14',
        borderRadius: 'var(--radius-lg)',
        padding: '24px 20px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        marginBottom: '20px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '14px', color: 'var(--text-dim)' }}>
          <span>🏁 START: ₹20,000</span>
          <span>📅 Current Month: <strong style={{ color: '#fff' }}>{months[step]}</strong></span>
          <span>FINISH LINE HORIZON</span>
        </div>

        {/* Track Container */}
        <div style={{ position: 'relative', height: '64px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
          {/* Runner 1: Your Savings Bar */}
          <div style={{
            position: 'absolute',
            top: '8px',
            left: '0',
            height: '22px',
            width: `${savingsPct}%`,
            background: 'linear-gradient(90deg, #6366f1, #10b981)',
            borderRadius: '6px',
            boxShadow: '0 0 15px rgba(16, 185, 129, 0.5)',
            transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingRight: '8px'
          }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#fff', whiteSpace: 'nowrap' }}>
              💰 ₹{currentSavings.toLocaleString()} (6% APY)
            </span>
          </div>

          {/* Static Finish Line Ghost (Where old apps told you it would be) */}
          <div style={{
            position: 'absolute',
            left: `${naiveGoalPct}%`,
            top: '0',
            bottom: '0',
            width: '2px',
            borderLeft: '2px dashed rgba(255, 255, 255, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <div style={{
              position: 'absolute',
              top: '-18px',
              fontSize: '0.65rem',
              color: isCracked ? '#f43f5e' : 'var(--text-dim)',
              whiteSpace: 'nowrap',
              background: '#070b14',
              padding: '1px 4px',
              borderRadius: '3px'
            }}>
              Old Fake Goal (₹80k)
            </div>
          </div>

          {/* RUNAWAY FINISH LINE (Physically Moves Right!) */}
          <div style={{
            position: 'absolute',
            left: `${realGoalPct}%`,
            top: '0',
            bottom: '0',
            width: '3px',
            background: '#f43f5e',
            boxShadow: '0 0 18px #f43f5e',
            transition: 'left 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 3
          }}>
            <div style={{
              position: 'absolute',
              bottom: '-22px',
              fontSize: '0.72rem',
              fontWeight: 800,
              color: '#fb7185',
              whiteSpace: 'nowrap',
              background: 'rgba(244, 63, 94, 0.2)',
              border: '1px solid #f43f5e',
              padding: '2px 8px',
              borderRadius: '9999px'
            }}>
              🏃 Running Away: ₹{currentPrice.toLocaleString()} (+12% Tech Inflation)
            </div>
          </div>
        </div>

        {/* Live Race Subtitles */}
        <div style={{ marginTop: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
          <div style={{ color: '#34d399', fontWeight: 600 }}>
            Savings Velocity: +₹5,000/mo + 6% Compounded
          </div>
          <div style={{ color: '#fb7185', fontWeight: 600 }}>
            Finish Line Drift: +₹800/mo Price Creep
          </div>
        </div>
      </div>

      {/* The Shock Callout Punchline */}
      <div style={{
        background: 'rgba(244, 63, 94, 0.08)',
        border: '1px solid rgba(244, 63, 94, 0.25)',
        borderRadius: 'var(--radius-md)',
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '0.88rem',
        color: '#fecdd3'
      }}>
        <AlertTriangle size={20} color="#f43f5e" style={{ flexShrink: 0 }} />
        <div>
          <strong>The Pitch Moment:</strong> "Your money earns 6%. This laptop grows 12%. You're losing ground every month you wait without dynamic acceleration. That's why static calculators lie to you."
        </div>
      </div>
    </div>
  );
}
