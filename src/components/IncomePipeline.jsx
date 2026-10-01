import React, { useState } from 'react';
import { Briefcase, Plus, CheckCircle2, AlertCircle, Sparkles, TrendingUp, Trash2, Edit3, ShieldAlert } from 'lucide-react';
import { formatCurrency, calculatePipelineMetrics } from '../utils/finance';

export default function IncomePipeline({ incomeStreams, onUpdateStreams, currency }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState(25000);
  const [newType, setNewType] = useState('freelance'); // 'recurring' | 'freelance' | 'opportunity'
  const [newProb, setNewProb] = useState(70);

  const metrics = calculatePipelineMetrics(incomeStreams);

  const handleToggleStream = (id) => {
    onUpdateStreams(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  const handleProbabilityChange = (id, newProb) => {
    onUpdateStreams(prev => prev.map(s => s.id === id ? { ...s, probability: Number(newProb) } : s));
  };

  const handleDeleteStream = (id) => {
    onUpdateStreams(prev => prev.filter(s => s.id !== id));
  };

  const handleAddStream = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newStream = {
      id: `stream-${Date.now()}`,
      title: newTitle.trim(),
      amount: Number(newAmount) || 0,
      type: newType,
      probability: Number(newProb) || 50,
      active: true,
      targetMonthOffset: newType === 'recurring' ? 1 : 2
    };

    onUpdateStreams(prev => [...prev, newStream]);
    setNewTitle('');
    setNewAmount(25000);
    setIsAdding(false);
  };

  return (
    <div className="glass-panel animate-slide-down" style={{ padding: '28px', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', padding: '10px', borderRadius: '14px' }}>
            <Briefcase size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Variable Income & Deals Pipeline</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem' }}>
              Model irregular gigs, client proposals & prize opportunities with probability weighting
            </p>
          </div>
        </div>

        <button 
          onClick={() => setIsAdding(!isAdding)} 
          className="btn btn-primary btn-sm"
          style={{ fontWeight: 700 }}
        >
          <Plus size={15} />
          <span>{isAdding ? 'Cancel' : 'Add Income Stream'}</span>
        </button>
      </div>

      {/* Pipeline Summary Strip: Potential vs Risk-Adjusted */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '26px'
      }}>
        <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Total Potential Pipeline
          </span>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
            {formatCurrency(metrics.grossPotential, currency)}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>If 100% of all deals close</span>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.16) 0%, rgba(6, 182, 212, 0.08) 100%)',
          padding: '16px',
          borderRadius: 'var(--radius-md)',
          border: '1.5px solid #10b981'
        }}>
          <span style={{ fontSize: '0.75rem', color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>
            Risk-Adjusted Expected Income
          </span>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399', marginTop: '2px' }}>
            {formatCurrency(metrics.riskAdjustedExpected, currency)}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#6ee7b7' }}>Realization Rate: {metrics.realizationRate}% of gross</span>
        </div>

        <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Confirmed / High Certainty
          </span>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38bdf8', marginTop: '2px' }}>
            {formatCurrency(metrics.confirmedAmount, currency)}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>≥90% closed (Retainers / Salary)</span>
        </div>
      </div>

      {/* Add New Stream Inline Form */}
      {isAdding && (
        <form onSubmit={handleAddStream} style={{
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '20px',
          marginBottom: '24px'
        }}>
          <h4 style={{ fontSize: '0.98rem', fontWeight: 700, marginBottom: '14px', color: '#818cf8' }}>
            New Income Stream or Deal
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '14px' }}>
            <div>
              <label className="form-label">Deal / Project Title</label>
              <input 
                type="text" 
                placeholder="e.g. Website Redesign Client" 
                className="form-input" 
                value={newTitle} 
                onChange={e => setNewTitle(e.target.value)} 
                required 
              />
            </div>

            <div>
              <label className="form-label">Potential Amount (₹)</label>
              <input 
                type="number" 
                className="form-input" 
                value={newAmount} 
                onChange={e => setNewAmount(Number(e.target.value))} 
                step="1000" 
                min="500" 
                required 
              />
            </div>

            <div>
              <label className="form-label">Classification Type</label>
              <select className="form-select" value={newType} onChange={e => setNewType(e.target.value)}>
                <option value="recurring">Recurring (Salary/Retainer)</option>
                <option value="freelance">Freelance Gig (Medium certainty)</option>
                <option value="opportunity">Opportunity (Hackathon/Prize/Bonus)</option>
              </select>
            </div>

            <div>
              <label className="form-label">Closing Probability ({newProb}%)</label>
              <input 
                type="range" 
                min="5" 
                max="100" 
                step="5" 
                value={newProb} 
                onChange={e => setNewProb(Number(e.target.value))} 
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" onClick={() => setIsAdding(false)} className="btn btn-secondary btn-sm">Cancel</button>
            <button type="submit" className="btn btn-primary btn-sm">Add to Pipeline</button>
          </div>
        </form>
      )}

      {/* Stream Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {incomeStreams.map(stream => {
          const expectedValue = Math.round((stream.amount * stream.probability) / 100);
          const isHighCertainty = stream.probability >= 85;
          const isMediumCertainty = stream.probability >= 50 && stream.probability < 85;

          return (
            <div 
              key={stream.id}
              style={{
                background: stream.active ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.01)',
                opacity: stream.active ? 1 : 0.45,
                border: stream.active ? '1px solid var(--border-subtle)' : '1px dashed rgba(255, 255, 255, 0.06)',
                borderRadius: 'var(--radius-md)',
                padding: '16px 20px',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                {/* Left: Checkbox, Title & Type */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <input
                    type="checkbox"
                    checked={stream.active}
                    onChange={() => handleToggleStream(stream.id)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#10b981' }}
                    title="Toggle active status"
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{stream.title}</h4>
                      <span className={`badge ${stream.type === 'recurring' ? 'badge-indigo' : stream.type === 'freelance' ? 'badge-cyan' : 'badge-amber'}`} style={{ fontSize: '0.65rem' }}>
                        {stream.type.toUpperCase()}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                      Gross Value: <strong style={{ color: '#fff' }}>{formatCurrency(stream.amount, currency)}</strong>
                    </div>
                  </div>
                </div>

                {/* Center: Probability Slider & Expected Contribution */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ minWidth: '160px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Confidence</span>
                      <strong style={{ color: isHighCertainty ? '#34d399' : isMediumCertainty ? '#38bdf8' : '#fbbf24' }}>
                        {stream.probability}%
                      </strong>
                    </div>
                    <input 
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={stream.probability}
                      onChange={(e) => handleProbabilityChange(stream.id, e.target.value)}
                      disabled={!stream.active}
                    />
                  </div>

                  <div style={{ textAlign: 'right', minWidth: '120px' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Expected Yield</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: isHighCertainty ? '#34d399' : '#38bdf8' }}>
                      {formatCurrency(expectedValue, currency)}
                    </div>
                  </div>

                  {/* Delete Button */}
                  <button 
                    onClick={() => handleDeleteStream(stream.id)} 
                    className="btn btn-ghost btn-icon btn-sm"
                    title="Delete stream"
                  >
                    <Trash2 size={15} color="#f43f5e" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Differentiator Callout Box */}
      <div style={{
        marginTop: '20px',
        padding: '14px 18px',
        background: 'rgba(99, 102, 241, 0.08)',
        border: '1px solid rgba(99, 102, 241, 0.2)',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '0.84rem',
        color: '#c7d2fe'
      }}>
        <Sparkles size={20} color="#818cf8" style={{ flexShrink: 0 }} />
        <div>
          <strong>The Variable Income Insight:</strong> Unlike fixed salary calculators, GoalCast computes <strong>risk-adjusted cashflow</strong>. A ₹50,000 hackathon prize with a 15% probability contributes ₹7,500 in expected value—preventing you from overcommitting or making premature purchases before deals close!
        </div>
      </div>
    </div>
  );
}
