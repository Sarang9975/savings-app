import React, { useState, useRef } from 'react';
import {
  Shield, Link, ChevronRight, X, CheckCircle2, AlertTriangle,
  Loader2, FileText, TrendingUp, Wallet, Building2, ChevronDown,
  Lock, Eye, Zap, RefreshCw, Upload, ArrowRight
} from 'lucide-react';
import {
  SANDBOX_ACCOUNT,
  SANDBOX_TRANSACTIONS,
  deriveIncomeStreams,
  parseStatementCSV,
  analyzeTransactions
} from '../utils/sandboxBankData';
import { formatCurrency } from '../utils/finance';

const BANKS = [
  { id: 'hdfc',  name: 'HDFC Bank',    logo: '🔴', color: '#ef4444' },
  { id: 'sbi',   name: 'State Bank of India', logo: '💙', color: '#1d4ed8' },
  { id: 'icici', name: 'ICICI Bank',   logo: '🟠', color: '#f97316' },
  { id: 'axis',  name: 'Axis Bank',    logo: '🟣', color: '#7c3aed' },
  { id: 'kotak', name: 'Kotak Mahindra', logo: '🔵', color: '#0284c7' },
  { id: 'yes',   name: 'Yes Bank',     logo: '⚪', color: '#64748b' },
];

const STEPS = ['consent', 'select', 'otp', 'fetching', 'review'];

