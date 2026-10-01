import React, { useState } from 'react';
import { Briefcase, Sparkles, Loader2, Wand2, CheckCircle2, AlertCircle, Plus } from 'lucide-react';
import { classifyIncomeStream, setProgressCallback } from '../utils/mlEngine';
import { formatCurrency } from '../utils/finance';

export default function SmartIncomeParser({ onStreamExtracted, currency = 'INR' }) {
  const [input, setInput] = useState('');
  const [amount, setAmount] = useState(25000);
  const [isLoading, setIsLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadStatus, setLoadStatus] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const examples = [
    "I get ₹15k every month from my main client",
    "Might win the national AI hackathon next month",
    "A startup wants me to redesign their website for ₹30k",
    "My company gives bonuses in December usually",
    "Teaching a weekend coding bootcamp, not sure if confirmed"
  ];

  const typeConfig = {
    recurring: { label: 'Recurring Income', color: '#6366f1', bg: 'rgba(99, 102, 241, 0.15)', icon: '🔄' },
    freelance: { label: 'Freelance Project', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.15)', icon: '💼' },
    opportunity: { label: 'Opportunity / Prize', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', icon: '🏆' }
  };

  const handleClassify = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    setError(null);
    setResult(null);

    setProgressCallback((pct, status) => {
      setLoadProgress(pct);
      setLoadStatus(status);
    });

    try {
      const extracted = await classifyIncomeStream(input.trim());
      setResult(extracted);
    } catch (err) {
      setError('Model classification failed. Ensure internet connection for initial model download.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    if (!result) return;
    onStreamExtracted({
      id: `stream-ml-${Date.now()}`,
      title: input.trim(),
      amount,
      type: result.type,
      probability: result.probability,
      active: true,
      targetMonthOffset: result.type === 'recurring' ? 1 : 2
    });
    setResult(null);
    setInput('');
  };

  return (
    <div style={{
      background: 'rgba(10, 14, 25, 0.8)',
      border: '1.5px solid rgba(6, 182, 212, 0.35)',
      borderRadius: 'var(--radius-lg)',
      padding: '22px 24px',
      marginBottom: '20px'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
        <div style={{ background: 'linear-gradient(135deg, #06b6d4, #10b981)', borderRadius: '10px', padding: '8px', color: '#fff' }}>
          <Briefcase size={20} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Smart Income Classifier</h3>
            <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>
              <Sparkles size={11} /> NLI-DeBERTa In-Browser
            </span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '1px' }}>
            Describe any income in plain English → AI auto-assigns type (recurring/freelance/opportunity) and confidence probability
          </p>
        </div>
      </div>

      {/* Input Grid */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
        <input
          type="text"
          className="form-input"
          placeholder="e.g. 'Might win the national hackathon next month'"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleClassify()}
          style={{ flex: '2 1 260px' }}
        />

        <div style={{ flex: '1 1 140px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Amount (₹)</label>
          <input
            type="number"
            className="form-input"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            min="500"
            step="500"
            style={{ padding: '9px 12px' }}
          />
        </div>

        <button
          onClick={handleClassify}
          disabled={isLoading || !input.trim()}
          className="btn btn-primary"
          style={{ alignSelf: 'flex-end', minWidth: '140px', fontWeight: 700, opacity: !input.trim() ? 0.5 : 1 }}
        >
          {isLoading
            ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /><span>Classifying...</span></>
            : <><Wand2 size={14} /><span>Classify Income</span></>
          }
        </button>
      </div>

      {/* Example pills */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
        <span style={{ fontSize: '0.73rem', color: 'var(--text-dim)', alignSelf: 'center' }}>Try:</span>
        {examples.map((ex, i) => (
          <button
            key={i}
            onClick={() => setInput(ex)}
            style={{
              background: 'rgba(6, 182, 212, 0.08)',
              border: '1px solid rgba(6, 182, 212, 0.2)',
              borderRadius: '99px',
              padding: '3px 10px',
              fontSize: '0.72rem',
              color: '#67e8f9',
              cursor: 'pointer'
            }}
          >
            {ex.slice(0, 36)}…
          </button>
        ))}
      </div>

      {/* Progress bar */}
      {isLoading && loadProgress > 0 && loadProgress < 100 && (
        <div style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
            <span style={{ color: 'var(--text-muted)' }}>{loadStatus}</span>
            <span style={{ color: '#22d3ee', fontWeight: 700 }}>{loadProgress}%</span>
          </div>
          <div style={{ height: '5px', background: 'rgba(255,255,255,0.07)', borderRadius: '99px', overflow: 'hidden' }}>
            <div style={{ width: `${loadProgress}%`, height: '100%', background: 'linear-gradient(90deg, #06b6d4, #10b981)', borderRadius: '99px', transition: 'width 0.3s ease' }} />
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', borderRadius: 'var(--radius-md)', padding: '10px 14px', fontSize: '0.82rem', color: '#fb7185', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <AlertCircle size={15} style={{ flexShrink: 0 }} />
          {error}
        </div>
      )}

      {/* Classification Result */}
      {result && (() => {
        const tc = typeConfig[result.type];
        const expectedValue = Math.round((amount * result.probability) / 100);

        return (
          <div style={{
            background: tc.bg,
            border: `1.5px solid ${tc.color}`,
            borderRadius: 'var(--radius-md)',
            padding: '16px 18px',
            animation: 'slideDown 0.25s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={17} color="#10b981" />
                <strong style={{ fontSize: '0.9rem', color: '#fff' }}>
                  {tc.icon} {tc.label} — {result.probability}% Probability
                </strong>
                <span style={{ fontSize: '0.68rem', color: tc.color, background: `${tc.color}20`, border: `1px solid ${tc.color}40`, padding: '2px 8px', borderRadius: '99px' }}>
                  {result.confidence}% model confidence
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.82rem', color: '#d1fae5', marginBottom: '14px', lineHeight: 1.5 }}>
              {result.reasoning}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', marginBottom: '14px' }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Gross Potential</div>
                <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#fff' }}>{formatCurrency(amount, currency)}</div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Risk-Adjusted Yield</div>
                <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#34d399' }}>{formatCurrency(expectedValue, currency)}</div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Income Type</div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: tc.color, textTransform: 'capitalize' }}>
                  {result.type}
                </div>
              </div>
            </div>

            <button onClick={handleAdd} className="btn btn-primary" style={{ width: '100%', fontWeight: 700 }}>
              <Plus size={15} />
              Add to Income Pipeline
            </button>
          </div>
        );
      })()}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
