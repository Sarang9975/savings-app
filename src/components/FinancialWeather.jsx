import React, { useState } from 'react';
import { CloudSun, Sun, CloudRain, CloudLightning, ShieldAlert, Sparkles, TrendingUp, Info } from 'lucide-react';
import { generateCashflowForecast, formatCurrency } from '../utils/finance';

export default function FinancialWeather({ incomeStreams, monthlyExpenses, currency }) {
  const [forecastMonthsCount, setForecastMonthsCount] = useState(6);

  const forecast = generateCashflowForecast(incomeStreams, monthlyExpenses, forecastMonthsCount);

  return (
    <div className="glass-panel animate-slide-down" style={{ padding: '28px', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', padding: '10px', borderRadius: '14px' }}>
            <CloudSun size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Financial Weather Radar</h2>
              <span className="badge badge-amber" style={{ fontSize: '0.68rem' }}>6-MONTH OUTLOOK</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem' }}>
              Multi-month atmospheric cashflow forecast showing income ranges, seasonal dips & surplus volatility
            </p>
          </div>
        </div>

        {/* Forecast Range Selector */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {[6, 9, 12].map(m => (
            <button
              key={m}
              onClick={() => setForecastMonthsCount(m)}
              className={`btn btn-sm ${forecastMonthsCount === m ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '5px 12px', fontSize: '0.78rem' }}
            >
              {m} Months
            </button>
          ))}
        </div>
      </div>

      {/* Weather Cards Horizontal Radar Strip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(180px, 1fr))`,
        gap: '14px',
        marginBottom: '26px'
      }}>
        {forecast.map((step) => {
          const isDeficit = step.expectedSurplus < 0;
          const isSunny = step.weather === 'sunny';
          const isCloudy = step.weather === 'cloudy';

          return (
            <div 
              key={step.monthIndex}
              style={{
                background: isDeficit 
                  ? 'linear-gradient(135deg, rgba(244, 63, 94, 0.16) 0%, rgba(244, 63, 94, 0.05) 100%)' 
                  : isSunny 
                    ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.14) 0%, rgba(6, 182, 212, 0.08) 100%)' 
                    : isCloudy
                      ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(245, 158, 11, 0.04) 100%)'
                      : 'rgba(255, 255, 255, 0.02)',
                border: `1px solid ${isDeficit ? '#f43f5e' : isSunny ? '#10b981' : isCloudy ? '#f59e0b' : 'var(--border-subtle)'}`,
                borderRadius: 'var(--radius-md)',
                padding: '18px 16px',
                position: 'relative'
              }}
            >
              {/* Month & Weather Icon */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#ffffff' }}>
                  {step.shortLabel}
                </span>
                <span style={{ fontSize: '1.6rem' }} title={step.weatherCondition}>
                  {step.weatherEmoji}
                </span>
              </div>

              {/* Weather Status Tag */}
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: isDeficit ? '#fb7185' : isSunny ? '#34d399' : '#fbbf24', marginBottom: '12px' }}>
                {step.weatherCondition}
              </div>

              {/* Net Surplus Box */}
              <div style={{ background: 'rgba(0, 0, 0, 0.35)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Net Surplus</span>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: isDeficit ? '#f43f5e' : '#ffffff' }}>
                  {isDeficit ? '-' : '+'}{formatCurrency(Math.abs(step.expectedSurplus), currency)}
                </div>
              </div>

              {/* Income Range: Conservative to Optimistic */}
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Conservative:</span>
                  <span style={{ color: 'var(--text-muted)' }}>{formatCurrency(step.conservativeIncome, currency)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Expected:</span>
                  <strong style={{ color: '#fff' }}>{formatCurrency(step.expectedIncome, currency)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Optimistic:</span>
                  <span style={{ color: '#34d399' }}>{formatCurrency(step.optimisticIncome, currency)}</span>
                </div>
              </div>

              {/* Forecast Confidence Decay */}
              <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem' }}>
                <span style={{ color: 'var(--text-dim)' }}>Confidence</span>
                <span style={{ color: step.confidence > 75 ? '#34d399' : '#fbbf24', fontWeight: 700 }}>
                  {step.confidence}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Weather Legend & Interpretation */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.25)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        fontSize: '0.82rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>☀️</span>
            <span style={{ color: '#34d399', fontWeight: 600 }}>Sunny (&gt; ₹16k surplus)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>🌤️</span>
            <span style={{ color: '#fbbf24', fontWeight: 600 }}>Partly Cloudy (₹6k - ₹16k)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>🌧️</span>
            <span style={{ color: '#94a3b8', fontWeight: 600 }}>Rainy (₹0 - ₹6k tight margin)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>⛈️</span>
            <span style={{ color: '#f43f5e', fontWeight: 600 }}>Storm (Deficit alert)</span>
          </div>
        </div>

        <div style={{ color: 'var(--text-dim)', fontStyle: 'italic' }}>
          *Confidence degrades outward in time to reflect natural uncertainty.
        </div>
      </div>
    </div>
  );
}
