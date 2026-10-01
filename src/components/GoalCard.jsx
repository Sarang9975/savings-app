import React, { useState } from 'react';
import { 
  Calendar, Clock, TrendingUp, AlertTriangle, AlertCircle, 
  CheckCircle2, ArrowUp, ArrowDown, Edit3, Trash2, Sliders, 
  Sparkles, PartyPopper, Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { calculateGoalTimeline, formatCurrency, getAccelerationScenarios } from '../utils/finance';

export default function GoalCard({
  goal,
  rank,
  totalGoals,
  useInterest,
  currency,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
  onSimulate
}) {
  const [showDetails, setShowDetails] = useState(false);

  // Core calculations
  const timeline = calculateGoalTimeline(goal.price, goal.saved, goal.monthlySaving, useInterest);
  const acceleration = getAccelerationScenarios(goal, useInterest);

  // Trigger celebratory confetti
  const handleCelebrate = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const isCompleted = timeline.progressPct >= 100 || timeline.isAchieved;

  return (
    <div 
      className="glass-panel" 
      style={{ 
        padding: '24px', 
        position: 'relative', 
        overflow: 'hidden',
        border: isCompleted ? '1.5px solid #10b981' : timeline.isZeroSaving ? '1.5px solid rgba(244, 63, 94, 0.4)' : '1px solid var(--border-subtle)'
      }}
    >
      {/* Top Header: Rank, Icon, Title, Actions */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '14px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Rank Badge */}
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '10px',
            background: rank === 1 ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'rgba(255, 255, 255, 0.07)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '0.88rem',
            boxShadow: rank === 1 ? '0 4px 12px rgba(245, 158, 11, 0.35)' : 'none'
          }}>
            #{rank}
          </div>

          {/* Goal Icon & Title */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.4rem' }}>{goal.icon || '🎯'}</span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{goal.title}</h3>
              {isCompleted && (
                <span className="badge badge-emerald" style={{ fontSize: '0.68rem' }}>
                  <Award size={12} /> Achieved!
                </span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '3px' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'capitalize' }}>
                Category: {goal.category || 'General'}
              </span>
              <span style={{ color: 'var(--border-subtle)' }}>•</span>
              <span style={{ fontSize: '0.78rem', color: goal.urgency === 'high' ? '#f43f5e' : goal.urgency === 'medium' ? '#fbbf24' : '#34d399', fontWeight: 600 }}>
                {goal.urgency ? `${goal.urgency.toUpperCase()} Urgency` : 'Standard'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons: Shift Rank, Simulate, Edit, Delete */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button
            onClick={() => onMoveUp(goal.id)}
            disabled={rank === 1}
            className="btn btn-secondary btn-icon btn-sm"
            title="Move Up in Priority Rank"
            style={{ opacity: rank === 1 ? 0.3 : 1 }}
          >
            <ArrowUp size={14} />
          </button>
          <button
            onClick={() => onMoveDown(goal.id)}
            disabled={rank === totalGoals}
            className="btn btn-secondary btn-icon btn-sm"
            title="Move Down in Priority Rank"
            style={{ opacity: rank === totalGoals ? 0.3 : 1 }}
          >
            <ArrowDown size={14} />
          </button>
          <button
            onClick={() => onSimulate(goal)}
            className="btn btn-secondary btn-icon btn-sm"
            title="Open in What-If Simulator"
          >
            <Sliders size={14} color="#818cf8" />
          </button>
          <button
            onClick={() => onEdit(goal)}
            className="btn btn-secondary btn-icon btn-sm"
            title="Edit Goal"
          >
            <Edit3 size={14} />
          </button>
          <button
            onClick={() => onDelete(goal.id)}
            className="btn btn-danger btn-icon btn-sm"
            title="Delete Goal"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Target & Financial Highlights Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
        background: 'rgba(0, 0, 0, 0.25)',
        padding: '14px 16px',
        borderRadius: 'var(--radius-md)',
        marginBottom: '16px'
      }}>
        <div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Target Price</span>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
            {formatCurrency(goal.price, currency)}
          </div>
        </div>

        <div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Already Saved</span>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#10b981', marginTop: '2px' }}>
            {formatCurrency(goal.saved, currency)}
          </div>
        </div>

        <div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Monthly Saving</span>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: goal.monthlySaving === 0 ? '#f43f5e' : '#6366f1', marginTop: '2px' }}>
            {formatCurrency(goal.monthlySaving, currency)}/mo
          </div>
        </div>
      </div>

      {/* Primary Result Banner: Months & Target Month/Year */}
      <div style={{
        background: timeline.isZeroSaving 
          ? 'linear-gradient(135deg, rgba(244, 63, 94, 0.15) 0%, rgba(244, 63, 94, 0.05) 100%)' 
          : isCompleted 
            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.08) 100%)' 
            : 'linear-gradient(135deg, rgba(99, 102, 241, 0.16) 0%, rgba(6, 182, 212, 0.1) 100%)',
        border: `1px solid ${timeline.isZeroSaving ? 'rgba(244, 63, 94, 0.35)' : isCompleted ? 'rgba(16, 185, 129, 0.4)' : 'rgba(99, 102, 241, 0.3)'}`,
        borderRadius: 'var(--radius-md)',
        padding: '16px 20px',
        marginBottom: '16px'
      }}>
        {timeline.isZeroSaving ? (
          /* Zero Monthly Saving Requirement Handling */
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <AlertCircle size={24} color="#f43f5e" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: 800, color: '#fb7185', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                ⚠️ Zero Monthly Saving Detected!
              </div>
              <p style={{ fontSize: '0.84rem', color: '#fecdd3', marginTop: '4px', lineHeight: 1.45 }}>
                You have currently set monthly saving to <strong>₹0</strong>. At this rate, your goal will take an <strong>infinite amount of time</strong> to achieve! Set a monthly saving or add a lump sum to generate your purchase roadmap.
              </p>
            </div>
          </div>
        ) : isCompleted ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <PartyPopper size={24} color="#34d399" />
              <div>
                <div style={{ fontWeight: 800, color: '#34d399', fontSize: '1.05rem' }}>
                  🎉 Goal Achieved! Ready to Buy Right Now!
                </div>
                <p style={{ fontSize: '0.82rem', color: '#a7f3d0' }}>
                  You have accumulated {formatCurrency(goal.saved, currency)} of your {formatCurrency(goal.price, currency)} target.
                </p>
              </div>
            </div>
            <button onClick={handleCelebrate} className="btn btn-emerald btn-sm">
              Celebrate! 🎊
            </button>
          </div>
        ) : (
          /* Normal Timeline ETA Display */
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Purchase Horizon & Arrival Date
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginTop: '2px', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span>{timeline.months} Months</span>
                <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#38bdf8' }}>
                  — {timeline.targetDate.fullString}
                </span>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span className={`badge ${timeline.riskLevel === 'on_track' ? 'badge-emerald' : timeline.riskLevel === 'at_risk' ? 'badge-amber' : 'badge-rose'}`}>
                {timeline.riskLevel.toUpperCase().replace('_', ' ')}
              </span>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Remaining: {formatCurrency(Math.max(0, goal.price - goal.saved), currency)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar with Milestone Pins */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
          <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Savings Progress</span>
          <span style={{ fontWeight: 800, color: isCompleted ? '#34d399' : '#818cf8' }}>
            {timeline.progressPct}%
          </span>
        </div>

        <div className="progress-track">
          <div 
            className="progress-fill" 
            style={{ width: `${timeline.progressPct}%` }}
          />
          {/* Milestone Checkpoints: 25%, 50%, 75% */}
          <div 
            className={`milestone-pin ${timeline.progressPct >= 25 ? 'reached' : ''}`} 
            style={{ left: '25%' }} 
            title="Quarter Way (25%)"
          />
          <div 
            className={`milestone-pin ${timeline.progressPct >= 50 ? 'reached' : ''}`} 
            style={{ left: '50%' }} 
            title="Halfway Mark (50%)"
          />
          <div 
            className={`milestone-pin ${timeline.progressPct >= 75 ? 'reached' : ''}`} 
            style={{ left: '75%' }} 
            title="Almost There (75%)"
          />
        </div>

        {/* Milestone Labels */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '4px' }}>
          <span>🏁 Start</span>
          <span>🔥 25%</span>
          <span>🚀 50%</span>
          <span>💎 75%</span>
          <span>🎉 Target</span>
        </div>
      </div>

      {/* 6% Yearly Interest Benefit Callout */}
      {!timeline.isZeroSaving && !isCompleted && (
        <div style={{
          background: useInterest ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.02)',
          border: `1px dashed ${useInterest ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.08)'}`,
          borderRadius: 'var(--radius-sm)',
          padding: '10px 14px',
          marginBottom: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.82rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={15} color={useInterest ? '#34d399' : '#94a3b8'} />
            <span style={{ color: useInterest ? '#d1fae5' : 'var(--text-muted)' }}>
              {useInterest 
                ? `6% Annual Interest Earned: +${formatCurrency(timeline.interestEarned, currency)} free money!` 
                : '6% Interest is OFF. Turn ON in header to accelerate your timeline.'}
            </span>
          </div>

          {useInterest && timeline.monthsSavedWithInterest > 0 && (
            <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>
              Saves {timeline.monthsSavedWithInterest} mo!
            </span>
          )}
        </div>
      )}

      {/* Micro-Acceleration Actionable Tip */}
      {acceleration && !isCompleted && (
        <div style={{
          background: 'rgba(99, 102, 241, 0.06)',
          border: '1px solid rgba(99, 102, 241, 0.15)',
          borderRadius: 'var(--radius-sm)',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.8rem',
          color: '#c7d2fe'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} color="#818cf8" />
            <span>
              Save <strong>+{formatCurrency(acceleration.boost20.diff, currency)}/mo</strong> → Buy <strong>{acceleration.boost20.monthsGained} months earlier ({acceleration.boost20.targetDate.fullString})</strong>
            </span>
          </div>

          <button
            onClick={() => onSimulate(goal)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#818cf8',
              fontWeight: 700,
              fontSize: '0.78rem',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Simulate
          </button>
        </div>
      )}
    </div>
  );
}
