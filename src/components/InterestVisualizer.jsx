import React, { useState } from 'react';
import { TrendingUp, Coins, Calendar, Sparkles, Award, ArrowRight, ShieldCheck } from 'lucide-react';
import { calculateGoalTimeline, formatCurrency, ANNUAL_INTEREST_RATE } from '../utils/finance';

export default function InterestVisualizer({ goals, currency }) {
  const [selectedGoalId, setSelectedGoalId] = useState(goals[0] ? goals[0].id : null);

  const goal = goals.find(g => g.id === selectedGoalId) || goals[0];

  if (!goal) {
    return (
      <div className="glass-panel" style={{ padding: '32px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>No goals available. Add a goal to see compound growth!</p>
      </div>
    );
  }

  // Calculations for both scenarios
  const withoutInterest = calculateGoalTimeline(goal.price, goal.saved, goal.monthlySaving, false);
  const withInterest = calculateGoalTimeline(goal.price, goal.saved, goal.monthlySaving, true);

  const monthsSaved = Math.max(0, withoutInterest.months - withInterest.months);
  const interestEarned = withInterest.interestEarned;

  // Build a timeline projection (every 3 or 6 months)
  const projectionSteps = [];
  const totalMonths = Math.min(48, Math.max(12, withInterest.months || 12));
  const monthlyRate = ANNUAL_INTEREST_RATE / 12;

  let currentWithInterest = goal.saved;
  let currentWithoutInterest = goal.saved;

  const now = new Date();

  for (let m = 1; m <= totalMonths; m++) {
    // With 6% interest:
    currentWithInterest = currentWithInterest * (1 + monthlyRate) + goal.monthlySaving;
    // Without interest:
    currentWithoutInterest = currentWithoutInterest + goal.monthlySaving;

    // Sample milestone every 3 months or upon completion
    if (m % 3 === 0 || m === withInterest.months || m === withoutInterest.months) {
      const stepDate = new Date(now.getFullYear(), now.getMonth() + m, 1);
      const label = `${stepDate.toLocaleString('default', { month: 'short' })} ${stepDate.getFullYear()}`;
      projectionSteps.push({
        month: m,
        dateLabel: label,
        withInterest: Math.round(currentWithInterest),
        withoutInterest: Math.round(currentWithoutInterest),
        interestShare: Math.round(Math.max(0, currentWithInterest - currentWithoutInterest))
      });
    }
  }

  return (
    <div className="glass-panel animate-slide-down" style={{ padding: '28px', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '10px', borderRadius: '14px' }}>
            <TrendingUp size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>6% Yearly Interest & Compound Visualizer</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem' }}>
              Compare flat piggy-bank savings vs high-yield savings growing at 6% APY compounded monthly
            </p>
          </div>
        </div>

        {/* Goal Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Goal:</label>
          <select 
            value={goal.id} 
            onChange={(e) => setSelectedGoalId(e.target.value)}
            className="form-select"
            style={{ width: 'auto', minWidth: '180px' }}
          >
            {goals.map(g => (
              <option key={g.id} value={g.id}>
                {g.icon || '🎯'} {g.title} ({formatCurrency(g.price, currency)})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Side-by-Side Comparison Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        marginBottom: '28px'
      }}>
        {/* Card 1: Flat 0% Interest */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.3)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '22px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              SCENARIO 1: CASH / 0% INTEREST
            </span>
            <span className="badge badge-indigo" style={{ fontSize: '0.65rem' }}>STANDARD</span>
          </div>

          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '4px' }}>
            {withoutInterest.isZeroSaving ? 'Indefinite' : `${withoutInterest.months} Months`}
          </div>
          <div style={{ fontSize: '0.95rem', color: '#94a3b8', marginBottom: '16px' }}>
            Ready by: <strong style={{ color: '#fff' }}>{withoutInterest.targetDate.fullString}</strong>
          </div>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-dim)' }}>Out of pocket savings:</span>
              <strong>{formatCurrency(withoutInterest.totalDeposited, currency)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-dim)' }}>Interest growth:</span>
              <strong style={{ color: 'var(--text-dim)' }}>₹0 (No interest)</strong>
            </div>
          </div>
        </div>

        {/* Card 2: 6% Annual Compound Interest */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.08) 100%)',
          border: '1.5px solid #10b981',
          borderRadius: 'var(--radius-md)',
          padding: '22px',
          boxShadow: '0 8px 30px rgba(16, 185, 129, 0.15)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              SCENARIO 2: 6.0% ANNUAL COMPOUND
            </span>
            <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>COMPOUND BOOST ⚡</span>
          </div>

          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34d399', marginBottom: '4px' }}>
            {withInterest.isZeroSaving ? 'Indefinite' : `${withInterest.months} Months`}
          </div>
          <div style={{ fontSize: '0.95rem', color: '#6ee7b7', marginBottom: '16px' }}>
            Ready by: <strong style={{ color: '#fff' }}>{withInterest.targetDate.fullString}</strong>
          </div>

          <div style={{ borderTop: '1px solid rgba(16, 185, 129, 0.25)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.84rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#a7f3d0' }}>Free Interest Earned:</span>
              <strong style={{ color: '#34d399' }}>+{formatCurrency(interestEarned, currency)}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#a7f3d0' }}>Timeline Acceleration:</span>
              <strong style={{ color: '#38bdf8' }}>{monthsSaved} Months Sooner!</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Inspirational Compound Banner */}
      <div style={{
        background: 'rgba(99, 102, 241, 0.08)',
        border: '1px solid rgba(99, 102, 241, 0.25)',
        borderRadius: 'var(--radius-md)',
        padding: '16px 20px',
        marginBottom: '26px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px'
      }}>
        <div style={{ background: '#6366f1', color: '#fff', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Coins size={20} />
        </div>
        <div>
          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#e0e7ff' }}>
            💰 Your money is working while you're saving!
          </h4>
          <p style={{ fontSize: '0.84rem', color: '#c7d2fe', marginTop: '2px' }}>
            At 6% yearly interest, you earn interest on both your initial deposit and your growing monthly contributions. Over {withInterest.months} months, compound interest provides <strong>{formatCurrency(interestEarned, currency)}</strong> of your target for free!
          </p>
        </div>
      </div>

      {/* Interactive Growth Projection Table & Visual Bars */}
      <div style={{
        background: 'rgba(10, 14, 25, 0.7)',
        borderRadius: 'var(--radius-md)',
        padding: '22px',
        border: '1px solid var(--border-subtle)'
      }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={18} color="#10b981" />
          Compound Growth Timeline Projection ({goal.title})
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', textAlign: 'left', color: 'var(--text-dim)', fontSize: '0.76rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '10px 12px' }}>Timeline</th>
                <th style={{ padding: '10px 12px' }}>Date</th>
                <th style={{ padding: '10px 12px' }}>Without Interest (0%)</th>
                <th style={{ padding: '10px 12px' }}>With 6% APY</th>
                <th style={{ padding: '10px 12px' }}>Free Compound Bonus</th>
                <th style={{ padding: '10px 12px' }}>Target Status</th>
              </tr>
            </thead>
            <tbody>
              {projectionSteps.map((step) => {
                const isMet = step.withInterest >= goal.price;
                return (
                  <tr 
                    key={step.month}
                    style={{ 
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      background: isMet ? 'rgba(16, 185, 129, 0.06)' : 'transparent'
                    }}
                  >
                    <td style={{ padding: '12px', fontWeight: 700 }}>Month {step.month}</td>
                    <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{step.dateLabel}</td>
                    <td style={{ padding: '12px' }}>{formatCurrency(step.withoutInterest, currency)}</td>
                    <td style={{ padding: '12px', fontWeight: 700, color: '#34d399' }}>
                      {formatCurrency(step.withInterest, currency)}
                    </td>
                    <td style={{ padding: '12px', color: '#fbbf24', fontWeight: 600 }}>
                      +{formatCurrency(step.interestShare, currency)}
                    </td>
                    <td style={{ padding: '12px' }}>
                      {isMet ? (
                        <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>
                          🎯 REACHED!
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                          {Math.round((step.withInterest / goal.price) * 100)}%
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
