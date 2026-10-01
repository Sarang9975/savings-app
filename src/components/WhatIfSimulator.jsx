import React, { useState, useEffect } from 'react';
import { Sliders, Sparkles, TrendingUp, TrendingDown, ArrowRight, Check, RefreshCw, Zap } from 'lucide-react';
import { calculateGoalTimeline, formatCurrency } from '../utils/finance';

export default function WhatIfSimulator({ goals, activeGoalId, onUpdateGoal, useInterest, currency }) {
  const [selectedGoalId, setSelectedGoalId] = useState(activeGoalId || (goals[0] ? goals[0].id : null));

  // Find goal
  const currentGoal = goals.find(g => g.id === selectedGoalId) || goals[0];

  // Simulation variables
  const [simMonthly, setSimMonthly] = useState(currentGoal ? currentGoal.monthlySaving : 5000);
  const [simBonus, setSimBonus] = useState(0);
  const [priceChangePct, setPriceChangePct] = useState(0);
  const [skipMonths, setSkipMonths] = useState(0);

  // Sync when activeGoalId or selectedGoal changes
  useEffect(() => {
    if (currentGoal) {
      setSimMonthly(currentGoal.monthlySaving);
      setSimBonus(0);
      setPriceChangePct(0);
      setSkipMonths(0);
    }
  }, [selectedGoalId]);

  if (!currentGoal) {
    return (
      <div className="glass-panel" style={{ padding: '32px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>No goals available to simulate. Create a goal first!</p>
      </div>
    );
  }

  // Original timeline
  const baseTimeline = calculateGoalTimeline(currentGoal.price, currentGoal.saved, currentGoal.monthlySaving, useInterest);

  // Simulated calculations
  const simulatedPrice = Math.max(1000, Math.round(currentGoal.price * (1 + priceChangePct / 100)));
  const simulatedInitialSaved = currentGoal.saved + simBonus;

  // If skipping months, add the skip delay to effective months
  const simTimelineRaw = calculateGoalTimeline(simulatedPrice, simulatedInitialSaved, simMonthly, useInterest);
  const effectiveSimMonths = simTimelineRaw.isZeroSaving ? Infinity : simTimelineRaw.months + skipMonths;
  
  // Recompute date with skip months
  const effectiveSimDate = simTimelineRaw.isZeroSaving 
    ? simTimelineRaw.targetDate 
    : calculateGoalTimeline(simulatedPrice, simulatedInitialSaved, simMonthly, useInterest).targetDate;

  // Month delta
  let monthDiff = 0;
  if (!baseTimeline.isZeroSaving && !simTimelineRaw.isZeroSaving && baseTimeline.months !== Infinity && effectiveSimMonths !== Infinity) {
    monthDiff = baseTimeline.months - effectiveSimMonths;
  }

  // Handle Apply to Goal
  const handleApply = () => {
    onUpdateGoal(currentGoal.id, {
      ...currentGoal,
      price: simulatedPrice,
      saved: simulatedInitialSaved,
      monthlySaving: simMonthly
    });
  };

  // Reset to original
  const handleReset = () => {
    setSimMonthly(currentGoal.monthlySaving);
    setSimBonus(0);
    setPriceChangePct(0);
    setSkipMonths(0);
  };

  return (
    <div className="glass-panel animate-slide-down" style={{ padding: '28px', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', padding: '10px', borderRadius: '14px' }}>
            <Sliders size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>"What If?" Financial Simulator</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem' }}>
              Experiment with saving rates, bonus windfalls, inflation & pauses to preview future outcomes
            </p>
          </div>
        </div>

        {/* Goal Selector Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Simulate Goal:</label>
          <select 
            value={currentGoal.id} 
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

      {/* Simulator HUD: Before vs After Delta Box */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '16px',
        marginBottom: '28px'
      }}>
        {/* Baseline State */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.35)',
          padding: '20px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            CURRENT TRAJECTORY
          </span>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
            {baseTimeline.isZeroSaving ? 'Indefinite (₹0/mo)' : `${baseTimeline.months} Months`}
          </div>
          <div style={{ fontSize: '0.9rem', color: '#94a3b8', marginTop: '2px' }}>
            Target: <strong>{baseTimeline.targetDate.fullString}</strong>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '8px' }}>
            Monthly: {formatCurrency(currentGoal.monthlySaving, currency)} | Saved: {formatCurrency(currentGoal.saved, currency)}
          </div>
        </div>

        {/* Simulated State */}
        <div style={{
          background: monthDiff > 0 
            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.16) 0%, rgba(16, 185, 129, 0.05) 100%)' 
            : monthDiff < 0 
              ? 'linear-gradient(135deg, rgba(244, 63, 94, 0.16) 0%, rgba(244, 63, 94, 0.05) 100%)' 
              : 'rgba(99, 102, 241, 0.12)',
          padding: '20px',
          borderRadius: 'var(--radius-md)',
          border: `1.5px solid ${monthDiff > 0 ? '#10b981' : monthDiff < 0 ? '#f43f5e' : '#6366f1'}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              SIMULATED OUTCOME
            </span>
            {monthDiff !== 0 && (
              <span className={`badge ${monthDiff > 0 ? 'badge-emerald' : 'badge-rose'}`} style={{ fontSize: '0.72rem' }}>
                {monthDiff > 0 ? `⚡ ${monthDiff} MONTHS FASTER` : `⏳ DELAYED BY ${Math.abs(monthDiff)} MONTHS`}
              </span>
            )}
          </div>

          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: monthDiff > 0 ? '#34d399' : monthDiff < 0 ? '#fb7185' : '#ffffff', marginTop: '4px' }}>
            {simTimelineRaw.isZeroSaving ? 'Indefinite (₹0/mo)' : `${effectiveSimMonths} Months`}
          </div>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#38bdf8', marginTop: '2px' }}>
            New ETA: {effectiveSimDate.fullString}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>
            Monthly: {formatCurrency(simMonthly, currency)} | Saved: {formatCurrency(simulatedInitialSaved, currency)} | Target: {formatCurrency(simulatedPrice, currency)}
          </div>
        </div>
      </div>

      {/* Interactive Sliders Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        {/* Slider 1: Monthly Saving Rate */}
        <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <label className="form-label" style={{ marginBottom: 0 }}>Monthly Saving</label>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#6366f1' }}>
              {formatCurrency(simMonthly, currency)}/mo
            </span>
          </div>
          <input
            type="range"
            min="0"
            max={Math.max(30000, currentGoal.monthlySaving * 3)}
            step="500"
            value={simMonthly}
            onChange={(e) => setSimMonthly(Number(e.target.value))}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '8px' }}>
            <span>₹0 (Paused)</span>
            <span>{formatCurrency(currentGoal.monthlySaving, currency)} (Current)</span>
            <span>{formatCurrency(Math.max(30000, currentGoal.monthlySaving * 3), currency)}</span>
          </div>

          {/* Quick Shortcuts */}
          <div style={{ display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
            <button onClick={() => setSimMonthly(prev => Math.max(0, prev - 1000))} className="btn btn-secondary btn-sm" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
              -₹1,000
            </button>
            <button onClick={() => setSimMonthly(prev => prev + 1000)} className="btn btn-secondary btn-sm" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
              +₹1,000
            </button>
            <button onClick={() => setSimMonthly(prev => prev + 2500)} className="btn btn-secondary btn-sm" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
              +₹2,500
            </button>
            <button onClick={() => setSimMonthly(Math.round(currentGoal.monthlySaving * 1.5 / 500) * 500)} className="btn btn-secondary btn-sm" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
              +50% Boost
            </button>
          </div>
        </div>

        {/* Slider 2: Lump Sum Bonus Injection */}
        <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <label className="form-label" style={{ marginBottom: 0 }}>Bonus / Windfall Lump Sum</label>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f59e0b' }}>
              +{formatCurrency(simBonus, currency)}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100000"
            step="5000"
            value={simBonus}
            onChange={(e) => setSimBonus(Number(e.target.value))}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '8px' }}>
            <span>₹0</span>
            <span>₹50,000</span>
            <span>₹1,00,000</span>
          </div>

          {/* Quick Bonus Buttons */}
          <div style={{ display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
            <button onClick={() => setSimBonus(0)} className="btn btn-secondary btn-sm" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
              Reset
            </button>
            <button onClick={() => setSimBonus(10000)} className="btn btn-secondary btn-sm" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
              +₹10,000 Bonus
            </button>
            <button onClick={() => setSimBonus(25000)} className="btn btn-secondary btn-sm" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
              +₹25,000 Tax Refund
            </button>
            <button onClick={() => setSimBonus(50000)} className="btn btn-secondary btn-sm" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
              +₹50,000 Festival Bonus
            </button>
          </div>
        </div>

        {/* Slider 3: Price Change / Inflation / Discount */}
        <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <label className="form-label" style={{ marginBottom: 0 }}>Price Adjustment / Discount</label>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: priceChangePct > 0 ? '#f43f5e' : priceChangePct < 0 ? '#34d399' : '#fff' }}>
              {priceChangePct > 0 ? `+${priceChangePct}%` : `${priceChangePct}%`} ({formatCurrency(simulatedPrice, currency)})
            </span>
          </div>
          <input
            type="range"
            min="-25"
            max="25"
            step="5"
            value={priceChangePct}
            onChange={(e) => setPriceChangePct(Number(e.target.value))}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '8px' }}>
            <span>-25% Discount</span>
            <span>Original Price</span>
            <span>+25% Inflation</span>
          </div>

          {/* Quick Price Buttons */}
          <div style={{ display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
            <button onClick={() => setPriceChangePct(-15)} className="btn btn-secondary btn-sm" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
              -15% Festive Sale
            </button>
            <button onClick={() => setPriceChangePct(0)} className="btn btn-secondary btn-sm" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
              Normal (0%)
            </button>
            <button onClick={() => setPriceChangePct(10)} className="btn btn-secondary btn-sm" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
              +10% Tech Price Hike
            </button>
          </div>
        </div>

        {/* Slider 4: Skip Months Holiday Pause */}
        <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <label className="form-label" style={{ marginBottom: 0 }}>Skip Months (Holiday / Travel Pause)</label>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: skipMonths > 0 ? '#f43f5e' : '#fff' }}>
              {skipMonths} {skipMonths === 1 ? 'Month' : 'Months'} Skipped
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="6"
            step="1"
            value={skipMonths}
            onChange={(e) => setSkipMonths(Number(e.target.value))}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '8px' }}>
            <span>0 (No skip)</span>
            <span>3 Months Pause</span>
            <span>6 Months Pause</span>
          </div>

          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '10px' }}>
            {skipMonths === 0 ? 'Consistent monthly saving flow.' : `Pauses saving contributions for ${skipMonths} months for emergencies or vacations.`}
          </div>
        </div>
      </div>

      {/* Action Footer: Apply or Reset */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '18px' }}>
        <button onClick={handleReset} className="btn btn-secondary">
          <RefreshCw size={15} />
          <span>Reset Simulation</span>
        </button>
        <button onClick={handleApply} className="btn btn-emerald" style={{ fontWeight: 700 }}>
          <Check size={16} />
          <span>Apply These Values to Goal</span>
        </button>
      </div>
    </div>
  );
}
