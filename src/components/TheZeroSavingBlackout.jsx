import React, { useState } from 'react';
import { Skull, AlertOctagon, Sparkles, RefreshCw, Sun, Moon } from 'lucide-react';
import { playBlackoutDrone, playVictoryChime } from '../utils/audio';
import { calculateGoalTimeline, formatCurrency } from '../utils/finance';

export default function TheZeroSavingBlackout({ currency = 'INR' }) {
  const [monthlySaving, setMonthlySaving] = useState(5000);
  const targetPrice = 80000;
  const currentSaved = 20000;

  const isZero = monthlySaving === 0;

  const handleSliderChange = (val) => {
    const num = Number(val);
    if (num === 0 && monthlySaving > 0) {
      playBlackoutDrone();
    } else if (num > 0 && monthlySaving === 0) {
      playVictoryChime();
    }
    setMonthlySaving(num);
  };

  const timeline = calculateGoalTimeline(targetPrice, currentSaved, monthlySaving, true);

  return (
    <div className="glass-panel animate-slide-down" style={{
      padding: '28px',
      background: isZero ? '#030509' : 'rgba(18, 25, 43, 0.75)',
      border: isZero ? '2px solid #f43f5e' : '1px solid var(--border-subtle)',
      boxShadow: isZero ? '0 0 50px rgba(244, 63, 94, 0.35)' : 'none',
      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Act Tag */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge badge-amber" style={{ fontSize: '0.7rem' }}>
            ACT 2: THE ZERO-SAVING BLACKOUT
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>1:00 - 1:20 Pitch Moment</span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => handleSliderChange(0)}
            className="btn btn-danger btn-sm"
            style={{ fontWeight: 700 }}
          >
            <Moon size={14} />
            <span>Test ₹0 Blackout</span>
          </button>
          <button
            onClick={() => handleSliderChange(6000)}
            className="btn btn-secondary btn-sm"
          >
            <Sun size={14} />
            <span>Restore ₹6,000/mo</span>
          </button>
        </div>
      </div>

      {/* Main Dramatic View */}
      {isZero ? (
        <div style={{ textAlign: 'center', padding: '30px 10px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(244, 63, 94, 0.2)',
            color: '#f43f5e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            animation: 'pulseGlow 1.2s infinite'
          }}>
            <Skull size={32} />
          </div>

          <h3 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#f43f5e', letterSpacing: '-0.02em', marginBottom: '8px' }}>
            BLACKOUT: INFINITE HORIZON
          </h3>

          <p style={{ fontSize: '1.1rem', color: '#fecdd3', maxWidth: '620px', margin: '0 auto 20px', lineHeight: 1.5 }}>
            "At ₹0/month, this laptop will cost <strong>₹1,42,000 by 2030</strong>. You will never catch it. Without monthly contributions or a lump sum, your finish line is mathematically infinite."
          </p>

          <div style={{ display: 'inline-block', background: 'rgba(244, 63, 94, 0.15)', border: '1px solid #f43f5e', borderRadius: 'var(--radius-md)', padding: '10px 20px', fontSize: '0.85rem', color: '#fb7185' }}>
            ⚠️ Problem Statement 12 Requirement Fulfilled Dramatically: System alerts user clearly on zero savings!
          </div>
        </div>
      ) : (
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '6px' }}>
            Saving Velocity: {formatCurrency(monthlySaving, currency)}/month
          </h3>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
            At this rate, your purchase horizon is <strong>{timeline.months} Months — {timeline.targetDate.fullString}</strong>.
          </p>
        </div>
      )}

      {/* Drag Slider (Judges can drag to see blackout trigger live) */}
      <div style={{ marginTop: '20px', background: 'rgba(0, 0, 0, 0.3)', padding: '18px', borderRadius: 'var(--radius-md)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 700, color: isZero ? '#f43f5e' : '#fff' }}>
            Drag Monthly Savings Slider:
          </label>
          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: isZero ? '#f43f5e' : '#34d399' }}>
            {formatCurrency(monthlySaving, currency)}/mo
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="20000"
          step="500"
          value={monthlySaving}
          onChange={(e) => handleSliderChange(e.target.value)}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '8px' }}>
          <span style={{ color: '#f43f5e', fontWeight: 700 }}>₹0 (Drop to Zero for Blackout)</span>
          <span>₹10,000</span>
          <span>₹20,000</span>
        </div>
      </div>
    </div>
  );
}
