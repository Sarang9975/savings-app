import React, { useState, useRef } from 'react';
import { Brain, Sparkles, Zap, AlertCircle, CheckCircle2, Wand2, Loader2, ChevronRight } from 'lucide-react';
import { classifyGoal, setProgressCallback, isPipelineReady } from '../utils/mlEngine';
import { formatCurrency } from '../utils/finance';

export default function SmartGoalInput({ onGoalExtracted, currency = 'INR' }) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadStatus, setLoadStatus] = useState('');
  const [modelLoaded, setModelLoaded] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const examples = [
    "I need a new laptop for my remote dev job, quite urgent",
    "Want to buy a Royal Enfield bike, not in a rush",
    "Planning a trip to Goa with friends next summer",
    "Need iPhone for work — my old one broke last week",
    "A DJI drone for content creation — would be cool to have"
  ];

  const handleClassify = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    setError(null);
    setResult(null);

    setProgressCallback((pct, status) => {
      setLoadProgress(pct);
      setLoadStatus(status);
      if (pct === 100) {
        setModelLoaded(true);
      }
    });

    try {
      const extracted = await classifyGoal(input.trim());
      setResult(extracted);
      setModelLoaded(true);
    } catch (err) {
      console.error('ML classification failed:', err);
      setError('Model failed to load. Check internet connection for first-time model download (~35MB).');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (!result) return;
    onGoalExtracted({
      title: input.trim(),
      icon: result.icon,
      category: result.category,
      urgency: result.urgency,
      importance: result.importance,
      price: result.priceDefault,
      saved: 0,
      monthlySaving: 5000
    });
    setResult(null);
    setInput('');
  };

  return (
    <div style={{
      background: 'rgba(10, 14, 25, 0.8)',
      border: '1.5px solid rgba(99, 102, 241, 0.4)',
      borderRadius: 'var(--radius-lg)',
      padding: '22px 24px',
      marginBottom: '24px'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #6366f1, #a855f7)',
          borderRadius: '10px',
          padding: '8px',
          color: '#fff'
        }}>
          <Brain size={20} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Smart Goal Parser</h3>
            <span className="badge badge-indigo" style={{ fontSize: '0.65rem' }}>
              <Sparkles size={11} /> Powered by DistilBERT NLI (In-Browser)
            </span>
            {modelLoaded && (
              <span className="badge badge-emerald" style={{ fontSize: '0.62rem' }}>
                ✓ MODEL LOADED
              </span>
            )}
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '1px' }}>
            Type any purchase goal in plain English → AI auto-fills category, urgency, importance & price range
          </p>
        </div>
      </div>

      {/* Input Area */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
        <input
          type="text"
          className="form-input"
          placeholder="e.g. 'I need a laptop for my freelance dev work — pretty urgent'"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleClassify()}
          style={{ flex: 1 }}
        />
        <button
          onClick={handleClassify}
          disabled={isLoading || !input.trim()}
          className="btn btn-primary"
          style={{ minWidth: '130px', fontWeight: 700, opacity: (!input.trim()) ? 0.5 : 1 }}
        >
          {isLoading
            ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /><span>Classifying...</span></>
            : <><Wand2 size={15} /><span>Parse with AI</span></>
          }
        </button>
      </div>

      {/* Quick Example Pills */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
        <span style={{ fontSize: '0.73rem', color: 'var(--text-dim)', alignSelf: 'center' }}>Try:</span>
        {examples.map((ex, i) => (
          <button
            key={i}
            onClick={() => setInput(ex)}
            style={{
              background: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              borderRadius: '99px',
              padding: '3px 10px',
              fontSize: '0.72rem',
              color: '#c7d2fe',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {ex.split(' ').slice(0, 5).join(' ')}…
          </button>
        ))}
      </div>

      {/* Model Download Progress Bar */}
      {isLoading && loadProgress > 0 && loadProgress < 100 && (
        <div style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '5px' }}>
            <span style={{ color: 'var(--text-muted)' }}>{loadStatus}</span>
            <span style={{ color: '#818cf8', fontWeight: 700 }}>{loadProgress}%</span>
          </div>
          <div style={{ height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '99px', overflow: 'hidden' }}>
            <div style={{
              width: `${loadProgress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #6366f1, #a855f7)',
              borderRadius: '99px',
              transition: 'width 0.3s ease'
            }} />
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px' }}>
            One-time download. Model is cached in browser — subsequent runs are instant.
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{
          background: 'rgba(244, 63, 94, 0.1)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '10px 14px',
          fontSize: '0.82rem',
          color: '#fb7185',
          display: 'flex',
          gap: '8px',
          alignItems: 'center'
        }}>
          <AlertCircle size={15} style={{ flexShrink: 0 }} />
          {error}
        </div>
      )}

      {/* Classification Result */}
      {result && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.16) 0%, rgba(168, 85, 247, 0.1) 100%)',
          border: '1.5px solid rgba(99, 102, 241, 0.5)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 18px',
          animation: 'slideDown 0.25s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} color="#10b981" />
              <strong style={{ color: '#e0e7ff', fontSize: '0.92rem' }}>
                AI Classification Complete ({result.confidence}% confidence)
              </strong>
            </div>
            <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>
              nli-deberta-v3-xsmall
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '10px',
            marginBottom: '14px'
          }}>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '2px' }}>Category</div>
              <div style={{ fontWeight: 800, fontSize: '1rem' }}>{result.icon} {result.category}</div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '2px' }}>Urgency</div>
              <div style={{
                fontWeight: 800,
                fontSize: '1rem',
                color: result.urgency === 'high' ? '#f43f5e' : result.urgency === 'medium' ? '#f59e0b' : '#34d399',
                textTransform: 'capitalize'
              }}>
                {result.urgency === 'high' ? '🔴' : result.urgency === 'medium' ? '🟡' : '🟢'} {result.urgency}
              </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '2px' }}>Importance</div>
              <div style={{ fontWeight: 800, fontSize: '1rem' }}>
                {'⭐'.repeat(result.importance)} ({result.importance}/5)
              </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '2px' }}>Suggested Price</div>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#38bdf8' }}>
                {formatCurrency(result.priceDefault, currency)}
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>{result.priceRange}</div>
            </div>
          </div>

          <button
            onClick={handleApply}
            className="btn btn-primary"
            style={{ width: '100%', fontWeight: 700 }}
          >
            <ChevronRight size={16} />
            Apply AI-Parsed Values → Open Goal Form
          </button>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
