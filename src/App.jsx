import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  LayoutDashboard, Target, Wallet, Brain,
  Plus, Settings, Link2, RefreshCw, ChevronRight,
  TrendingUp, TrendingDown, Clock, Zap, AlertTriangle,
  CheckCircle2, Edit3, Trash2, ArrowUp, ArrowDown,
  X, Save, Sparkles, Compass
} from 'lucide-react';

import { calculateGoalTimeline, calculatePipelineMetrics, formatCurrency, getTargetDate } from './utils/finance';
import { useCountUp } from './utils/hooks';
import ProductionGoalCard from './components/ProductionGoalCard';
import BankConnectModal from './components/BankConnectModal';
import BankDataFlipBanner from './components/BankDataFlipBanner';
import AIFinancialIntelligenceHub from './components/AIFinancialIntelligenceHub';

// ── SEED DATA ────────────────────────────────────────────────────
const SEED_GOALS = [
  { id: 'g1', icon: '💻', title: 'MacBook Pro M4', category: 'Laptop', price: 165000, saved: 42000, monthlySaving: 12000, urgency: 'high',   importance: 5 },
  { id: 'g2', icon: '🏍️', title: 'Royal Enfield Hunter 350', category: 'Bike',   price: 155000, saved: 28000, monthlySaving: 8000,  urgency: 'medium', importance: 4 },
  { id: 'g3', icon: '📱', title: 'iPhone 16 Pro',       category: 'Phone',  price: 134900, saved: 22000, monthlySaving: 6000,  urgency: 'low',    importance: 3 },
];
const SEED_STREAMS = [
  { id: 's1', title: 'Client Retainer (monthly)', amount: 45000, type: 'recurring',   probability: 98, active: true },
  { id: 's2', title: 'E-commerce redesign project', amount: 28000, type: 'freelance',   probability: 70, active: true },
  { id: 's3', title: 'National Hackathon Prize',     amount: 50000, type: 'opportunity', probability: 18, active: true },
];

// ── PURE HELPERS ────────────────────────────────────────────────
function persist(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch(_) {} }
function load(key, fallback) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch(_) { return fallback; } }

