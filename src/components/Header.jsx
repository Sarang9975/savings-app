import React from 'react';
import { Compass, Sparkles, Plus, TrendingUp, ShieldCheck, RefreshCw, Zap, Briefcase } from 'lucide-react';
import { formatCurrency } from '../utils/finance';

export default function Header({
  goals,
  currentSavings,
  monthlyExpenses,
  riskAdjustedIncome,
  expectedSurplus,
  useInterest,
  setUseInterest,
  onOpenAddModal,
  onResetDefaults,
  currency,
  setCurrency
}) {
  return (
    <header className="glass-panel" style={{ padding: '24px 28px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
        {/* Brand & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #6366f1 0%, #10b981 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(99, 102, 241, 0.35)',
            fontSize: '26px'
          }}>
            🧭
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                GoalCast
              </h1>
              <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
                <Zap size={12} /> Variable Income GPS
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '2px' }}>
              Predict irregular cashflow, model pipeline probabilities & forecast goal affordability
            </p>
          </div>
        </div>

        {/* Global Controls & Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Currency Toggle */}
          <button
            onClick={() => setCurrency(prev => prev === 'INR' ? 'USD' : 'INR')}
            className="btn btn-secondary btn-sm"
            title="Toggle Currency"
          >
            {currency === 'INR' ? '₹ INR' : '$ USD'}
          </button>

          {/* 6% Interest Mode Toggle */}
          <button
            onClick={() => setUseInterest(prev => !prev)}
            className={`btn btn-sm ${useInterest ? 'btn-emerald' : 'btn-secondary'}`}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            title="Toggle 6% Annual Compound Interest"
          >
            <TrendingUp size={15} />
            <span>6% Interest: {useInterest ? 'ON' : 'OFF'}</span>
          </button>

          {/* Reset Demo Data */}
          <button
            onClick={onResetDefaults}
            className="btn btn-secondary btn-sm"
            title="Reset to recommended demo data"
          >
            <RefreshCw size={14} />
            <span>Reset Demo</span>
          </button>

          {/* Add Goal Button */}
          <button
            onClick={onOpenAddModal}
            className="btn btn-primary"
            style={{ fontWeight: 700 }}
          >
            <Plus size={18} />
            <span>Add New Goal</span>
          </button>
        </div>
      </div>

      {/* Quick Dashboard Stat Strip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '16px',
        marginTop: '24px',
        paddingTop: '20px',
        borderTop: '1px solid var(--border-subtle)'
      }}>
        <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Liquid Savings</span>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#38bdf8', marginTop: '2px' }}>
            {formatCurrency(currentSavings, currency)}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Ready in bank account</span>
        </div>

        <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Risk-Adjusted Income</span>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#6366f1', marginTop: '2px' }}>
            {formatCurrency(riskAdjustedIncome, currency)}<span style={{ fontSize: '0.8rem', fontWeight: 500 }}>/mo</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Weighted pipeline yield</span>
        </div>

        <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Living Expenses</span>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fb7185', marginTop: '2px' }}>
            {formatCurrency(monthlyExpenses, currency)}<span style={{ fontSize: '0.8rem', fontWeight: 500 }}>/mo</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Rent, food, essentials</span>
        </div>

        <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Net Monthly Surplus</span>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: expectedSurplus >= 0 ? '#10b981' : '#f43f5e', marginTop: '2px' }}>
            {expectedSurplus >= 0 ? '+' : ''}{formatCurrency(expectedSurplus, currency)}<span style={{ fontSize: '0.8rem', fontWeight: 500 }}>/mo</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {expectedSurplus >= 0 ? 'Surplus ready for goals' : '⚠️ Cashflow deficit'}
          </span>
        </div>
      </div>
    </header>
  );
}
