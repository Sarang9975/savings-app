import React, { useState } from 'react';
import {
  ArrowUp, ArrowDown, Edit3, Trash2, Clock,
  AlertTriangle, CheckCircle2, ChevronDown, ChevronUp,
  Sparkles, TrendingUp
} from 'lucide-react';
import { calculateGoalTimeline, formatCurrency, getTargetDate } from '../utils/finance';

export default function ProductionGoalCard({
  goal,
  rank,
  total,
  useInterest,
  currency,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  onUpdateMonthlySaving
}) {
  const [showSchedule, setShowSchedule] = useState(false);

  // Compute timeline
  const tl = calculateGoalTimeline(goal.price, goal.saved, goal.monthlySaving, useInterest);
  const targetDate = tl.isZeroSaving ? null : getTargetDate(tl.months);
  const pct = Math.min(100, Math.max(0, tl.progressPct || 0));
  const remaining = Math.max(0, goal.price - goal.saved);
  const isCompleted = pct >= 100 || tl.isAchieved;

  const handleSliderChange = (e) => {
    const val = Number(e.target.value);
    if (onUpdateMonthlySaving) {
      onUpdateMonthlySaving(goal.id, val);
    }
  };

  const handleStep = (delta) => {
    const nextVal = Math.max(0, (goal.monthlySaving || 0) + delta);
    if (onUpdateMonthlySaving) {
      onUpdateMonthlySaving(goal.id, nextVal);
    }
  };

  return (
    <div className={`prod-goal-card ${rank === 1 ? 'top-priority' : ''} ${isCompleted ? 'completed' : tl.isZeroSaving ? 'danger' : ''}`}>
      {/* ── HEADER: Rank, Icon, Title, Actions ────────────────── */}
      <div className="prod-goal-header">
        <div className="prod-goal-meta">
          <div className="prod-goal-icon-box">
            {goal.icon || '🎯'}
          </div>
          <div className="prod-goal-title-wrap">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="prod-goal-title">{goal.title}</span>
              {isCompleted && (
                <span className="badge badge-emerald">
                  <CheckCircle2 size={11} /> Achieved
                </span>
              )}
            </div>
            <div className="prod-goal-tags">
              <span className="badge badge-neutral" style={{ textTransform: 'capitalize' }}>
                {goal.category || 'General'}
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Priority #{rank} {rank === 1 && '· Primary Goal'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="prod-goal-actions">
          <button
            className="btn btn-ghost btn-icon btn-sm"
            onClick={() => onMoveUp(goal.id)}
            disabled={rank === 1}
            title="Move up priority"
          >
            <ArrowUp size={13} />
          </button>
          <button
            className="btn btn-ghost btn-icon btn-sm"
            onClick={() => onMoveDown(goal.id)}
            disabled={rank === total}
            title="Move down priority"
          >
            <ArrowDown size={13} />
          </button>
          <button
            className="btn btn-ghost btn-icon btn-sm"
            onClick={() => onEdit(goal)}
            title="Edit goal details"
          >
            <Edit3 size={13} />
          </button>
          <button
            className="btn btn-ghost btn-icon btn-sm"
            onClick={() => onDelete(goal.id)}
            title="Delete goal"
            style={{ color: '#fb7185' }}
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* ── MONEY & PROGRESS ROW ─────────────────────────────── */}
      <div>
        <div className="prod-goal-amount-row" style={{ marginBottom: '10px' }}>
          <div>
            <span className="prod-goal-current-amount">
              {formatCurrency(goal.saved, currency)}
            </span>
            <span className="prod-goal-target-amount" style={{ marginLeft: '8px' }}>
              of {formatCurrency(goal.price, currency)}
            </span>
          </div>
          <span className="prod-goal-pct-pill">
            {pct.toFixed(1)}%
          </span>
        </div>

        {/* Dual-layer progress bar */}
        <div className="prod-progress-track">
          <div
            className={`prod-progress-fill-base ${isCompleted ? 'emerald' : tl.isZeroSaving ? 'rose' : ''}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* ── MONTHLY SAVINGS ADJUSTMENT (Problem Statement 12) ──── */}
      <div className="prod-saving-control">
        <div className="prod-saving-header">
          <span className="prod-saving-label">Monthly Allocation</span>
          <span className="prod-saving-val">
            {formatCurrency(goal.monthlySaving, currency)} / mo
          </span>
        </div>

        <div className="prod-saving-stepper-row">
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => handleStep(-1000)}
            disabled={goal.monthlySaving <= 0}
            style={{ padding: '3px 8px', fontSize: '0.75rem' }}
          >
            -₹1k
          </button>
          <input
            type="range"
            min="0"
            max={Math.max(50000, goal.price)}
            step="500"
            value={goal.monthlySaving || 0}
            onChange={handleSliderChange}
            className="prod-range-slider"
          />
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => handleStep(1000)}
            style={{ padding: '3px 8px', fontSize: '0.75rem' }}
          >
            +₹1k
          </button>
        </div>

        {/* Zero saving warning condition */}
        {tl.isZeroSaving && (
          <div className="notice notice-rose" style={{ marginTop: '4px', padding: '8px 12px' }}>
            <AlertTriangle size={13} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ flex: 1, fontSize: '0.78rem' }}>
              Monthly saving is <strong>₹0</strong> — this goal will never be achieved.
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => handleStep(5000)}
              style={{ fontSize: '0.72rem', padding: '2px 8px' }}
            >
              Set ₹5,000
            </button>
          </div>
        )}
      </div>

      {/* ── 4-KPI TELEMETRY GRID ─────────────────────────────── */}
      <div className="prod-kpi-grid">
        <div className="prod-kpi-item">
          <span className="prod-kpi-label">Remaining Gap</span>
          <span className="prod-kpi-val">
            {formatCurrency(remaining, currency)}
          </span>
        </div>

        <div className="prod-kpi-item">
          <span className="prod-kpi-label">Estimated Date</span>
          <span className={`prod-kpi-val ${tl.isZeroSaving ? 'rose' : 'highlight'}`}>
            {tl.isZeroSaving ? 'Never (₹0/mo)' : targetDate?.fullString}
          </span>
          {!tl.isZeroSaving && targetDate && (
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              in {Math.ceil(tl.months)} months
            </span>
          )}
        </div>

        <div className="prod-kpi-item">
          <span className="prod-kpi-label">6% Compound Growth</span>
          <span className="prod-kpi-val emerald">
            {tl.interestEarned > 0 ? `+${formatCurrency(tl.interestEarned, currency)}` : '—'}
          </span>
          {tl.interestEarned > 0 && (
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              annual compound
            </span>
          )}
        </div>

        <div className="prod-kpi-item">
          <span className="prod-kpi-label">Target Urgency</span>
          <span className="prod-kpi-val" style={{ textTransform: 'capitalize' }}>
            {goal.urgency || 'Medium'}
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            {'⭐'.repeat(goal.importance || 3)}
          </span>
        </div>
      </div>

      {/* ── OPTIONAL MONTHLY SCHEDULE DISCLOSURE ───────────────── */}
      {tl.monthlySchedule && tl.monthlySchedule.length > 1 && !tl.isZeroSaving && (
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setShowSchedule(p => !p)}
            style={{ width: '100%', justifyContent: 'space-between', fontSize: '0.75rem', padding: '4px 6px' }}
          >
            <span>{showSchedule ? 'Hide' : 'View'} Monthly Growth Schedule</span>
            {showSchedule ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>

          {showSchedule && (
            <div style={{ marginTop: '10px', maxHeight: '180px', overflowY: 'auto' }}>
              <table style={{ width: '100%', fontSize: '0.75rem', borderCollapse: 'collapse', fontFamily: 'var(--mono)' }}>
                <thead>
                  <tr style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left' }}>
                    <th style={{ padding: '4px 8px' }}>Mo</th>
                    <th style={{ padding: '4px 8px' }}>Date</th>
                    <th style={{ padding: '4px 8px' }}>Deposited</th>
                    <th style={{ padding: '4px 8px' }}>+6% Interest</th>
                    <th style={{ padding: '4px 8px', textAlign: 'right' }}>Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {tl.monthlySchedule.slice(0, 12).map((item, idx) => {
                    const stepDate = getTargetDate(item.month);
                    return (
                      <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                        <td style={{ padding: '4px 8px', color: 'var(--text-muted)' }}>m+{item.month}</td>
                        <td style={{ padding: '4px 8px', color: 'var(--text-secondary)' }}>{stepDate.monthName.slice(0,3)} '{String(stepDate.year).slice(-2)}</td>
                        <td style={{ padding: '4px 8px' }}>{formatCurrency(item.deposited, currency)}</td>
                        <td style={{ padding: '4px 8px', color: '#34d399' }}>+{formatCurrency(item.interest, currency)}</td>
                        <td style={{ padding: '4px 8px', textAlign: 'right', fontWeight: 600 }}>{formatCurrency(item.balance, currency)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {tl.monthlySchedule.length > 12 && (
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '6px' }}>
                  Showing first 12 of {tl.monthlySchedule.length} months until completion
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