// ── TOP BAR ─────────────────────────────────────────────────────
function Topbar({ surplus, currency, onAddGoal, onReset, bankConnected, onConnectBank }) {
  const displaySurplus = useCountUp(surplus);
  const positive = displaySurplus >= 0;

  return (
    <header className="topbar">
      <div className="topbar-inner">
        {/* Logo */}
        <div className="topbar-logo">
          <div className="topbar-logo-mark">
            <Compass size={17} />
          </div>
          <span className="topbar-logo-text">GoalCast</span>
        </div>

        {/* Live surplus pill */}
        <div className={`surplus-pill ${positive ? 'positive' : 'negative'}`}>
          {positive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          <span>
            {positive ? '+' : ''}{formatCurrency(displaySurplus, currency)}/mo net surplus
          </span>
        </div>

        {/* Actions */}
        <div className="topbar-right">
          {bankConnected ? (
            <span className="badge badge-emerald" style={{ cursor: 'pointer' }} onClick={onConnectBank}>
              🏦 Bank Linked
            </span>
          ) : (
            <button className="bank-connect-btn" onClick={onConnectBank}>
              <Link2 size={13} /> Connect Bank
            </button>
          )}
          <button className="btn btn-ghost btn-icon" title="Reset demo" onClick={onReset}><RefreshCw size={14} /></button>
          <button className="btn btn-primary btn-sm" onClick={onAddGoal}><Plus size={14} /> Add Goal</button>
        </div>
      </div>
    </header>
  );
}

// ── STAT BAR ─────────────────────────────────────────────────────
function StatBar({ goals, streams, currentSavings, monthlyExpenses, currency, useInterest }) {
  const metrics = calculatePipelineMetrics(streams);
  const income = useCountUp(Math.round(metrics.riskAdjustedExpected));
  const savings = useCountUp(currentSavings);
  const expenses = useCountUp(monthlyExpenses);

  const nextGoal = goals[0];
  const nextTimeline = nextGoal ? calculateGoalTimeline(nextGoal.price, nextGoal.saved, nextGoal.monthlySaving, useInterest) : null;
  const nextDate = nextTimeline && !nextTimeline.isZeroSaving ? getTargetDate(nextTimeline.months) : null;

  return (
    <div className="grid-4 animate-slide-up" style={{ marginBottom: '24px' }}>
      {[
        {
          label: 'Risk-Adj. Inflow',
          value: formatCurrency(income, currency),
          sub: `${streams.filter(s => s.active).length} active streams`
        },
        {
          label: 'Total Capital Saved',
          value: formatCurrency(savings, currency),
          sub: `across ${goals.length} active goals`
        },
        {
          label: 'Monthly Living Costs',
          value: formatCurrency(expenses, currency),
          sub: 'baseline personal burn'
        },
        {
          label: 'Primary Target ETA',
          value: nextDate ? nextDate.fullString : (nextTimeline?.isZeroSaving ? 'Never (₹0/mo)' : '—'),
          sub: nextGoal ? `${nextGoal.title} (${Math.ceil(nextTimeline?.months || 0)} mo)` : 'No goals configured',
          small: !!nextDate
        },
      ].map((s, i) => (
        <div key={i} className="stat-card">
          <div className="stat-label">{s.label}</div>
          <div className="stat-value" style={{ fontSize: s.small ? '1.35rem' : undefined }}>{s.value}</div>
          <div className="stat-sub">{s.sub}</div>
        </div>
      ))}
    </div>
  );
}

// ── INCOME STREAM ROW ────────────────────────────────────────────
function StreamRow({ stream, onEdit, onDelete, onToggle, currency }) {
  const typeColor = {
    recurring:   { color: 'var(--indigo)', bg: 'var(--indigo-dim)' },
    freelance:   { color: 'var(--cyan)',   bg: 'var(--cyan-dim)' },
    opportunity: { color: 'var(--amber)',  bg: 'var(--amber-dim)' },
  }[stream.type] || { color: 'var(--t2)', bg: 'var(--surface)' };

  const expected = Math.round(stream.amount * stream.probability / 100);

  return (
    <div className="stream-row" style={{ opacity: stream.active ? 1 : 0.45 }}>
      {/* Type dot */}
      <div className="prob-dot" style={{ background: typeColor.color, boxShadow: `0 0 6px ${typeColor.color}` }} />

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--t1)', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {stream.title}
          {stream.source === 'bank' && <span style={{ marginLeft: '6px', fontSize: '0.65rem', color: '#34d399', background: 'var(--emerald-dim)', padding: '1px 6px', borderRadius: 'var(--r-full)', border: '1px solid rgba(16,185,129,0.2)', verticalAlign: 'middle' }}>🏦 bank</span>}
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 600, padding: '2px 8px', borderRadius: 'var(--r-full)', background: typeColor.bg, color: typeColor.color, textTransform: 'capitalize' }}>{stream.type}</span>
          <span style={{ fontSize: '0.72rem', color: 'var(--t3)' }}>{stream.probability}% likely</span>
        </div>
      </div>

      {/* Amounts */}
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--t1)' }}>{formatCurrency(stream.amount, currency)}</div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '0.75rem', color: '#34d399' }}>≈ {formatCurrency(expected, currency)} expected</div>
      </div>

      {/* Toggle + actions */}
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
        <div className={`toggle ${stream.active ? 'on' : ''}`} onClick={() => onToggle(stream.id)}>
          <div className="toggle-thumb" />
        </div>
        <button className="btn btn-ghost btn-icon btn-sm" onClick={() => onEdit(stream)}><Edit3 size={13} /></button>
        <button className="btn btn-danger btn-icon btn-sm" onClick={() => onDelete(stream.id)}><Trash2 size={13} /></button>
      </div>
    </div>
  );
}

