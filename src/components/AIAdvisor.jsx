import React, { useState } from 'react';
import { Bot, Sparkles, ArrowRight, Check, HelpCircle, MessageSquare, Zap, Lightbulb } from 'lucide-react';
import { calculateGoalTimeline, formatCurrency } from '../utils/finance';

export default function AIAdvisor({ goals, onUpdateGoal, useInterest, currency }) {
  const [selectedGoalId, setSelectedGoalId] = useState(goals[0] ? goals[0].id : null);
  const [activeQuestion, setActiveQuestion] = useState(null);

  const goal = goals.find(g => g.id === selectedGoalId) || goals[0];

  if (!goal) {
    return (
      <div className="glass-panel" style={{ padding: '32px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>No goals available. Add a goal to speak with your AI Financial Coach!</p>
      </div>
    );
  }

  const timeline = calculateGoalTimeline(goal.price, goal.saved, goal.monthlySaving, useInterest);

  // Computations for actionable recommendations
  const remaining = Math.max(0, goal.price - goal.saved);
  const targetMonthsFaster = Math.max(1, timeline.months - 3);

  // Option A: Increase saving
  const neededMonthlyForFaster = Math.round((remaining / targetMonthsFaster) / 500) * 500;
  const monthlyIncrement = Math.max(500, neededMonthlyForFaster - goal.monthlySaving);

  // Option B: Lump sum required to hit in 4 months
  const lumpSumNeeded = Math.max(0, remaining - (goal.monthlySaving * 4));

  // Option C: Refurbished / 15% discount price
  const discountedPrice = Math.round(goal.price * 0.85);
  const discountedTimeline = calculateGoalTimeline(discountedPrice, goal.saved, goal.monthlySaving, useInterest);

  const handleApplyOptionA = () => {
    onUpdateGoal(goal.id, {
      ...goal,
      monthlySaving: goal.monthlySaving + monthlyIncrement
    });
    alert(`Applied Option A: Monthly saving for ${goal.title} increased by +${formatCurrency(monthlyIncrement, currency)}!`);
  };

  const handleApplyOptionC = () => {
    onUpdateGoal(goal.id, {
      ...goal,
      price: discountedPrice
    });
    alert(`Applied Option C: Target price for ${goal.title} updated to discounted price of ${formatCurrency(discountedPrice, currency)}!`);
  };

  return (
    <div className="glass-panel animate-slide-down" style={{ padding: '28px', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#fff', padding: '10px', borderRadius: '14px', boxShadow: '0 4px 18px rgba(99, 102, 241, 0.3)' }}>
            <Bot size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>AI Financial Coach</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem' }}>
              Interactive scenario engine with algorithmic advice and 1-click strategic optimizations
            </p>
          </div>
        </div>

        {/* Goal Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Coach for Goal:</label>
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

      {/* AI Diagnostic Speech Bubble */}
      <div style={{
        background: 'rgba(99, 102, 241, 0.08)',
        border: '1px solid rgba(99, 102, 241, 0.25)',
        borderRadius: 'var(--radius-md)',
        padding: '20px 22px',
        marginBottom: '26px',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <Sparkles size={18} color="#818cf8" />
          <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#e0e7ff' }}>
            Diagnostic Assessment for {goal.title}
          </h4>
        </div>

        <p style={{ fontSize: '0.92rem', color: '#c7d2fe', lineHeight: 1.6 }}>
          You currently have <strong>{formatCurrency(goal.saved, currency)}</strong> saved toward the <strong>{formatCurrency(goal.price, currency)}</strong> target. 
          {timeline.isZeroSaving ? (
            <span> Because your monthly saving is <strong>₹0</strong>, you will not reach this target without allocating monthly contributions or depositing a lump sum.</span>
          ) : (
            <span> At your current rate of <strong>{formatCurrency(goal.monthlySaving, currency)}/month</strong>, you will reach this goal in <strong>{timeline.months} months ({timeline.targetDate.fullString})</strong>.</span>
          )}
        </p>

        {!timeline.isZeroSaving && (
          <div style={{ marginTop: '12px', fontSize: '0.86rem', color: '#a5b4fc', fontWeight: 600 }}>
            Here are three actionable strategies to optimize your plan:
          </div>
        )}
      </div>

      {/* 3 Strategic Option Cards */}
      {!timeline.isZeroSaving && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px', marginBottom: '28px' }}>
          {/* Option A: Increase Monthly Saving */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className="badge badge-indigo">STRATEGY A</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Saving Acceleration</span>
              </div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}>
                Increase Monthly by +{formatCurrency(monthlyIncrement, currency)}
              </h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
                Save <strong>{formatCurrency(goal.monthlySaving + monthlyIncrement, currency)}/mo</strong> instead of {formatCurrency(goal.monthlySaving, currency)}/mo. You'll afford your {goal.title} in just <strong>{targetMonthsFaster} months</strong>!
              </p>
            </div>

            <button onClick={handleApplyOptionA} className="btn btn-primary btn-sm" style={{ width: '100%' }}>
              <Zap size={14} />
              <span>Apply Strategy A</span>
            </button>
          </div>

          {/* Option B: One-time Lump Sum */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className="badge badge-amber">STRATEGY B</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Windfall Deposit</span>
              </div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}>
                Deposit +{formatCurrency(lumpSumNeeded, currency)} Lump Sum
              </h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
                Keep your {formatCurrency(goal.monthlySaving, currency)}/mo contribution unchanged, but inject a bonus from tax refunds or seasonal incentives to reach your goal in just 4 months.
              </p>
            </div>

            <button 
              onClick={() => alert(`Tip: Go to "What-If Simulator" to test injecting +${formatCurrency(lumpSumNeeded, currency)} bonus!`)}
              className="btn btn-secondary btn-sm" 
              style={{ width: '100%' }}
            >
              <Lightbulb size={14} />
              <span>Explore in Simulator</span>
            </button>
          </div>

          {/* Option C: Smart Discount / Refurbished */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className="badge badge-emerald">STRATEGY C</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Price Optimization</span>
              </div>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}>
                Target Price: {formatCurrency(discountedPrice, currency)} (-15%)
              </h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '16px' }}>
                Look for festive sales, certified refurbished models, or previous-gen versions. Cuts timeline down to <strong>{discountedTimeline.months} months</strong> with no extra monthly spending!
              </p>
            </div>

            <button onClick={handleApplyOptionC} className="btn btn-emerald btn-sm" style={{ width: '100%' }}>
              <Check size={14} />
              <span>Apply 15% Sale Price</span>
            </button>
          </div>
        </div>
      )}

      {/* Quick Prompt Inquiries */}
      <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <MessageSquare size={16} color="#818cf8" />
        Popular AI Inquiries
      </h3>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button 
          onClick={() => alert(`AI Analysis: If you earn 6% compound interest across your goals, you will accumulate approximately +₹${Math.round(goals.reduce((s, g) => s + (g.price * 0.05), 0))} in passive gains, shaving 1 to 3 months off your overall journey!`)}
          className="btn btn-secondary btn-sm"
        >
          💡 How much total interest will I earn in 2 years?
        </button>
        <button 
          onClick={() => alert(`AI Analysis: The Snowball method (buying ${goals[0]?.title} first) builds high psychological momentum because you score a win within months!`)}
          className="btn btn-secondary btn-sm"
        >
          🧠 Why should I buy {goals[0]?.title} before the other goals?
        </button>
        <button 
          onClick={() => alert(`AI Analysis: If you temporarily pause saving for 1 month, your timeline simply extends by 1 calendar month. No penalty or loss of principal occurs.`)}
          className="btn btn-secondary btn-sm"
        >
          🏖️ What happens if I take a vacation and skip 1 month?
        </button>
      </div>
    </div>
  );
}
