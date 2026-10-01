import React, { useState } from 'react';
import { HeartPulse, Brain, Sparkles, Loader2, Wand2, AlertCircle, TrendingUp } from 'lucide-react';
import { analyzeFinancialPosture, setProgressCallback } from '../utils/mlEngine';

export default function FinancialPostureWidget({ onPostureDetected }) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const prompts = [
    "I'm really excited about my savings momentum right now",
    "I'm worried about my rent and bills next month",
    "Not sure how much I'll earn, my clients are unpredictable",
    "I feel confident — I just landed a great long-term client",
    "I've been struggling to save consistently"
  ];

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    setError(null);
    setResult(null);

    setProgressCallback((pct) => setLoadProgress(pct));

    try {
      const posture = await analyzeFinancialPosture(input.trim());
      setResult(posture);
      if (onPostureDetected) onPostureDetected(posture);
    } catch (err) {
      setError('Analysis failed. Check your internet for initial model download.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      background: 'rgba(10, 14, 25, 0.7)',
      border: '1px solid rgba(168, 85, 247, 0.3)',
      borderRadius: 'var(--radius-lg)',
      padding: '20px 22px',
      marginBottom: '20px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
        <div style={{ background: 'linear-gradient(135deg, #a855f7, #6366f1)', borderRadius: '10px', padding: '8px', color: '#fff' }}>
          <HeartPulse size={20} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Financial Posture Detector</h3>
            <span className="badge badge-indigo" style={{ fontSize: '0.62rem' }}>
              <Brain size={11} /> NLI Zero-Shot
            </span>
          </div>
          <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
            Describe how you feel about your finances → AI personalizes your scenario bias
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
        <input
          type="text"
          className="form-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleAnalyze()}
          placeholder="e.g. 'I'm optimistic — landed two new clients this month'"
          style={{ flex: 1 }}
        />
        <button
          onClick={handleAnalyze}
          disabled={isLoading || !input.trim()}
          className="btn btn-secondary"
          style={{ minWidth: '110px', opacity: !input.trim() ? 0.5 : 1 }}
        >
          {isLoading
            ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
            : <><Wand2 size={14} /><span>Analyze</span></>
          }
        </button>
      </div>

      {/* Example prompts */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
        {prompts.map((p, i) => (
          <button
            key={i}
            onClick={() => setInput(p)}
            style={{
              background: 'rgba(168, 85, 247, 0.08)',
              border: '1px solid rgba(168, 85, 247, 0.2)',
              borderRadius: '99px',
              padding: '3px 9px',
              fontSize: '0.7rem',
              color: '#d8b4fe',
              cursor: 'pointer'
            }}
          >
            {p.slice(0, 32)}…
          </button>
        ))}
      </div>

      {/* Progress */}
      {isLoading && loadProgress > 0 && loadProgress < 100 && (
        <div style={{ marginBottom: '10px' }}>
          <div style={{ height: '4px', background: 'rgba(255,255,255,0.07)', borderRadius: '99px', overflow: 'hidden' }}>
            <div style={{ width: `${loadProgress}%`, height: '100%', background: 'linear-gradient(90deg, #a855f7, #6366f1)', borderRadius: '99px', transition: 'width 0.3s ease' }} />
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ fontSize: '0.8rem', color: '#fb7185', display: 'flex', gap: '6px', alignItems: 'center' }}>
          <AlertCircle size={14} />{error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div style={{
          background: `${result.color}15`,
          border: `1.5px solid ${result.color}60`,
          borderRadius: 'var(--radius-md)',
          padding: '14px 16px',
          animation: 'slideDown 0.2s ease'
        }}>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: result.color, marginBottom: '6px' }}>
            {result.label}
          </div>
          <p style={{ fontSize: '0.82rem', color: '#e2e8f0', lineHeight: 1.5, marginBottom: '8px' }}>
            {result.advice}
          </p>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
            📊 Scenario Bias Applied: {result.riskBias}
          </div>
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
