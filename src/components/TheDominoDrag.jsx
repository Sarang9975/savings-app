import React, { useState } from 'react';
import { ArrowUpDown, AlertCircle, Sparkles, Check, ArrowRight, CornerDownRight } from 'lucide-react';
import { playTickSound } from '../utils/audio';
import { formatCurrency } from '../utils/finance';

export default function TheDominoDrag({ currency = 'INR' }) {
  const [selectedTop, setSelectedTop] = useState('laptop'); // 'laptop' | 'bike' | 'phone'

  const scenarios = {
    laptop: {
      top: 'Laptop (₹80,000)',
      order: [
        { id: 'laptop', title: '💻 Developer Laptop', price: 80000, date: 'April 2027', delta: '0 mo', status: 'Primary Priority' },
        { id: 'bike', title: '🏍️ Royal Enfield Bike', price: 120000, date: 'November 2027', delta: '+2 mo', status: 'Next in Queue' },
        { id: 'phone', title: '📱 iPhone 16 Pro', price: 60000, date: 'March 2028', delta: '+4 mo', status: 'Subsequent Goal' }
      ],
      rippleText: 'Prioritizing Laptop knocks out your primary productivity tool first in April 2027 with minimal delay to other items.'
    },
    bike: {
      top: 'Bike (₹1,20,000)',
      order: [
        { id: 'bike', title: '🏍️ Royal Enfield Bike', price: 120000, date: 'June 2027', delta: '⚡ 5 mo faster', status: 'Primary Priority (DOMINO TRIGGER)' },
        { id: 'laptop', title: '💻 Developer Laptop', price: 80000, date: 'December 2027', delta: '⏳ Delayed by +3 months', status: 'Collateral Delay' },
        { id: 'phone', title: '📱 iPhone 16 Pro', price: 60000, date: 'June 2028', delta: '🚨 Delayed by +6 months', status: 'Severe Delay' }
      ],
      rippleText: '⚠️ THE DOMINO EFFECT: Prioritizing the heavy ₹1,20,000 Bike delays your Phone by +6 months and delays your Laptop by +3 months!'
    },
    phone: {
      top: 'Phone (₹60,000)',
      order: [
        { id: 'phone', title: '📱 iPhone 16 Pro', price: 60000, date: 'January 2027', delta: '⚡ 6 mo faster', status: 'Quick Win (Snowball)' },
        { id: 'laptop', title: '💻 Developer Laptop', price: 80000, date: 'July 2027', delta: '⏳ Delayed by +2 months', status: 'Next in Queue' },
        { id: 'bike', title: '🏍️ Royal Enfield Bike', price: 120000, date: 'April 2028', delta: '⏳ Delayed by +4 months', status: 'Long-term Anchor' }
      ],
      rippleText: 'The Quick-Win Snowball: Phone completes in just 4 months, but delays the high-cost Bike by 4 months.'
    }
  };

  const currentScenario = scenarios[selectedTop];

  const handleSelect = (key) => {
    playTickSound();
    setSelectedTop(key);
  };

  return (
    <div className="glass-panel animate-slide-down" style={{
      padding: '28px',
      border: '1.5px solid rgba(168, 85, 247, 0.35)',
      background: 'radial-gradient(ellipse at 20% 80%, rgba(168, 85, 247, 0.12) 0%, rgba(10, 14, 25, 0.95) 70%)'
    }}>
      {/* Act Tag */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge badge-indigo" style={{ fontSize: '0.7rem' }}>
            ACT 4: THE DOMINO DRAG
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>2:10 - 2:40 Pitch Moment</span>
        </div>
        <span style={{ fontSize: '0.82rem', color: '#c084fc', fontWeight: 600 }}>
          Live Opportunity Cost Ripple
        </span>
      </div>

      <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '6px' }}>
        Click Any Goal To Promote It To #1: Watch The Whole Timeline Ripple Live
      </h3>
      <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
        In the real world, you cannot have everything at once. Shuffling priority cascades through your financial future.
      </p>

      {/* Target Selector Buttons */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '22px', flexWrap: 'wrap' }}>
        <button
          onClick={() => handleSelect('laptop')}
          className={`btn ${selectedTop === 'laptop' ? 'btn-primary' : 'btn-secondary'}`}
        >
          💻 Prioritize Laptop (#1)
        </button>
        <button
          onClick={() => handleSelect('bike')}
          className={`btn ${selectedTop === 'bike' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ background: selectedTop === 'bike' ? 'linear-gradient(135deg, #a855f7, #7c3aed)' : undefined }}
        >
          🏍️ Prioritize Bike (#1) — Trigger Domino!
        </button>
        <button
          onClick={() => handleSelect('phone')}
          className={`btn ${selectedTop === 'phone' ? 'btn-primary' : 'btn-secondary'}`}
        >
          📱 Prioritize Phone (#1)
        </button>
      </div>

      {/* Reshuffled Ranked Goals with Ripple Deltas */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
        {currentScenario.order.map((item, idx) => {
          const isTop = idx === 0;
          const isDelayed = item.delta.includes('Delayed');

          return (
            <div
              key={item.id}
              style={{
                background: isTop 
                  ? 'rgba(168, 85, 247, 0.15)' 
                  : isDelayed 
                    ? 'rgba(244, 63, 94, 0.08)' 
                    : 'rgba(255, 255, 255, 0.02)',
                border: `1.5px solid ${isTop ? '#a855f7' : isDelayed ? 'rgba(244, 63, 94, 0.3)' : 'var(--border-subtle)'}`,
                borderRadius: 'var(--radius-md)',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '14px',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background: isTop ? '#a855f7' : 'rgba(255, 255, 255, 0.08)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.9rem'
                }}>
                  #{idx + 1}
                </div>

                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{item.title}</h4>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                    Target: {formatCurrency(item.price, currency)}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Target ETA</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: isTop ? '#34d399' : '#ffffff' }}>
                    {item.date}
                  </div>
                </div>

                <div>
                  <span className={`badge ${isTop ? 'badge-emerald' : isDelayed ? 'badge-rose' : 'badge-indigo'}`} style={{ fontSize: '0.72rem' }}>
                    {item.delta}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Domino Ripple Callout */}
      <div style={{
        background: 'rgba(168, 85, 247, 0.1)',
        border: '1px solid rgba(168, 85, 247, 0.25)',
        borderRadius: 'var(--radius-md)',
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '0.86rem',
        color: '#e9d5ff'
      }}>
        <CornerDownRight size={20} color="#c084fc" style={{ flexShrink: 0 }} />
        <div>
          {currentScenario.rippleText}
        </div>
      </div>
    </div>
  );
}