// ── ADD GOAL MODAL ───────────────────────────────────────────────
function GoalModal({ isOpen, onClose, onSave, editing, useInterest, currency }) {
  const [form, setForm] = useState({ icon: '🎯', title: '', category: 'General', price: 50000, saved: 0, monthlySaving: 5000, urgency: 'medium', importance: 3 });

  useEffect(() => {
    if (editing) setForm({ ...form, ...editing });
    else setForm({ icon: '🎯', title: '', category: 'General', price: 50000, saved: 0, monthlySaving: 5000, urgency: 'medium', importance: 3 });
  }, [editing, isOpen]);

  if (!isOpen) return null;

  const tl = calculateGoalTimeline(form.price, form.saved, form.monthlySaving, useInterest);
  const date = tl.isZeroSaving ? null : getTargetDate(tl.months);

  const icons = ['💻', '📱', '🏍️', '🎮', '✈️', '📷', '🎯', '⌚', '📺', '🚗', '🏠', '📚'];

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.title.trim() || form.price <= 0) return;
    onSave({ ...form, id: editing?.id || `g-${Date.now()}` });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{editing ? 'Edit Goal' : 'New Savings Goal'}</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--t3)', marginTop: '3px' }}>Every big purchase starts with a plan.</p>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={17} /></button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* ETA preview bar */}
          {form.title && (
            <div className={`notice ${tl.isZeroSaving ? 'notice-rose' : 'notice-indigo'}`}>
              {tl.isZeroSaving
                ? <><AlertTriangle size={14} /> Monthly saving is ₹0 — you'll never reach this goal at this rate.</>
                : <><Clock size={14} /> At {formatCurrency(form.monthlySaving, currency)}/mo you'll reach this by <strong>{date?.fullString}</strong> ({Math.ceil(tl.months)} months)</>
              }
            </div>
          )}

          {/* Icon picker */}
          <div className="form-group">
            <label className="form-label">Icon</label>
            <div className="pill-group">
              {icons.map(ic => (
                <button key={ic} onClick={() => set('icon', ic)} className={`pill ${form.icon === ic ? 'active' : ''}`} style={{ fontSize: '1.1rem', padding: '4px 10px' }}>{ic}</button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Goal Name</label>
            <input className="form-input" placeholder="e.g. MacBook Pro M4" value={form.title} onChange={e => set('title', e.target.value)} autoFocus />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Total Price ({currency === 'INR' ? '₹' : '$'})</label>
              <input className="form-input" type="number" min="1" value={form.price} onChange={e => set('price', +e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Already Saved</label>
              <input className="form-input" type="number" min="0" value={form.saved} onChange={e => set('saved', +e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              Monthly Saving
              <span style={{ fontFamily: 'var(--mono)', color: 'var(--t2)' }}>{formatCurrency(form.monthlySaving, currency)}</span>
            </label>
            <input type="range" min="0" max={Math.max(form.price, 200000)} step="500" value={form.monthlySaving} onChange={e => set('monthlySaving', +e.target.value)} />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Urgency</label>
              <div className="pill-group">
                {['high', 'medium', 'low'].map(u => (
                  <button key={u} className={`pill ${form.urgency === u ? 'active' : ''}`} onClick={() => set('urgency', u)} style={{ textTransform: 'capitalize', flex: 1, justifyContent: 'center' }}>{u}</button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Importance</label>
              <div className="pill-group">
                {[1,2,3,4,5].map(n => (
                  <button key={n} className={`pill ${form.importance === n ? 'active' : ''}`} onClick={() => set('importance', n)} style={{ flex: 1, justifyContent: 'center' }}>{'⭐'.repeat(n)}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={!form.title.trim() || form.price <= 0}>
            <Save size={15} /> {editing ? 'Save Changes' : 'Add Goal'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── ADD STREAM MODAL ─────────────────────────────────────────────
function StreamModal({ isOpen, onClose, onSave, editing, currency }) {
  const [form, setForm] = useState({ title: '', amount: 20000, type: 'recurring', probability: 80, active: true });

  useEffect(() => {
    if (editing) setForm({ ...editing });
    else setForm({ title: '', amount: 20000, type: 'recurring', probability: 80, active: true });
  }, [editing, isOpen]);

  if (!isOpen) return null;
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const expected = Math.round(form.amount * form.probability / 100);

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{editing ? 'Edit Income Stream' : 'Add Income Stream'}</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--t3)', marginTop: '3px' }}>Track every earning source with its likelihood.</p>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={17} /></button>
        </div>
        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="notice notice-indigo" style={{ justifyContent: 'space-between' }}>
            <span>Risk-adjusted yield:</span>
            <strong style={{ fontFamily: 'var(--mono)' }}>{formatCurrency(expected, currency)} / month</strong>
          </div>

          <div className="form-group">
            <label className="form-label">Income Description</label>
            <input className="form-input" placeholder="e.g. Freelance client retainer" value={form.title} onChange={e => set('title', e.target.value)} autoFocus />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Gross Amount</label>
              <input className="form-input" type="number" min="1" value={form.amount} onChange={e => set('amount', +e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Type</label>
              <select className="form-select" value={form.type} onChange={e => set('type', e.target.value)}>
                <option value="recurring">Recurring (salary/retainer)</option>
                <option value="freelance">Freelance project</option>
                <option value="opportunity">Opportunity/Prize</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              Confidence Probability
              <span style={{ fontFamily: 'var(--mono)', color: 'var(--t2)' }}>{form.probability}%</span>
            </label>
            <input type="range" min="1" max="100" value={form.probability} onChange={e => set('probability', +e.target.value)} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--t3)', marginTop: '4px' }}>
              <span>Speculative</span><span>Confirmed</span>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={() => { onSave({ ...form, id: editing?.id || `s-${Date.now()}` }); onClose(); }} disabled={!form.title.trim()}>
            <Save size={15} /> {editing ? 'Save' : 'Add Stream'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── SETTINGS PANEL ───────────────────────────────────────────────
function SettingsPanel({ useInterest, setUseInterest, currency, setCurrency, monthlyExpenses, setMonthlyExpenses, currentSavings, setCurrentSavings }) {
  return (
    <div className="card" style={{ padding: '20px 22px', marginBottom: '24px', display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center' }}>
      {/* Expenses */}
      <div style={{ display: 'flex', flex: '1 1 200px', flexDirection: 'column', gap: '6px', minWidth: 0 }}>
        <label className="form-label" style={{ whiteSpace: 'nowrap' }}>Monthly Expenses</label>
        <input className="form-input" type="number" value={monthlyExpenses} onChange={e => setMonthlyExpenses(+e.target.value)} style={{ fontFamily: 'var(--mono)' }} />
      </div>
      {/* Current savings */}
      <div style={{ display: 'flex', flex: '1 1 200px', flexDirection: 'column', gap: '6px', minWidth: 0 }}>
        <label className="form-label" style={{ whiteSpace: 'nowrap' }}>Current Total Savings</label>
        <input className="form-input" type="number" value={currentSavings} onChange={e => setCurrentSavings(+e.target.value)} style={{ fontFamily: 'var(--mono)' }} />
      </div>
      {/* Currency */}
      <div style={{ display: 'flex', flex: '0 0 auto', flexDirection: 'column', gap: '6px' }}>
        <label className="form-label">Currency</label>
        <div className="pill-group">
          {['INR', 'USD'].map(c => <button key={c} className={`pill ${currency === c ? 'active' : ''}`} onClick={() => setCurrency(c)}>{c === 'INR' ? '₹ INR' : '$ USD'}</button>)}
        </div>
      </div>
      {/* 6% Interest */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flex: '0 0 auto' }}>
        <div className={`toggle ${useInterest ? 'on' : ''}`} onClick={() => setUseInterest(p => !p)}>
          <div className="toggle-thumb" />
        </div>
        <div>
          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--t2)' }}>6% Interest</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--t3)' }}>{useInterest ? 'Applied to savings' : 'Off'}</div>
        </div>
      </div>
    </div>
  );
}

// ── MAIN APP ─────────────────────────────────────────────────────
export default function App() {
  // Core state — persisted
  const [goals, setGoals] = useState(() => load('gc_goals', SEED_GOALS));
  const [streams, setStreams] = useState(() => load('gc_streams', SEED_STREAMS));
  const [currentSavings, setCurrentSavings] = useState(() => load('gc_savings', 35000));
  const [monthlyExpenses, setMonthlyExpenses] = useState(() => load('gc_expenses', 18000));
  const [useInterest, setUseInterest] = useState(() => load('gc_interest', true));
  const [currency, setCurrency] = useState(() => load('gc_currency', 'INR'));

  // UI state
  const [tab, setTab] = useState('goals');      // goals | income | plan | intelligence
  const [goalModal, setGoalModal] = useState({ open: false, editing: null });
  const [streamModal, setStreamModal] = useState({ open: false, editing: null });
  const [bankModal, setBankModal] = useState(false);
  const [bankConn, setBankConn] = useState(null);
  const [preConn, setPreConn] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  // Persist on change
  useEffect(() => { persist('gc_goals', goals); }, [goals]);
  useEffect(() => { persist('gc_streams', streams); }, [streams]);
  useEffect(() => { persist('gc_savings', currentSavings); }, [currentSavings]);
  useEffect(() => { persist('gc_expenses', monthlyExpenses); }, [monthlyExpenses]);
  useEffect(() => { persist('gc_interest', useInterest); }, [useInterest]);
  useEffect(() => { persist('gc_currency', currency); }, [currency]);

  // Derived
  const metrics = calculatePipelineMetrics(streams);
  const surplus = Math.round(metrics.riskAdjustedExpected - monthlyExpenses);

  // Goal CRUD
  const saveGoal = useCallback((g) => {
    setGoals(prev => prev.some(x => x.id === g.id) ? prev.map(x => x.id === g.id ? g : x) : [g, ...prev]);
  }, []);
  const deleteGoal = useCallback((id) => { if (confirm('Remove this goal?')) setGoals(prev => prev.filter(g => g.id !== id)); }, []);
  const moveUp   = useCallback((id) => setGoals(prev => { const i = prev.findIndex(g => g.id === id); if (i <= 0) return prev; const a = [...prev]; [a[i-1], a[i]] = [a[i], a[i-1]]; return a; }), []);
  const moveDown = useCallback((id) => setGoals(prev => { const i = prev.findIndex(g => g.id === id); if (i < 0 || i >= prev.length-1) return prev; const a = [...prev]; [a[i], a[i+1]] = [a[i+1], a[i]]; return a; }), []);
  const updateGoalMonthlySaving = useCallback((id, amount) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, monthlySaving: amount } : g));
  }, []);

  // Stream CRUD
  const saveStream = useCallback((s) => {
    setStreams(prev => prev.some(x => x.id === s.id) ? prev.map(x => x.id === s.id ? s : x) : [s, ...prev]);
  }, []);
  const deleteStream = useCallback((id) => { if (confirm('Remove this income stream?')) setStreams(prev => prev.filter(s => s.id !== id)); }, []);
  const toggleStream = useCallback((id) => setStreams(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s)), []);

  // Bank connect
  const handleBankData = ({ account, streams: newStreams, analytics, balance, avgMonthlyExpenses }) => {
    setPreConn(streams);
    setStreams(newStreams);
    setCurrentSavings(balance);
    setMonthlyExpenses(avgMonthlyExpenses);
    setBankConn({ account, analytics, streams: newStreams });
    setTab('income');
  };
  const disconnectBank = () => { if (preConn) setStreams(preConn); setPreConn(null); setBankConn(null); };

  // ML callbacks
  const handleMLGoal   = (partial) => { setGoalModal({ open: true, editing: partial }); };
  const handleMLStream = (s)       => { setStreams(prev => [s, ...prev]); };

  const resetAll = () => {
    if (!confirm('Reset all data to demo values?')) return;
    setGoals(SEED_GOALS); setStreams(SEED_STREAMS);
    setCurrentSavings(35000); setMonthlyExpenses(18000);
    setBankConn(null); setPreConn(null);
  };

  const TABS = [
    { id: 'goals',        label: 'Goals',        icon: <Target size={15} /> },
    { id: 'income',       label: 'Income',        icon: <Wallet size={15} /> },
    { id: 'plan',         label: 'My Plan',       icon: <TrendingUp size={15} /> },
    { id: 'intelligence', label: 'AI + ML',       icon: <Brain size={15} /> },
  ];

  return (
    <>
      {/* TOPBAR */}
      <Topbar
        surplus={surplus}
        currency={currency}
        onAddGoal={() => setGoalModal({ open: true, editing: null })}
        onReset={resetAll}
        bankConnected={!!bankConn}
        onConnectBank={() => setBankModal(true)}
      />

      <div className="app">
        {/* NAV */}
        <nav className="nav">
          {TABS.map(t => (
            <button key={t.id} className={`nav-item ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
              {t.icon} {t.label}
            </button>
          ))}
          <div style={{ marginLeft: 'auto' }}>
            <button className={`nav-item ${showSettings ? 'active' : ''}`} onClick={() => setShowSettings(p => !p)}>
              <Settings size={15} /> Settings
            </button>
          </div>
        </nav>

        {/* SETTINGS (inline, collapses) */}
        {showSettings && (
          <SettingsPanel
            useInterest={useInterest} setUseInterest={setUseInterest}
            currency={currency} setCurrency={setCurrency}
            monthlyExpenses={monthlyExpenses} setMonthlyExpenses={setMonthlyExpenses}
            currentSavings={currentSavings} setCurrentSavings={setCurrentSavings}
          />
        )}

        {/* STAT BAR — always visible */}
        <StatBar goals={goals} streams={streams} currentSavings={currentSavings} monthlyExpenses={monthlyExpenses} currency={currency} useInterest={useInterest} />

        {/* ── TAB: GOALS ─────────────────────────────────────── */}
        {tab === 'goals' && (
          <div key="goals" className="animate-slide-up">
            <div className="section-header">
              <div>
                <div className="section-title">Savings Goals</div>
                <div className="section-sub">Ranked in sequential priority · top item is targeted first</div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select className="form-select" style={{ width: 'auto', padding: '6px 10px', fontSize: '0.82rem' }} onChange={e => {
                  if (!e.target.value) return;
                  const c = e.target.value;
                  e.target.value = '';
                  setGoals(prev => c === 'all' ? prev : prev.filter(g => g.category.toLowerCase() === c));
                }}>
                  <option value="">Filter category…</option>
                  <option value="all">Show all</option>
                  {[...new Set(goals.map(g => g.category))].map(c => <option key={c} value={c.toLowerCase()}>{c}</option>)}
                </select>
                <button className="btn btn-primary btn-sm" onClick={() => setGoalModal({ open: true, editing: null })}>
                  <Plus size={14} /> Add Goal
                </button>
              </div>
            </div>

            {goals.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🎯</div>
                <div style={{ fontWeight: 700, marginBottom: '6px' }}>No goals yet</div>
                <div style={{ fontSize: '0.85rem', marginBottom: '16px' }}>Add your first savings goal to get started</div>
                <button className="btn btn-primary" onClick={() => setGoalModal({ open: true, editing: null })}>
                  <Plus size={15} /> Add First Goal
                </button>
              </div>
            ) : (
              <div className="grid-2">
                {goals.map((g, i) => (
                  <ProductionGoalCard
                    key={g.id}
                    goal={g}
                    rank={i+1}
                    total={goals.length}
                    useInterest={useInterest}
                    currency={currency}
                    onEdit={g => setGoalModal({ open: true, editing: g })}
                    onDelete={deleteGoal}
                    onMoveUp={moveUp}
                    onMoveDown={moveDown}
                    onUpdateMonthlySaving={updateGoalMonthlySaving}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB: INCOME ────────────────────────────────────── */}
        {tab === 'income' && (
          <div key="income" className="animate-slide-up">
            <div className="section-header">
              <div>
                <div className="section-title">Income Pipeline</div>
                <div className="section-sub">Probability-weighted. Your plan updates live as you change these.</div>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                {bankConn ? (
                  <button className="btn btn-success btn-sm" onClick={disconnectBank}>🏦 {bankConn.account.bank} · Disconnect</button>
                ) : (
                  <button className="bank-connect-btn" style={{ padding: '7px 16px', fontSize: '0.8rem' }} onClick={() => setBankModal(true)}>
                    <Link2 size={14} /> Connect your bank (demo)
                  </button>
                )}
                <button className="btn btn-ghost btn-sm" onClick={() => setStreamModal({ open: true, editing: null })}>
                  <Plus size={14} /> Add Stream
                </button>
              </div>
            </div>

            {/* Flip banner */}
            {bankConn && preConn && (
              <BankDataFlipBanner
                account={bankConn.account} analytics={bankConn.analytics}
                streams={bankConn.streams} manualStreams={preConn}
                manualExpenses={monthlyExpenses} currentSavings={currentSavings}
                onDismiss={() => setBankConn(null)}
                currency={currency}
              />
            )}

            {/* Metric strip */}
            <div className="grid-3 animate-slide-up-d1" style={{ marginBottom: '20px' }}>
              {[
                { label: 'Gross Potential', value: formatCurrency(metrics.grossPotential, currency) },
                { label: 'Risk-Adjusted Expected', value: formatCurrency(metrics.riskAdjustedExpected, currency) },
                { label: 'Confirmed Inflow', value: formatCurrency(metrics.confirmedAmount, currency) },
              ].map((m, i) => (
                <div key={i} className="stat-card">
                  <div className="stat-label">{m.label}</div>
                  <div className="stat-value" style={{ fontSize: '1.35rem' }}>{m.value}</div>
                </div>
              ))}
            </div>

            {/* Stream list */}
            {streams.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">💼</div>
                <div style={{ fontWeight: 700, marginBottom: '6px' }}>No income streams</div>
                <div style={{ fontSize: '0.85rem', marginBottom: '16px' }}>Add your salary, freelance work, or any expected income</div>
                <button className="btn btn-primary" onClick={() => setStreamModal({ open: true, editing: null })}><Plus size={15} /> Add First Stream</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }} className="animate-slide-up-d2">
                {streams.map((s, i) => (
                  <StreamRow key={s.id} stream={s} currency={currency}
                    onEdit={s => setStreamModal({ open: true, editing: s })}
                    onDelete={deleteStream} onToggle={toggleStream}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB: PLAN ──────────────────────────────────────── */}
        {tab === 'plan' && (
          <div key="plan" className="animate-slide-up">
            <div className="section-header">
              <div>
                <div className="section-title">Your Financial Roadmap</div>
                <div className="section-sub">Goal ETAs recalculate live based on your income pipeline.</div>
              </div>
            </div>

            {goals.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🗺️</div>
                <div style={{ fontWeight: 700, marginBottom: '6px' }}>No goals to plan</div>
                <button className="btn btn-primary" onClick={() => { setTab('goals'); setTimeout(() => setGoalModal({ open: true, editing: null }), 100); }}>Add a goal first</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {goals.map((goal, i) => {
                  const tl = calculateGoalTimeline(goal.price, goal.saved, goal.monthlySaving, useInterest);
                  const date = tl.isZeroSaving ? null : getTargetDate(tl.months);
                  const pct = Math.min(100, tl.progressPct);
                  const isCompleted = pct >= 100;

                  return (
                    <div key={goal.id} className="card" style={{ padding: '20px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
                        {/* Rank circle */}
                        <div style={{
                          width: '36px', height: '36px', borderRadius: 'var(--r-sm)', flexShrink: 0,
                          background: 'var(--card-bg-elevated)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 700, fontSize: '0.88rem', color: i === 0 ? '#f59e0b' : 'var(--text-secondary)',
                          border: '1px solid var(--border)'
                        }}>
                          #{i+1}
                        </div>

                        {/* Info */}
                        <div style={{ flex: 1, minWidth: '220px' }}>
                          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '1.2rem' }}>{goal.icon}</span>
                            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{goal.title}</span>
                            {isCompleted && <span className="badge badge-emerald">✓ Achieved</span>}
                            {tl.isZeroSaving && <span className="badge badge-rose"><AlertTriangle size={11} /> Paused (₹0/mo)</span>}
                          </div>

                          <div className="prod-progress-track" style={{ marginBottom: '12px' }}>
                            <div className={`prod-progress-fill-base ${isCompleted ? 'emerald' : tl.isZeroSaving ? 'rose' : ''}`} style={{ width: `${pct}%` }} />
                          </div>

                          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                            {[
                              { label: 'Current Saved', value: formatCurrency(goal.saved, currency) },
                              { label: 'Target Price', value: formatCurrency(goal.price, currency) },
                              { label: 'Monthly Allocation', value: formatCurrency(goal.monthlySaving, currency) },
                              { label: tl.isZeroSaving ? 'Target ETA' : 'Reaches Goal', value: tl.isZeroSaving ? 'Never' : date?.fullString },
                            ].map((kpi, j) => (
                              <div key={j}>
                                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{kpi.label}</div>
                                <div style={{ fontFamily: 'var(--mono)', fontWeight: 700, fontSize: '0.88rem', color: j === 3 && !tl.isZeroSaving ? '#34d399' : tl.isZeroSaving && j === 3 ? '#fb7185' : 'var(--text-secondary)' }}>{kpi.value}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Scenario badges */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end', flexShrink: 0 }}>
                          {!tl.isZeroSaving && [
                            { label: 'Conservative (-30%)', mult: 0.7, color: '#fb7185' },
                            { label: 'Expected Baseline', mult: 1.0, color: '#f8fafc' },
                            { label: 'Optimistic (+30%)', mult: 1.3, color: '#34d399' },
                          ].map(sc => {
                            const adj = calculateGoalTimeline(goal.price, goal.saved, Math.round(goal.monthlySaving * sc.mult), useInterest);
                            const d = adj.isZeroSaving ? null : getTargetDate(adj.months);
                            return (
                              <div key={sc.label} style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{sc.label}</div>
                                <div style={{ fontFamily: 'var(--mono)', fontSize: '0.8rem', fontWeight: 700, color: sc.color }}>
                                  {d ? d.fullString : '—'}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── TAB: AI + ML ───────────────────────────────────── */}
        {tab === 'intelligence' && (
          <AIFinancialIntelligenceHub
            goals={goals}
            setGoals={setGoals}
            streams={streams}
            setStreams={setStreams}
            currentSavings={currentSavings}
            monthlyExpenses={monthlyExpenses}
            useInterest={useInterest}
            currency={currency}
            onOpenGoalModal={handleMLGoal}
          />
        )}
      </div>

      {/* ── MODALS ─────────────────────────────────────────────── */}
      <GoalModal
        isOpen={goalModal.open}
        onClose={() => setGoalModal({ open: false, editing: null })}
        onSave={saveGoal}
        editing={goalModal.editing}
        useInterest={useInterest}
        currency={currency}
      />
      <StreamModal
        isOpen={streamModal.open}
        onClose={() => setStreamModal({ open: false, editing: null })}
        onSave={saveStream}
        editing={streamModal.editing}
        currency={currency}
      />
      <BankConnectModal
        isOpen={bankModal}
        onClose={() => setBankModal(false)}
        onDataConnected={handleBankData}
        currency={currency}
      />
    </>
  );
}