export default function BankConnectModal({ isOpen, onClose, onDataConnected, currency = 'INR' }) {
  const [step, setStep] = useState('consent');   // consent → select → otp → fetching → review
  const [selectedBank, setSelectedBank] = useState(null);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState(false);
  const [fetchProgress, setFetchProgress] = useState(0);
  const [fetchStatus, setFetchStatus] = useState('');
  const [derivedData, setDerivedData] = useState(null);
  const [mode, setMode] = useState('aa');   // 'aa' | 'upload'
  const [csvError, setCsvError] = useState(null);
  const fileInputRef = useRef();

  // ALL refs must be declared before any early return (Rules of Hooks)
  const otpRef0 = useRef(); const otpRef1 = useRef(); const otpRef2 = useRef();
  const otpRef3 = useRef(); const otpRef4 = useRef(); const otpRef5 = useRef();
  const otpRefs = [otpRef0, otpRef1, otpRef2, otpRef3, otpRef4, otpRef5];

  if (!isOpen) return null;

  const handleConsentProceed = () => setStep('select');

  const handleBankSelect = (bank) => {
    setSelectedBank(bank);
    setStep('otp');
  };

  const handleOtpChange = (idx, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    setOtpError(false);
    if (val && idx < 5) otpRefs[idx + 1].current?.focus();
  };

  const handleOtpKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) otpRefs[idx - 1].current?.focus();
  };

  const handleOtpVerify = () => {
    const entered = otp.join('');
    // Any 6-digit code works in sandbox ("123456" is the hint)
    if (entered.length < 6) { setOtpError(true); return; }
    setStep('fetching');
    runFetchAnimation();
  };

  const runFetchAnimation = () => {
    const stages = [
      [10, 'Establishing encrypted AA channel...'],
      [25, 'Sending consent artifact to FIP...'],
      [45, `Fetching data from ${selectedBank?.name || 'Bank'}...`],
      [65, 'Decrypting financial information...'],
      [82, 'Analyzing 3 months of transactions...'],
      [95, 'Building income intelligence...'],
      [100, 'Done!'],
    ];
    let i = 0;
    const tick = () => {
      if (i >= stages.length) {
        const { streams, analytics } = deriveIncomeStreams(SANDBOX_TRANSACTIONS);
        setDerivedData({ streams, analytics, transactions: SANDBOX_TRANSACTIONS });
        setStep('review');
        return;
      }
      const [pct, msg] = stages[i++];
      setFetchProgress(pct);
      setFetchStatus(msg);
      setTimeout(tick, 480 + Math.random() * 320);
    };
    tick();
  };

  const handleConfirmConnect = () => {
    if (derivedData) {
      onDataConnected({
        account: SANDBOX_ACCOUNT,
        streams: derivedData.streams,
        analytics: derivedData.analytics,
        transactions: derivedData.transactions,
        balance: SANDBOX_ACCOUNT.balance,
        avgMonthlyExpenses: derivedData.analytics.avgMonthlyExpenses
      });
    }
    onClose();
  };

  const handleCSVUpload = (e) => {
    setCsvError(null);
    const file = e.target.files[0];
    if (!file) return;
    if (!file.name.endsWith('.csv')) { setCsvError('Please upload a .csv file.'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const txns = parseStatementCSV(ev.target.result);
        if (txns.length < 2) { setCsvError('Could not parse transactions. See sample format below.'); return; }
        const { streams, analytics } = deriveIncomeStreams(txns);
        setDerivedData({ streams, analytics, transactions: txns });
        setStep('review');
      } catch (err) {
        setCsvError('Parse error: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const stepIndex = STEPS.indexOf(step);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(2, 4, 12, 0.88)',
      backdropFilter: 'blur(16px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'linear-gradient(165deg, #0d1117 0%, #111827 100%)',
        border: '1.5px solid rgba(99, 102, 241, 0.4)',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '560px',
        maxHeight: '90vh',
        overflow: 'auto',
        boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05)'
      }}>

        {/* ── HEADER ─────────────────────────────────────── */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(6,182,212,0.12))',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          padding: '20px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
              borderRadius: '12px', padding: '10px', color: '#fff'
            }}>
              <Link size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 900 }}>Connect Your Bank</h2>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                via RBI Account Aggregator Framework
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        {/* ── SANDBOX DISCLAIMER BAR ────────────────────── */}
        <div style={{
          background: 'rgba(245, 158, 11, 0.12)',
          borderBottom: '1px solid rgba(245, 158, 11, 0.25)',
          padding: '10px 24px',
          display: 'flex', alignItems: 'center', gap: '8px',
          fontSize: '0.78rem', color: '#fbbf24'
        }}>
          <AlertTriangle size={14} style={{ flexShrink: 0 }} />
          <span>
            <strong>Demo Mode:</strong> This uses Setu AA <em>sandbox</em> data only.
            No real bank credentials are shared. No real account is accessed.
            Consent is simulated. All figures are fictional.
          </span>
        </div>

        {/* ── MODE TOGGLE (AA / Upload) ─────────────────── */}
        {(step === 'consent' || step === 'select') && (
          <div style={{ padding: '16px 24px 0', display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setMode('aa')}
              style={{
                flex: 1, padding: '8px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem',
                background: mode === 'aa' ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)',
                border: mode === 'aa' ? '1.5px solid #6366f1' : '1.5px solid rgba(255,255,255,0.08)',
                color: mode === 'aa' ? '#a5b4fc' : 'var(--text-muted)'
              }}>
              🔗 Account Aggregator
            </button>
            <button
              onClick={() => { setMode('upload'); setStep('consent'); }}
              style={{
                flex: 1, padding: '8px', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.82rem',
                background: mode === 'upload' ? 'rgba(6,182,212,0.2)' : 'rgba(255,255,255,0.04)',
                border: mode === 'upload' ? '1.5px solid #06b6d4' : '1.5px solid rgba(255,255,255,0.08)',
                color: mode === 'upload' ? '#67e8f9' : 'var(--text-muted)'
              }}>
              📄 Upload Statement
            </button>
          </div>
        )}

        <div style={{ padding: '24px' }}>

          {/* ── STEP: CONSENT ─────────────────────────────── */}
          {step === 'consent' && mode === 'aa' && (
            <div style={{ animation: 'slideDown 0.2s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Shield size={20} color="#10b981" />
                <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Your data, your consent</h3>
              </div>

              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '16px' }}>
                GoalCast will use the <strong style={{ color: '#e2e8f0' }}>RBI Account Aggregator</strong> framework (via Setu sandbox) to read your bank statement — with your explicit consent. Here's exactly what we request:
              </p>

              {[
                { icon: <Eye size={16} />, text: 'Account statement — last 3 months', sub: 'Deposits, withdrawals, narrations' },
                { icon: <Lock size={16} />, text: 'Read-only access', sub: 'Zero ability to transfer, modify, or store credentials' },
                { icon: <Shield size={16} />, text: 'Encrypted end-to-end', sub: 'Data flows via RBI-regulated AA channel only' },
                { icon: <Zap size={16} />, text: 'One-time fetch, auto-deleted', sub: 'Not stored on any server in this demo' },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex', gap: '12px', alignItems: 'flex-start',
                  padding: '10px 14px', borderRadius: '10px',
                  background: 'rgba(255,255,255,0.04)',
                  marginBottom: '8px'
                }}>
                  <div style={{ color: '#10b981', paddingTop: '2px', flexShrink: 0 }}>{item.icon}</div>
                  <div>
                    <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#e2e8f0' }}>{item.text}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{item.sub}</div>
                  </div>
                </div>
              ))}

              <button onClick={handleConsentProceed} className="btn btn-primary" style={{ width: '100%', marginTop: '16px', fontWeight: 800, fontSize: '0.95rem' }}>
                I Consent — Connect My Bank <ChevronRight size={18} />
              </button>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textAlign: 'center', marginTop: '10px' }}>
                Powered by Setu AA · Sahamati Network · Data protected under RBI DPDP guidelines
              </p>
            </div>
          )}

          {/* ── STEP: UPLOAD STATEMENT ─────────────────── */}
          {mode === 'upload' && step !== 'review' && (
            <div style={{ animation: 'slideDown 0.2s ease' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '8px' }}>Upload Bank Statement</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.5 }}>
                Upload a CSV export from your bank's net banking portal. GoalCast parses it locally — data never leaves your device.
              </p>

              <div
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: '2px dashed rgba(6,182,212,0.4)',
                  borderRadius: '14px',
                  padding: '32px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  background: 'rgba(6,182,212,0.05)',
                  transition: 'all 0.2s ease',
                  marginBottom: '16px'
                }}>
                <Upload size={32} color="#22d3ee" style={{ marginBottom: '10px' }} />
                <div style={{ fontWeight: 700, color: '#e2e8f0', marginBottom: '4px' }}>Click to upload CSV</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                  Format: Date, Narration, Debit, Credit, Balance
                </div>
              </div>
              <input ref={fileInputRef} type="file" accept=".csv" style={{ display: 'none' }} onChange={handleCSVUpload} />

              {csvError && (
                <div style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: '8px', padding: '10px 14px', color: '#fb7185', fontSize: '0.82rem', marginBottom: '12px' }}>
                  ⚠️ {csvError}
                </div>
              )}

              {/* Sample CSV format */}
              <div style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '12px 14px' }}>
                <div style={{ fontSize: '0.73rem', color: 'var(--text-dim)', marginBottom: '6px', fontWeight: 700, textTransform: 'uppercase' }}>Sample CSV Format</div>
                <pre style={{ fontSize: '0.72rem', color: '#94a3b8', margin: 0, lineHeight: 1.6, overflow: 'auto' }}>{`Date,Narration,Debit,Credit,Balance
01/09/2026,TechCorp Salary,,45000,80000
03/09/2026,Rent Payment,12000,,68000
05/09/2026,Freelance Client,,18000,86000`}</pre>
              </div>
            </div>
          )}

          {/* ── STEP: SELECT BANK ─────────────────────────── */}
          {step === 'select' && mode === 'aa' && (
            <div style={{ animation: 'slideDown 0.2s ease' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '4px' }}>Select your bank</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Any selection uses HDFC sandbox data in this demo.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                {BANKS.map(bank => (
                  <button
                    key={bank.id}
                    onClick={() => handleBankSelect(bank)}
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1.5px solid rgba(255,255,255,0.08)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '10px',
                      transition: 'all 0.15s ease',
                      color: '#e2e8f0'
                    }}
                    onMouseOver={e => e.currentTarget.style.background = `${bank.color}20`}
                    onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                  >
                    <span style={{ fontSize: '1.4rem' }}>{bank.logo}</span>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{bank.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP: OTP ─────────────────────────────────── */}
          {step === 'otp' && (
            <div style={{ animation: 'slideDown 0.2s ease', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{selectedBank?.logo}</div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '4px' }}>Enter OTP from {selectedBank?.name}</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                Sent to +91 XXXXX X4821 (sandbox: enter any 6 digits)
              </p>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '20px' }}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={otpRefs[i]}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(i, e)}
                    style={{
                      width: '46px', height: '52px', textAlign: 'center', fontSize: '1.4rem',
                      fontWeight: 800, borderRadius: '10px',
                      background: 'rgba(255,255,255,0.06)',
                      border: otpError ? '2px solid #f43f5e' : '1.5px solid rgba(255,255,255,0.15)',
                      color: '#fff', outline: 'none'
                    }}
                  />
                ))}
              </div>

              {otpError && <p style={{ color: '#fb7185', fontSize: '0.82rem', marginBottom: '12px' }}>Enter all 6 digits</p>}

              <button onClick={handleOtpVerify} className="btn btn-primary" style={{ width: '100%', fontWeight: 800 }}>
                Verify & Fetch Data <ChevronRight size={16} />
              </button>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '10px' }}>
                Hint: any 6 digits work in sandbox mode
              </p>
            </div>
          )}

          {/* ── STEP: FETCHING ────────────────────────────── */}
          {step === 'fetching' && (
            <div style={{ textAlign: 'center', animation: 'slideDown 0.2s ease' }}>
              <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 20px' }}>
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: '50%',
                  border: '3px solid rgba(99,102,241,0.2)'
                }} />
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: '50%',
                  border: '3px solid transparent',
                  borderTopColor: '#6366f1',
                  animation: 'spin 1s linear infinite'
                }} />
                <div style={{
                  position: 'absolute', inset: '12px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(6,182,212,0.2))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <Lock size={20} color="#818cf8" />
                </div>
              </div>
              <h3 style={{ fontWeight: 800, marginBottom: '8px' }}>Fetching via AA channel...</h3>
              <p style={{ fontSize: '0.82rem', color: '#818cf8', marginBottom: '20px' }}>{fetchStatus}</p>

              <div style={{ height: '8px', background: 'rgba(255,255,255,0.07)', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{
                  width: `${fetchProgress}%`, height: '100%',
                  background: 'linear-gradient(90deg, #6366f1, #06b6d4)',
                  borderRadius: '99px', transition: 'width 0.4s ease'
                }} />
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '8px', textAlign: 'right' }}>
                {fetchProgress}%
              </div>
            </div>
          )}

          {/* ── STEP: REVIEW ──────────────────────────────── */}
          {step === 'review' && derivedData && (
            <div style={{ animation: 'slideDown 0.2s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <CheckCircle2 size={22} color="#10b981" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 900 }}>Bank Data Analyzed ✓</h3>
              </div>

              {/* Account chip */}
              <div style={{
                background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16,185,129,0.3)',
                borderRadius: '10px', padding: '10px 14px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginBottom: '16px', flexWrap: 'wrap', gap: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Building2 size={16} color="#10b981" />
                  <span style={{ fontWeight: 700, fontSize: '0.86rem' }}>
                    {SANDBOX_ACCOUNT.bank} · {SANDBOX_ACCOUNT.accountMasked}
                  </span>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#86efac', background: 'rgba(16,185,129,0.15)', padding: '2px 10px', borderRadius: '99px' }}>
                  Sandbox Data
                </span>
              </div>

              {/* KPI row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '16px' }}>
                {[
                  { label: 'Current Balance', value: formatCurrency(SANDBOX_ACCOUNT.balance, currency), icon: <Wallet size={16} />, color: '#10b981' },
                  { label: 'Avg Monthly Income', value: formatCurrency(derivedData.analytics.avgMonthlyIncome, currency), icon: <TrendingUp size={16} />, color: '#6366f1' },
                  { label: 'Avg Monthly Expenses', value: formatCurrency(derivedData.analytics.avgMonthlyExpenses, currency), icon: <ArrowRight size={16} />, color: '#f59e0b' },
                  { label: 'Avg Net Surplus', value: formatCurrency(derivedData.analytics.avgSurplus, currency), icon: <Zap size={16} />, color: '#38bdf8' },
                ].map((kpi, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '12px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: kpi.color, marginBottom: '4px' }}>
                      {kpi.icon}
                      <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700 }}>{kpi.label}</span>
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#fff' }}>{kpi.value}</div>
                  </div>
                ))}
              </div>

              {/* Detected income streams */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, marginBottom: '8px' }}>
                  Income Streams Detected ({derivedData.streams.length})
                </div>
                {derivedData.streams.map((s, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '8px 12px', borderRadius: '8px',
                    background: 'rgba(255,255,255,0.04)', marginBottom: '6px', gap: '10px', flexWrap: 'wrap'
                  }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.84rem', color: '#e2e8f0' }}>{s.title}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'capitalize' }}>
                        {s.type} · {s.probability}% probability
                      </div>
                    </div>
                    <div style={{ fontWeight: 800, color: '#34d399', fontSize: '0.92rem', whiteSpace: 'nowrap' }}>
                      {formatCurrency(s.amount, currency)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Transactions preview */}
              <details style={{ marginBottom: '16px' }}>
                <summary style={{ fontSize: '0.8rem', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 700, userSelect: 'none', marginBottom: '8px' }}>
                  📋 View raw transactions ({derivedData.transactions.length})
                </summary>
                <div style={{ maxHeight: '160px', overflowY: 'auto', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  {derivedData.transactions.slice(0, 12).map((t, i) => (
                    <div key={i} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '7px 12px', borderBottom: i < 11 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                      fontSize: '0.76rem'
                    }}>
                      <div>
                        <div style={{ color: '#cbd5e1', fontWeight: 600 }}>{t.narration?.slice(0, 42)}{t.narration?.length > 42 ? '…' : ''}</div>
                        <div style={{ color: 'var(--text-dim)' }}>{t.date}</div>
                      </div>
                      <div style={{ fontWeight: 800, color: t.type === 'CREDIT' ? '#34d399' : '#f87171', whiteSpace: 'nowrap', paddingLeft: '12px' }}>
                        {t.type === 'CREDIT' ? '+' : '-'}{formatCurrency(Math.abs(t.amount), currency)}
                      </div>
                    </div>
                  ))}
                </div>
              </details>

              <button onClick={handleConfirmConnect} className="btn btn-primary" style={{ width: '100%', fontWeight: 800, fontSize: '0.95rem' }}>
                <Zap size={16} />
                Apply to GoalCast — Update My Plan
              </button>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textAlign: 'center', marginTop: '8px' }}>
                This will replace your manually entered income streams with bank-derived data.
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
