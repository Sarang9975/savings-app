import React, { useState } from 'react';
import { Sparkles, Trophy, Briefcase, AlertOctagon, TrendingUp, TrendingDown, ArrowRight, Check, RefreshCw, Zap } from 'lucide-react';
import { calculateVariableAffordability, generateCashflowForecast, formatCurrency } from '../utils/finance';

export default function InteractiveGigSimulator({ goals, currentSavings, incomeStreams, monthlyExpenses, useInterest, currency }) {
  // Simulator scenario toggles
  const [wonHackathon, setWonHackathon] = useState(false);
  const [signedBigClient, setSignedBigClient] = useState(false);
  const [lostClient, setLostClient] = useState(false);
  const [emergencyExpense, setEmergencyExpense] = useState(false);

  // Compute base forecast
  const baseForecast = generateCashflowForecast(incomeStreams, monthlyExpenses, 8);

  // Compute modified simulated streams & expenses
  let simulatedStreams = [...incomeStreams];
  let simulatedExpenses = monthlyExpenses;

  if (wonHackathon) {
    simulatedStreams.push({
      id: 'sim-hackathon',
      title: '🏆 Hackathon 1st Prize Winner',
      amount: 50000,
      type: 'opportunity',
      probability: 100, // Now 100% since won!
      active: true,
      targetMonthOffset: 1
    });
  }

  if (signedBigClient) {
    simulatedStreams.push({
      id: 'sim-big-client',
      title: '💼 Signed Enterprise Retainer',
      amount: 30000,
      type: 'freelance',
      probability: 100,
      active: true,
      targetMonthOffset: 1
    });
  }

  if (lostClient) {
    simulatedStreams = simulatedStreams.map(s => {
      if (s.type === 'recurring' || s.type === 'freelance') {
        return { ...s, active: false };
      }
      return s;
    });
  }

  if (emergencyExpense) {
    simulatedExpenses += 10000;
  }

  const simulatedForecast = generateCashflowForecast(simulatedStreams, simulatedExpenses, 8);

  // Compare ETAs for top goals
  const comparisons = goals.slice(0, 3).map(goal => {
    const baseAfford = calculateVariableAffordability(goal, currentSavings, baseForecast, useInterest);
    const simAfford = calculateVariableAffordability(goal, currentSavings, simulatedForecast, useInterest);

    const monthDelta = baseAfford.expectedMonths !== Infinity && simAfford.expectedMonths !== Infinity
      ? baseAfford.expectedMonths - simAfford.expectedMonths
      : 0;

    return {
      goal,
      baseAfford,
      simAfford,
      monthDelta
    };
  });

  const handleReset = () => {
    setWonHackathon(false);
    setSignedBigClient(false);
    setLostClient(false);
    setEmergencyExpense(false);
  };

  return (
    <div className="glass-panel animate-slide-down" style={{ padding: '28px', border: '1px solid rgba(168, 85, 247, 0.25)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'rgba(168, 85, 247, 0.2)', color: '#c084fc', padding: '10px', borderRadius: '14px' }}>
            <Zap size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>"What If I Win?" Instant Gig Simulator</h2>
              <span className="badge badge-indigo" style={{ fontSize: '0.68rem' }}>LIVE REACTIVE</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem' }}>
              Test real-world freelance events to see your goal arrival dates snap forward or backward in real time
            </p>
          </div>
        </div>

        <button onClick={handleReset} className="btn btn-secondary btn-sm">
          <RefreshCw size={14} />
          <span>Reset Scenarios</span>
        </button>
      </div>

      {/* Scenario Action Buttons (The addictive interaction!) */}
      <div style={{ marginBottom: '26px' }}>
        <label className="form-label" style={{ marginBottom: '10px' }}>Click to Toggle Live Cashflow Scenarios:</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '12px' }}>
          {/* Toggle 1: Won Hackathon */}
          <button
            onClick={() => setWonHackathon(prev => !prev)}
            style={{
              background: wonHackathon ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.03)',
              border: `1.5px solid ${wonHackathon ? '#10b981' : 'var(--border-subtle)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '14px 16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.2s ease',
              textAlign: 'left'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Trophy size={18} color="#fbbf24" />
                <strong style={{ fontSize: '0.92rem', color: '#fff' }}>+₹50k Hackathon Prize</strong>
              </div>
              <span style={{ fontSize: '0.75rem', color: wonHackathon ? '#34d399' : 'var(--text-muted)' }}>
                {wonHackathon ? '🏆 WON & INJECTED!' : 'Click to simulate winning'}
              </span>
            </div>
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: wonHackathon ? '#10b981' : 'rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '11px',
              fontWeight: 800
            }}>
              {wonHackathon ? '✓' : '+'}
            </div>
          </button>

          {/* Toggle 2: Signed Big Client */}
          <button
            onClick={() => setSignedBigClient(prev => !prev)}
            style={{
              background: signedBigClient ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255, 255, 255, 0.03)',
              border: `1.5px solid ${signedBigClient ? '#06b6d4' : 'var(--border-subtle)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '14px 16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.2s ease',
              textAlign: 'left'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Briefcase size={18} color="#38bdf8" />
                <strong style={{ fontSize: '0.92rem', color: '#fff' }}>+₹30k Enterprise Retainer</strong>
              </div>
              <span style={{ fontSize: '0.75rem', color: signedBigClient ? '#38bdf8' : 'var(--text-muted)' }}>
                {signedBigClient ? '💼 CLIENT SIGNED!' : 'Click to simulate contract'}
              </span>
            </div>
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: signedBigClient ? '#06b6d4' : 'rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '11px',
              fontWeight: 800
            }}>
              {signedBigClient ? '✓' : '+'}
            </div>
          </button>

          {/* Toggle 3: Lost a Client */}
          <button
            onClick={() => setLostClient(prev => !prev)}
            style={{
              background: lostClient ? 'rgba(244, 63, 94, 0.2)' : 'rgba(255, 255, 255, 0.03)',
              border: `1.5px solid ${lostClient ? '#f43f5e' : 'var(--border-subtle)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '14px 16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.2s ease',
              textAlign: 'left'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertOctagon size={18} color="#fb7185" />
                <strong style={{ fontSize: '0.92rem', color: '#fff' }}>Lose Main Freelance Client</strong>
              </div>
              <span style={{ fontSize: '0.75rem', color: lostClient ? '#fb7185' : 'var(--text-muted)' }}>
                {lostClient ? '⚠️ CONTRACT CANCELLED' : 'Click to stress test loss'}
              </span>
            </div>
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: lostClient ? '#f43f5e' : 'rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '11px',
              fontWeight: 800
            }}>
              {lostClient ? '✕' : '+'}
            </div>
          </button>

          {/* Toggle 4: Unexpected Expense */}
          <button
            onClick={() => setEmergencyExpense(prev => !prev)}
            style={{
              background: emergencyExpense ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.03)',
              border: `1.5px solid ${emergencyExpense ? '#f59e0b' : 'var(--border-subtle)'}`,
              borderRadius: 'var(--radius-md)',
              padding: '14px 16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.2s ease',
              textAlign: 'left'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingDown size={18} color="#f59e0b" />
                <strong style={{ fontSize: '0.92rem', color: '#fff' }}>-₹10k Emergency Expense</strong>
              </div>
              <span style={{ fontSize: '0.75rem', color: emergencyExpense ? '#fbbf24' : 'var(--text-muted)' }}>
                {emergencyExpense ? '🚨 OUT-OF-POCKET HIT' : 'Medical / Tech repair'}
              </span>
            </div>
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              background: emergencyExpense ? '#f59e0b' : 'rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '11px',
              fontWeight: 800
            }}>
              {emergencyExpense ? '!' : '+'}
            </div>
          </button>
        </div>
      </div>

      {/* Dynamic Results Grid */}
      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '14px' }}>
        Live Goal Impact Comparison
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {comparisons.map(({ goal, baseAfford, simAfford, monthDelta }) => {
          const isAccelerated = monthDelta > 0;
          const isDelayed = monthDelta < 0;

          return (
            <div 
              key={goal.id}
              style={{
                background: isAccelerated 
                  ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.14) 0%, rgba(16, 185, 129, 0.04) 100%)' 
                  : isDelayed
                    ? 'linear-gradient(135deg, rgba(244, 63, 94, 0.14) 0%, rgba(244, 63, 94, 0.04) 100%)'
                    : 'rgba(255, 255, 255, 0.02)',
                border: `1.5px solid ${isAccelerated ? '#10b981' : isDelayed ? '#f43f5e' : 'var(--border-subtle)'}`,
                borderRadius: 'var(--radius-md)',
                padding: '18px 22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px'
              }}
            >
              {/* Left: Icon & Target */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '1.5rem' }}>{goal.icon || '🎯'}</span>
                <div>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 800 }}>{goal.title}</h4>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Target: {formatCurrency(goal.price, currency)}
                  </div>
                </div>
              </div>

              {/* Middle: Before vs After ETA */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Baseline ETA</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                    {baseAfford.expectedDate.fullString}
                  </div>
                </div>

                <ArrowRight size={18} color="var(--border-focus)" />

                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Simulated ETA</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: isAccelerated ? '#34d399' : isDelayed ? '#fb7185' : '#ffffff' }}>
                    {simAfford.expectedDate.fullString}
                  </div>
                </div>
              </div>

              {/* Right: Delta Badge */}
              <div>
                {isAccelerated ? (
                  <span className="badge badge-emerald" style={{ fontSize: '0.78rem', padding: '6px 14px' }}>
                    ⚡ {monthDelta} Months Faster!
                  </span>
                ) : isDelayed ? (
                  <span className="badge badge-rose" style={{ fontSize: '0.78rem', padding: '6px 14px' }}>
                    ⏳ Delayed by {Math.abs(monthDelta)} Months
                  </span>
                ) : (
                  <span className="badge badge-indigo" style={{ fontSize: '0.78rem' }}>
                    Unchanged
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
