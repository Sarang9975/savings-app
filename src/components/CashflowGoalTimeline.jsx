import React, { useState } from 'react';
import { Target, Calendar, CheckCircle2, TrendingUp, AlertTriangle, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { calculateVariableAffordability, formatCurrency } from '../utils/finance';

export default function CashflowGoalTimeline({ goals, currentSavings, forecast, useInterest, currency, onSimulate }) {
  const [selectedGoalId, setSelectedGoalId] = useState(goals[0] ? goals[0].id : null);

  const goal = goals.find(g => g.id === selectedGoalId) || goals[0];

  if (!goal) {
    return (
      <div className="glass-panel" style={{ padding: '32px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>No goals available to evaluate against your cash flow.</p>
      </div>
    );
  }

  const affordability = calculateVariableAffordability(goal, currentSavings, forecast, useInterest);

  return (
    <div className="glass-panel animate-slide-down" style={{ padding: '28px', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '10px', borderRadius: '14px' }}>
            <Target size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Affordability Window & Probability Curves</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem' }}>
              Maps your variable cashflow pipeline to realistic purchase windows under uncertainty
            </p>
          </div>
        </div>

        {/* Goal Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Evaluate Target:</label>
          <select 
            value={goal.id} 
            onChange={(e) => setSelectedGoalId(e.target.value)}
            className="form-select"
            style={{ width: 'auto', minWidth: '190px' }}
          >
            {goals.map(g => (
              <option key={g.id} value={g.id}>
                {g.icon || '🎯'} {g.title} ({formatCurrency(g.price, currency)})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3-Scenario Affordability Window Banner */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px',
        marginBottom: '28px'
      }}>
        {/* Scenario 1: Optimistic */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.14) 0%, rgba(6, 182, 212, 0.04) 100%)',
          border: '1px solid #06b6d4',
          borderRadius: 'var(--radius-md)',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#22d3ee', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              HIGH-INCOME SCENARIO
            </span>
            <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>BULL RUN</span>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>
            {affordability.optimisticDate.fullString}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#67e8f9', marginTop: '2px' }}>
            {affordability.optimisticMonths === 0 ? 'Ready today' : `in ${affordability.optimisticMonths} months (Close 90%+ gigs)`}
          </div>
        </div>

        {/* Scenario 2: Expected (Primary) */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.18) 0%, rgba(16, 185, 129, 0.05) 100%)',
          border: '2px solid #10b981',
          borderRadius: 'var(--radius-md)',
          padding: '20px',
          boxShadow: '0 8px 25px rgba(16, 185, 129, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              EXPECTED BASE SCENARIO
            </span>
            <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>MOST LIKELY</span>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399', marginTop: '4px' }}>
            {affordability.expectedDate.fullString}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#a7f3d0', marginTop: '2px' }}>
            {affordability.expectedMonths === 0 ? 'Ready today' : `in ${affordability.expectedMonths} months (Risk-adjusted cashflow)`}
          </div>
        </div>

        {/* Scenario 3: Conservative */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.14) 0%, rgba(245, 158, 11, 0.04) 100%)',
          border: '1px solid #f59e0b',
          borderRadius: 'var(--radius-md)',
          padding: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              CONSERVATIVE SCENARIO
            </span>
            <span className="badge badge-amber" style={{ fontSize: '0.65rem' }}>SAFE FLOOR</span>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>
            {affordability.conservativeDate.fullString}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#fde68a', marginTop: '2px' }}>
            {affordability.conservativeMonths === 0 ? 'Ready today' : `in ${affordability.conservativeMonths} months (Base income only)`}
          </div>
        </div>
      </div>

      {/* Probability Progression Track */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.3)',
        borderRadius: 'var(--radius-md)',
        padding: '22px',
        border: '1px solid var(--border-subtle)',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h4 style={{ fontSize: '0.98rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={16} color="#10b981" />
            Affordability Probability Timeline ({goal.title} — {formatCurrency(goal.price, currency)})
          </h4>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
            Initial Savings: {formatCurrency(currentSavings, currency)}
          </span>
        </div>

        {/* Step-by-Step Cumulative Surplus Bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {affordability.probabilityCurve.slice(1).map((step) => {
            const isAffordable = step.expectedCash >= goal.price;
            return (
              <div key={step.month} style={{ display: 'grid', gridTemplateColumns: '90px 1fr 140px', alignItems: 'center', gap: '16px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>
                  {step.monthLabel}
                </div>

                {/* Progress Visualizer */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>
                      Available Cash: <strong>{formatCurrency(step.expectedCash, currency)}</strong>
                    </span>
                    <strong style={{ color: isAffordable ? '#34d399' : '#38bdf8' }}>
                      {step.probability}% Probability
                    </strong>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${step.probability}%`,
                      height: '100%',
                      background: isAffordable ? 'linear-gradient(90deg, #10b981, #06b6d4)' : 'linear-gradient(90deg, #6366f1, #38bdf8)',
                      borderRadius: '9999px',
                      transition: 'width 0.4s ease'
                    }} />
                  </div>
                </div>

                {/* Status Tag */}
                <div style={{ textAlign: 'right' }}>
                  {isAffordable ? (
                    <span className="badge badge-emerald" style={{ fontSize: '0.68rem' }}>
                      <CheckCircle2 size={12} /> AFFORDABLE
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                      {formatCurrency(Math.max(0, goal.price - step.expectedCash), currency)} short
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Decision Rationale */}
      <div style={{
        padding: '14px 18px',
        background: 'rgba(16, 185, 129, 0.08)',
        border: '1px solid rgba(16, 185, 129, 0.25)',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '0.84rem',
        color: '#d1fae5'
      }}>
        <Sparkles size={18} color="#34d399" style={{ flexShrink: 0 }} />
        <div>
          <strong>Purchase Readiness:</strong> Your expected affordability window spans <strong>{affordability.affordabilityWindow}</strong>. By {affordability.expectedDate.monthName} {affordability.expectedDate.year}, your risk-adjusted probability crosses <strong>85%+</strong>, allowing you to comfortably buy without jeopardizing essential reserves!
        </div>
      </div>
    </div>
  );
}
