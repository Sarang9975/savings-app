import React, { useState } from 'react';
import { Brain, Sliders, ArrowUpDown, Sparkles, CheckCircle2, ChevronRight, Award } from 'lucide-react';
import { calculatePriorityScore, calculateGoalTimeline, formatCurrency } from '../utils/finance';

export default function AIPriorityEngine({ goals, onApplyOrder, useInterest, currency }) {
  // Configurable weights state
  const [weights, setWeights] = useState({
    urgency: 25,
    progress: 25,
    speed: 20,
    importance: 20,
    price: 10
  });

  const [strategyPreset, setStrategyPreset] = useState('balanced');

  // Handle Preset Selection
  const applyPreset = (preset) => {
    setStrategyPreset(preset);
    if (preset === 'balanced') {
      setWeights({ urgency: 25, progress: 25, speed: 20, importance: 20, price: 10 });
    } else if (preset === 'quickWins') {
      // Snowball method: prioritize speed and lower price
      setWeights({ urgency: 15, progress: 30, speed: 40, importance: 5, price: 10 });
    } else if (preset === 'urgencyFirst') {
      setWeights({ urgency: 50, progress: 15, speed: 15, importance: 15, price: 5 });
    } else if (preset === 'highImportance') {
      setWeights({ urgency: 20, progress: 10, speed: 10, importance: 50, price: 10 });
    }
  };

  // Compute scores and sort
  const scoredGoals = goals.map(goal => {
    const scoreResult = calculatePriorityScore(goal, weights);
    const timeline = calculateGoalTimeline(goal.price, goal.saved, goal.monthlySaving, useInterest);
    return {
      ...goal,
      priorityScore: scoreResult.score,
      factors: scoreResult.factors,
      timeline
    };
  }).sort((a, b) => b.priorityScore - a.priorityScore);

  const handleApplyOrder = () => {
    onApplyOrder(scoredGoals.map(g => g.id));
  };

  return (
    <div className="glass-panel animate-slide-down" style={{ padding: '28px', border: '1px solid rgba(168, 85, 247, 0.25)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'rgba(168, 85, 247, 0.2)', color: '#c084fc', padding: '10px', borderRadius: '14px' }}>
            <Brain size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>AI "What Should I Buy First?" Engine</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem' }}>
              Multi-criteria optimization engine balancing speed, urgency, current progress & financial affordability
            </p>
          </div>
        </div>

        {/* Apply Order Button */}
        <button onClick={handleApplyOrder} className="btn btn-primary" style={{ fontWeight: 700 }}>
          <ArrowUpDown size={16} />
          <span>Apply Recommended Sequence</span>
        </button>
      </div>

      {/* Preset Strategy Selector */}
      <div style={{ marginBottom: '24px' }}>
        <label className="form-label" style={{ marginBottom: '8px' }}>Select AI Prioritization Strategy:</label>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button 
            onClick={() => applyPreset('balanced')}
            className={`btn btn-sm ${strategyPreset === 'balanced' ? 'btn-primary' : 'btn-secondary'}`}
          >
            ⚖️ AI Balanced
          </button>
          <button 
            onClick={() => applyPreset('quickWins')}
            className={`btn btn-sm ${strategyPreset === 'quickWins' ? 'btn-primary' : 'btn-secondary'}`}
          >
            🚀 Quick Wins (Snowball)
          </button>
          <button 
            onClick={() => applyPreset('urgencyFirst')}
            className={`btn btn-sm ${strategyPreset === 'urgencyFirst' ? 'btn-primary' : 'btn-secondary'}`}
          >
            ⚡ Urgency First
          </button>
          <button 
            onClick={() => applyPreset('highImportance')}
            className={`btn btn-sm ${strategyPreset === 'highImportance' ? 'btn-primary' : 'btn-secondary'}`}
          >
            💎 Highest Importance First
          </button>
        </div>
      </div>

      {/* Weight Controls Box */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.25)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '20px',
        marginBottom: '26px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={16} color="#c084fc" />
            Customize Multi-Factor Weight Preferences
          </h4>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
            Sliders adjust the relative impact of each factor
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {/* Urgency */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Urgency Weight</span>
              <strong>{weights.urgency}%</strong>
            </div>
            <input 
              type="range" min="0" max="60" step="5"
              value={weights.urgency} 
              onChange={e => { setStrategyPreset('custom'); setWeights(w => ({ ...w, urgency: Number(e.target.value) })); }} 
            />
          </div>

          {/* Progress */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Current Progress</span>
              <strong>{weights.progress}%</strong>
            </div>
            <input 
              type="range" min="0" max="60" step="5"
              value={weights.progress} 
              onChange={e => { setStrategyPreset('custom'); setWeights(w => ({ ...w, progress: Number(e.target.value) })); }} 
            />
          </div>

          {/* Speed */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Completion Speed</span>
              <strong>{weights.speed}%</strong>
            </div>
            <input 
              type="range" min="0" max="60" step="5"
              value={weights.speed} 
              onChange={e => { setStrategyPreset('custom'); setWeights(w => ({ ...w, speed: Number(e.target.value) })); }} 
            />
          </div>

          {/* Importance */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>User Importance</span>
              <strong>{weights.importance}%</strong>
            </div>
            <input 
              type="range" min="0" max="60" step="5"
              value={weights.importance} 
              onChange={e => { setStrategyPreset('custom'); setWeights(w => ({ ...w, importance: Number(e.target.value) })); }} 
            />
          </div>

          {/* Price */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Affordability / Price</span>
              <strong>{weights.price}%</strong>
            </div>
            <input 
              type="range" min="0" max="60" step="5"
              value={weights.price} 
              onChange={e => { setStrategyPreset('custom'); setWeights(w => ({ ...w, price: Number(e.target.value) })); }} 
            />
          </div>
        </div>
      </div>

      {/* Recommended Ranked Goals List */}
      <div>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={18} color="#c084fc" />
          AI Ranked Sequence & Decision Breakdown
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {scoredGoals.map((item, idx) => {
            const rank = idx + 1;
            return (
              <div 
                key={item.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: rank === 1 ? '1.5px solid #a855f7' : '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '18px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}
              >
                {/* Left: Rank, Icon, Title */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '12px',
                    background: rank === 1 ? 'linear-gradient(135deg, #a855f7, #7c3aed)' : 'rgba(255, 255, 255, 0.06)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1rem',
                    boxShadow: rank === 1 ? '0 4px 14px rgba(168, 85, 247, 0.4)' : 'none'
                  }}>
                    #{rank}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.3rem' }}>{item.icon || '🎯'}</span>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{item.title}</h4>
                      {rank === 1 && (
                        <span className="badge badge-indigo" style={{ fontSize: '0.65rem' }}>
                          TOP RECOMMENDATION
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Target: {formatCurrency(item.price, currency)} | Saved: {formatCurrency(item.saved, currency)} ({item.timeline.progressPct}%)
                    </div>
                  </div>
                </div>

                {/* Middle: ETA & Priority Score */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Target ETA</div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: item.timeline.isZeroSaving ? '#f43f5e' : '#38bdf8' }}>
                      {item.timeline.isZeroSaving ? '⚠️ ₹0/month' : item.timeline.targetDate.fullString}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {item.timeline.isZeroSaving ? 'Indefinite' : `${item.timeline.months} months`}
                    </div>
                  </div>

                  <div style={{ textAlign: 'center', minWidth: '85px', background: 'rgba(0,0,0,0.3)', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>AI Score</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#c084fc' }}>
                      {item.priorityScore}/100
                    </div>
                  </div>
                </div>

                {/* Right: Why This Rank Callout */}
                <div style={{
                  flexBasis: '100%',
                  marginTop: '6px',
                  paddingTop: '10px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                  fontSize: '0.8rem',
                  color: '#d8b4fe'
                }}>
                  <strong>AI Rationale:</strong> {item.timeline.progressPct >= 50 
                    ? `High momentum: you are already ${item.timeline.progressPct}% saved toward this target!` 
                    : item.timeline.months <= 8 
                      ? `Quick achievable milestone: reachable in just ${item.timeline.months} months to generate instant saving momentum.` 
                      : `Significant milestone requiring steady persistence at ${formatCurrency(item.monthlySaving, currency)}/mo.`}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
