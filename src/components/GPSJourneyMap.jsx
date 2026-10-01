import React, { useState } from 'react';
import { Navigation, MapPin, Gauge, Clock, Zap, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { calculateGoalTimeline, formatCurrency } from '../utils/finance';

export default function GPSJourneyMap({ goals, useInterest, currency, onSelectGoalForSim }) {
  const [selectedRoute, setSelectedRoute] = useState('routeA'); // 'routeA' | 'routeB' | 'routeC'

  if (!goals || goals.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '32px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>No active destinations found. Add a goal to turn on your Financial GPS.</p>
      </div>
    );
  }

  // Get active primary goal
  const primaryGoal = goals[0];
  const primaryTimeline = calculateGoalTimeline(primaryGoal.price, primaryGoal.saved, primaryGoal.monthlySaving, useInterest);

  // Speed variations for primary goal
  const currentMonthly = primaryGoal.monthlySaving;
  const turboMonthly = Math.round(currentMonthly * 1.3 / 500) * 500 || (currentMonthly + 2000);
  const turboTimeline = calculateGoalTimeline(primaryGoal.price, primaryGoal.saved, turboMonthly, useInterest);

  const bonusSaved = primaryGoal.saved + 20000;
  const bonusTimeline = calculateGoalTimeline(primaryGoal.price, bonusSaved, currentMonthly, useInterest);

  // Calculate sequential cascade for all goals
  // If user saves totalMonthly sequentially: Goal 1 finishes, then all monthly savings pour into Goal 2, etc.
  const sequentialChain = [];
  let cumulativeMonths = 0;
  const totalMonthlyPool = goals.reduce((sum, g) => sum + (g.monthlySaving || 0), 0) || 5000;

  goals.forEach((goal, idx) => {
    const remainingToSave = Math.max(0, goal.price - goal.saved);
    // If saving sequentially with combined pool:
    const monthsNeeded = goal.monthlySaving > 0 
      ? calculateGoalTimeline(goal.price, goal.saved, goal.monthlySaving, useInterest).months 
      : Infinity;
    
    const goalTimeline = calculateGoalTimeline(goal.price, goal.saved, goal.monthlySaving, useInterest);
    
    sequentialChain.push({
      ...goal,
      index: idx + 1,
      timeline: goalTimeline,
      progress: Math.min(100, Math.round((goal.saved / goal.price) * 100))
    });
  });

  return (
    <div className="glass-panel animate-slide-down" style={{ padding: '26px 28px', marginBottom: '28px', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', padding: '8px', borderRadius: '12px' }}>
            <Navigation size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Financial GPS Navigation</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem' }}>
              Real-time route computation, alternative saving highways & sequential arrival ETA
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge badge-indigo">
            <Gauge size={13} /> Active Route: {primaryGoal.title}
          </span>
        </div>
      </div>

      {/* Main GPS Route HUD */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '16px',
        marginBottom: '28px'
      }}>
        {/* Route A: Cruising Speed */}
        <div 
          onClick={() => setSelectedRoute('routeA')}
          style={{
            background: selectedRoute === 'routeA' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.02)',
            border: `1.5px solid ${selectedRoute === 'routeA' ? '#6366f1' : 'var(--border-subtle)'}`,
            borderRadius: 'var(--radius-md)',
            padding: '18px 20px',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
            position: 'relative'
          }}
        >
          {selectedRoute === 'routeA' && (
            <span className="badge badge-indigo" style={{ position: 'absolute', top: '12px', right: '12px', fontSize: '0.65rem' }}>
              CURRENT ROUTE
            </span>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Clock size={16} color="#818cf8" />
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Route A: Steady Cruising</span>
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
            Current pace at <strong style={{ color: '#fff' }}>{formatCurrency(currentMonthly, currency)}/mo</strong>
          </div>
          <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Estimated Arrival</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#38bdf8' }}>
              {primaryTimeline.isZeroSaving ? 'Indefinite (₹0/mo)' : primaryTimeline.targetDate.fullString}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              {primaryTimeline.isZeroSaving ? 'No monthly savings committed' : `ETA: in ${primaryTimeline.months} months`}
            </div>
          </div>
        </div>

        {/* Route B: Turbo Express */}
        <div 
          onClick={() => setSelectedRoute('routeB')}
          style={{
            background: selectedRoute === 'routeB' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.02)',
            border: `1.5px solid ${selectedRoute === 'routeB' ? '#10b981' : 'var(--border-subtle)'}`,
            borderRadius: 'var(--radius-md)',
            padding: '18px 20px',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
            position: 'relative'
          }}
        >
          <span className="badge badge-emerald" style={{ position: 'absolute', top: '12px', right: '12px', fontSize: '0.65rem' }}>
            FAST LANE ⚡
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Zap size={16} color="#10b981" />
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Route B: Turbo Express</span>
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
            Boost to <strong style={{ color: '#34d399' }}>{formatCurrency(turboMonthly, currency)}/mo</strong> (+30%)
          </div>
          <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Accelerated Arrival</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#10b981' }}>
              {turboTimeline.targetDate.fullString}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#6ee7b7', marginTop: '2px' }}>
              ⚡ Arrive {Math.max(0, primaryTimeline.months - turboTimeline.months)} months earlier!
            </div>
          </div>
        </div>

        {/* Route C: Bonus Booster */}
        <div 
          onClick={() => setSelectedRoute('routeC')}
          style={{
            background: selectedRoute === 'routeC' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.02)',
            border: `1.5px solid ${selectedRoute === 'routeC' ? '#f59e0b' : 'var(--border-subtle)'}`,
            borderRadius: 'var(--radius-md)',
            padding: '18px 20px',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
            position: 'relative'
          }}
        >
          <span className="badge badge-amber" style={{ position: 'absolute', top: '12px', right: '12px', fontSize: '0.65rem' }}>
            LUMP SUM
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <Sparkles size={16} color="#f59e0b" />
            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Route C: +₹20k Bonus Injection</span>
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
            Maintain {formatCurrency(currentMonthly, currency)}/mo + deposit ₹20,000
          </div>
          <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Supercharged Arrival</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fbbf24' }}>
              {bonusTimeline.targetDate.fullString}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#fcd34d', marginTop: '2px' }}>
              🚀 Cuts timeline by {Math.max(0, primaryTimeline.months - bonusTimeline.months)} months!
            </div>
          </div>
        </div>
      </div>

      {/* Sequential Journey Roadmap (The Financial Highway) */}
      <div style={{
        background: 'rgba(10, 14, 25, 0.7)',
        borderRadius: 'var(--radius-md)',
        padding: '24px 20px',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={18} color="#6366f1" />
            Your Sequential Financial Journey Roadmap
          </h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Ranked milestone checkpoints in chronological order
          </span>
        </div>

        {/* Milestone Highway Track */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.max(1, sequentialChain.length)}, minmax(200px, 1fr))`,
          gap: '16px',
          overflowX: 'auto',
          paddingBottom: '10px'
        }}>
          {sequentialChain.map((item, idx) => (
            <div 
              key={item.id} 
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                position: 'relative'
              }}
            >
              {/* Checkpoint Badge */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: idx === 0 ? '#6366f1' : 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 800
                }}>
                  {item.index}
                </span>
                <span className={`badge ${item.timeline.isZeroSaving ? 'badge-rose' : item.timeline.riskLevel === 'on_track' ? 'badge-emerald' : 'badge-amber'}`} style={{ fontSize: '0.65rem' }}>
                  {item.timeline.isZeroSaving ? '0/MO PAUSED' : item.timeline.riskLevel.toUpperCase().replace('_', ' ')}
                </span>
              </div>

              {/* Title & Price */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '1.25rem' }}>{item.icon || '🎯'}</span>
                <h4 style={{ fontSize: '0.98rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.title}
                </h4>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
                Target: <strong style={{ color: '#fff' }}>{formatCurrency(item.price, currency)}</strong>
              </div>

              {/* Progress Mini Bar */}
              <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
                <div style={{ width: `${item.progress}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1, #10b981)' }} />
              </div>

              {/* ETA Display */}
              <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '8px 10px', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Target ETA</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: item.timeline.isZeroSaving ? '#f43f5e' : '#38bdf8' }}>
                  {item.timeline.isZeroSaving ? '⚠️ ₹0/month' : item.timeline.targetDate.fullString}
                </div>
                {!item.timeline.isZeroSaving && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    in {item.timeline.months} months
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* AI Navigation Advisor Callout */}
        <div style={{
          marginTop: '16px',
          padding: '12px 16px',
          background: 'rgba(99, 102, 241, 0.08)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <Sparkles size={20} color="#818cf8" style={{ flexShrink: 0 }} />
          <div style={{ fontSize: '0.86rem', color: '#c7d2fe' }}>
            <strong>GPS Smart Tip:</strong> If you concentrate your savings on <strong>{primaryGoal.title}</strong> first, you will unlock it in <strong>{primaryTimeline.months} months ({primaryTimeline.targetDate.fullString})</strong>. Once acquired, redirecting that {formatCurrency(primaryGoal.monthlySaving, currency)}/mo into your next target speeds up the entire roadmap!
          </div>
        </div>
      </div>
    </div>
  );
}
