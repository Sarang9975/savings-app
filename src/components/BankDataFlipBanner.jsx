import React, { useState } from 'react';
import {
  Building2, TrendingUp, Zap, RefreshCw, X,
  ArrowRight, CheckCircle2, Wallet, ChevronUp
} from 'lucide-react';
import { formatCurrency } from '../utils/finance';

/**
 * Shown after a bank connection.
 * Displays a dramatic before/after comparison — the "shock moment" for judges.
 * Before: manually entered income (typed guesses)
 * After:  bank-derived income (real transaction history)
 */
export default function BankDataFlipBanner({
  account,
  analytics,
  streams,
  manualStreams,    // the income streams BEFORE connection
  manualExpenses,  // monthly expenses BEFORE connection
  currentSavings,
  onDismiss,
  currency = 'INR'
}) {
  const [expanded, setExpanded] = useState(true);

  // BEFORE: sum of manual stream amounts weighted by probability
  const manualExpectedIncome = manualStreams.reduce((s, st) => s + st.amount * (st.probability / 100), 0);
  const manualSurplus = manualExpectedIncome - manualExpenses;

  // AFTER: bank-derived
  const bankIncome   = analytics.avgMonthlyIncome;
  const bankExpenses = analytics.avgMonthlyExpenses;
  const bankSurplus  = analytics.avgSurplus;

  const surplusDelta = bankSurplus - manualSurplus;
  const surplusGain  = surplusDelta > 0;

  if (!expanded) {
    return (
      <div
        onClick={() => setExpanded(true)}
        style={{
          background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(6,182,212,0.1))',
          border: '1.5px solid rgba(16,185,129,0.4)',
          borderRadius: '12px',
          padding: '12px 18px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          cursor: 'pointer', marginBottom: '24px'
        }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle2 size={18} color="#10b981" />
          <strong style={{ color: '#6ee7b7', fontSize: '0.9rem' }}>
            {account.bank} connected · Avg. monthly income: {formatCurrency(bankIncome, currency)}
          </strong>
        </div>
        <ChevronUp size={16} color="var(--text-dim)" />
      </div>
    );
  }

  return (
    <div style={{
      background: 'linear-gradient(165deg, rgba(2,10,25,0.98), rgba(5,15,30,0.98))',
      border: '1.5px solid rgba(16,185,129,0.5)',
      borderRadius: '16px',
      overflow: 'hidden',
      marginBottom: '24px',
      boxShadow: '0 8px 40px rgba(16,185,129,0.12), 0 0 0 1px rgba(255,255,255,0.05)'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(6,182,212,0.15))',
        borderBottom: '1px solid rgba(16,185,129,0.25)',
        padding: '14px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Building2 size={20} color="#10b981" />
          <div>
            <strong style={{ color: '#6ee7b7', fontSize: '0.95rem' }}>
              🏦 {account.bank} Connected · {account.accountMasked}
            </strong>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
              Setu AA Sandbox · {account.fetchedAt ? new Date(account.fetchedAt).toLocaleTimeString() : ''} · Consent ID: {account.consentId}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.7rem', background: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.3)', padding: '3px 10px', borderRadius: '99px' }}>
            ⚠️ Sandbox Data
          </span>
          <button onClick={onDismiss} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
            <X size={18} />
          </button>
          <button onClick={() => setExpanded(false)} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: '0.78rem' }}>
            Minimise
          </button>
        </div>
      </div>

      {/* Before / After grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '0', alignItems: 'stretch' }}>

        {/* BEFORE column */}
        <div style={{ padding: '20px', background: 'rgba(244,63,94,0.06)' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: '#f87171', letterSpacing: '0.06em', marginBottom: '12px' }}>
            📝 Before — Typed Guesses
          </div>
          {[
            { label: 'Income Sources', value: `${manualStreams.length} streams`, dim: 'Manually estimated' },
            { label: 'Expected Income', value: formatCurrency(Math.round(manualExpectedIncome), currency), dim: 'Risk-weighted' },
            { label: 'Monthly Expenses', value: formatCurrency(manualExpenses, currency), dim: 'User entered' },
            { label: 'Est. Monthly Surplus', value: formatCurrency(Math.round(manualSurplus), currency), dim: 'Based on guesses', highlight: manualSurplus < 0 ? '#f87171' : '#94a3b8' },
            { label: 'Current Savings', value: formatCurrency(currentSavings, currency), dim: 'User entered' },
          ].map((row, i) => (
            <div key={i} style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>{row.label}</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: row.highlight || '#94a3b8' }}>{row.value}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>{row.dim}</div>
            </div>
          ))}
        </div>

        {/* Arrow */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '0 16px',
          background: 'rgba(0,0,0,0.3)',
          borderLeft: '1px solid rgba(255,255,255,0.05)',
          borderRight: '1px solid rgba(255,255,255,0.05)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <Zap size={24} color="#f59e0b" />
            <ArrowRight size={20} color="#6366f1" />
            <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
              Bank Data
            </span>
          </div>
        </div>

        {/* AFTER column */}
        <div style={{ padding: '20px', background: 'rgba(16,185,129,0.06)' }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', color: '#10b981', letterSpacing: '0.06em', marginBottom: '12px' }}>
            🏦 After — Real Transactions
          </div>
          {[
            { label: 'Income Sources', value: `${streams.length} detected`, dim: 'From 3mo of history', color: '#34d399' },
            { label: 'Avg Monthly Income', value: formatCurrency(bankIncome, currency), dim: 'Actual deposits', color: '#34d399' },
            { label: 'Avg Monthly Expenses', value: formatCurrency(bankExpenses, currency), dim: 'Actual debits', color: '#fcd34d' },
            {
              label: 'Avg Monthly Surplus',
              value: formatCurrency(bankSurplus, currency),
              dim: surplusGain ? `↑ ${formatCurrency(Math.abs(surplusDelta), currency)} more than estimated` : `↓ ${formatCurrency(Math.abs(surplusDelta), currency)} less than estimated`,
              color: bankSurplus > 0 ? '#34d399' : '#f87171'
            },
            { label: 'Detected Balance', value: formatCurrency(account.balance, currency), dim: 'As of today', color: '#38bdf8' },
          ].map((row, i) => (
            <div key={i} style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 600 }}>{row.label}</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: row.color || '#fff' }}>{row.value}</div>
              <div style={{ fontSize: '0.68rem', color: row.color ? `${row.color}99` : 'var(--text-dim)', fontStyle: 'italic' }}>{row.dim}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom insight bar */}
      <div style={{
        background: surplusGain
          ? 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(6,182,212,0.08))'
          : 'linear-gradient(135deg, rgba(244,63,94,0.12), rgba(245,158,11,0.08))',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '12px 20px',
        fontSize: '0.83rem',
        color: surplusGain ? '#6ee7b7' : '#fca5a5',
        display: 'flex', alignItems: 'center', gap: '10px'
      }}>
        <TrendingUp size={16} />
        {surplusGain
          ? `Your real surplus is ${formatCurrency(surplusDelta, currency)} higher than you estimated. Your goals are closer than you thought. 🎉`
          : `Your real surplus is ${formatCurrency(Math.abs(surplusDelta), currency)} lower than you estimated. Better to know now — GoalCast has recalculated your ETAs.`
        }
      </div>
    </div>
  );
}
