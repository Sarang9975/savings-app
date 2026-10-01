import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle, Info, HeartPulse, DollarSign } from 'lucide-react';
import { calculateBudgetSafety, formatCurrency } from '../utils/finance';

export default function BudgetSafetyCheck({ totalMonthlyCommitted, currency }) {
  // Financial profile state
  const [income, setIncome] = useState(60000);
  const [essentials, setEssentials] = useState(28000);
  const [emis, setEmis] = useState(7000);
  const [emergencyBuffer, setEmergencyBuffer] = useState(5000);

  const safety = calculateBudgetSafety(income, essentials, emis, emergencyBuffer, totalMonthlyCommitted);

  return (
    <div className="glass-panel animate-slide-down" style={{ padding: '28px', border: '1px solid rgba(6, 182, 212, 0.25)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'rgba(6, 182, 212, 0.2)', color: '#22d3ee', padding: '10px', borderRadius: '14px' }}>
            <ShieldCheck size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>"Can I Actually Afford It?" Safety Guard</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem' }}>
              Stress-test your monthly saving goals against living expenses to ensure financial stability
            </p>
          </div>
        </div>

        <span className={`badge ${safety.healthStatus === 'healthy' ? 'badge-emerald' : safety.healthStatus === 'tight' ? 'badge-amber' : 'badge-rose'}`}>
          {safety.healthStatus === 'healthy' ? '🟢 SAFE CAPACITY' : safety.healthStatus === 'tight' ? '🟡 NEAR CAPACITY' : '🔴 OVERSTRETCHED'}
        </span>
      </div>

      {/* Safety Gauge / Status Card */}
      <div style={{
        background: safety.healthStatus === 'healthy' 
          ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.14) 0%, rgba(6, 182, 212, 0.08) 100%)' 
          : safety.healthStatus === 'tight'
            ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.14) 0%, rgba(245, 158, 11, 0.05) 100%)'
            : 'linear-gradient(135deg, rgba(244, 63, 94, 0.16) 0%, rgba(244, 63, 94, 0.06) 100%)',
        border: `1.5px solid ${safety.healthStatus === 'healthy' ? '#10b981' : safety.healthStatus === 'tight' ? '#f59e0b' : '#f43f5e'}`,
        borderRadius: 'var(--radius-md)',
        padding: '20px 24px',
        marginBottom: '26px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '14px' }}>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Safe Monthly Goal Saving Capacity
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>
              {formatCurrency(safety.safeDisposableCapacity, currency)}<span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-muted)' }}>/month</span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
              Total Goals Committed
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: safety.healthStatus === 'overstretched' ? '#fb7185' : '#38bdf8', marginTop: '2px' }}>
              {formatCurrency(totalMonthlyCommitted, currency)}<span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-muted)' }}>/month</span>
            </div>
          </div>
        </div>

        {/* Capacity Utilization Progress Bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Capacity Utilization Ratio</span>
            <strong style={{ color: safety.healthStatus === 'overstretched' ? '#f43f5e' : '#10b981' }}>
              {safety.utilizationRatio}% of safe capacity used
            </strong>
          </div>
          <div style={{ height: '10px', background: 'rgba(0, 0, 0, 0.4)', borderRadius: '9999px', overflow: 'hidden' }}>
            <div style={{
              width: `${Math.min(100, safety.utilizationRatio)}%`,
              height: '100%',
              background: safety.healthStatus === 'overstretched' ? '#f43f5e' : safety.healthStatus === 'tight' ? '#f59e0b' : '#10b981',
              borderRadius: '9999px',
              transition: 'width 0.4s ease'
            }} />
          </div>
        </div>

        <p style={{ fontSize: '0.86rem', color: 'var(--text-main)', marginTop: '14px', lineHeight: 1.5 }}>
          {safety.message}
        </p>
      </div>

      {/* Input Breakdown Form */}
      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <DollarSign size={18} color="#06b6d4" />
        Configure Your Monthly Cashflow
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div className="form-group">
          <label className="form-label">Monthly Net Income</label>
          <input
            type="number"
            className="form-input"
            value={income}
            onChange={(e) => setIncome(Number(e.target.value))}
            min="0"
            step="1000"
          />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Take-home salary / earnings</span>
        </div>

        <div className="form-group">
          <label className="form-label">Essential Living Costs</label>
          <input
            type="number"
            className="form-input"
            value={essentials}
            onChange={(e) => setEssentials(Number(e.target.value))}
            min="0"
            step="1000"
          />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Rent, food, groceries, bills</span>
        </div>

        <div className="form-group">
          <label className="form-label">Existing EMIs / Loans</label>
          <input
            type="number"
            className="form-input"
            value={emis}
            onChange={(e) => setEmis(Number(e.target.value))}
            min="0"
            step="500"
          />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Vehicle, personal, education EMI</span>
        </div>

        <div className="form-group">
          <label className="form-label">Emergency Buffer</label>
          <input
            type="number"
            className="form-input"
            value={emergencyBuffer}
            onChange={(e) => setEmergencyBuffer(Number(e.target.value))}
            min="0"
            step="500"
          />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Untouchable monthly safety cushion</span>
        </div>
      </div>

      {/* 50/30/20 Rule Tip */}
      <div style={{
        marginTop: '12px',
        padding: '14px 16px',
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '0.84rem',
        color: 'var(--text-muted)'
      }}>
        <Info size={18} color="#22d3ee" style={{ flexShrink: 0 }} />
        <div>
          <strong>Financial Rule of Thumb (50/30/20 Rule):</strong> Aim to spend at most 50% on essentials, 30% on lifestyle/wants, and allocate 20% ({formatCurrency(income * 0.2, currency)}) strictly for savings and goal milestones!
        </div>
      </div>
    </div>
  );
}
