import React, { useState, useEffect } from 'react';
import { X, Sparkles, AlertCircle, Calendar, Plus, Check } from 'lucide-react';
import { calculateGoalTimeline, formatCurrency } from '../utils/finance';

const PRESETS = [
  { title: 'Apple iPhone 16 Pro', icon: '📱', price: 120000, saved: 30000, monthlySaving: 9000, category: 'Phone', urgency: 'high', importance: 4 },
  { title: 'M3 MacBook Air 15"', icon: '💻', price: 95000, saved: 25000, monthlySaving: 7500, category: 'Laptop', urgency: 'medium', importance: 5 },
  { title: 'Royal Enfield Hunter 350', icon: '🏍️', price: 175000, saved: 35000, monthlySaving: 10000, category: 'Bike', urgency: 'medium', importance: 5 },
  { title: 'Sony PlayStation 5 Slim', icon: '🎮', price: 54990, saved: 15000, monthlySaving: 5000, category: 'Gaming', urgency: 'low', importance: 3 },
  { title: 'Goa Holiday Trip', icon: '✈️', price: 40000, saved: 10000, monthlySaving: 6000, category: 'Travel', urgency: 'high', importance: 3 }
];

export default function AddGoalModal({ isOpen, onClose, onSaveGoal, editingGoal, useInterest, currency }) {
  const [title, setTitle] = useState('');
  const [icon, setIcon] = useState('📱');
  const [price, setPrice] = useState(80000);
  const [saved, setSaved] = useState(20000);
  const [monthlySaving, setMonthlySaving] = useState(5000);
  const [category, setCategory] = useState('Phone');
  const [urgency, setUrgency] = useState('medium');
  const [importance, setImportance] = useState(4);

  useEffect(() => {
    if (editingGoal) {
      setTitle(editingGoal.title || '');
      setIcon(editingGoal.icon || '🎯');
      setPrice(editingGoal.price || 0);
      setSaved(editingGoal.saved || 0);
      setMonthlySaving(editingGoal.monthlySaving || 0);
      setCategory(editingGoal.category || 'General');
      setUrgency(editingGoal.urgency || 'medium');
      setImportance(editingGoal.importance || 3);
    } else {
      setTitle('Apple iPhone 16 Pro');
      setIcon('📱');
      setPrice(80000);
      setSaved(20000);
      setMonthlySaving(5000);
      setCategory('Phone');
      setUrgency('medium');
      setImportance(4);
    }
  }, [editingGoal, isOpen]);

  if (!isOpen) return null;

  // Live preview calculation
  const previewTimeline = calculateGoalTimeline(price, saved, monthlySaving, useInterest);

  const handleApplyPreset = (p) => {
    setTitle(p.title);
    setIcon(p.icon);
    setPrice(p.price);
    setSaved(p.saved);
    setMonthlySaving(p.monthlySaving);
    setCategory(p.category);
    setUrgency(p.urgency);
    setImportance(p.importance);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a goal title (e.g. Phone, Laptop, Bike).');
      return;
    }

    onSaveGoal({
      id: editingGoal ? editingGoal.id : `goal-${Date.now()}`,
      title: title.trim(),
      icon,
      price: Number(price) || 0,
      saved: Number(saved) || 0,
      monthlySaving: Number(monthlySaving) || 0,
      category,
      urgency,
      importance
    });

    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div 
        className="glass-panel animate-slide-down" 
        style={{ 
          maxWidth: '580px', 
          width: '100%', 
          maxHeight: '92vh', 
          overflowY: 'auto', 
          padding: '28px',
          background: '#0e1526',
          border: '1px solid rgba(99, 102, 241, 0.4)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8)'
        }}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.6rem' }}>{icon}</span>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>
              {editingGoal ? 'Edit Savings Goal' : 'Create New Savings Goal'}
            </h2>
          </div>

          <button onClick={onClose} className="btn btn-secondary btn-icon" style={{ borderRadius: '50%' }}>
            <X size={18} />
          </button>
        </div>

        {/* Quick Inspiration Presets */}
        {!editingGoal && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Quick Presets (1-Click Fill)
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {PRESETS.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.78rem' }}
                >
                  <span>{p.icon}</span>
                  <span>{p.category}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Goal Name & Icon */}
          <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr', gap: '12px', marginBottom: '16px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Icon</label>
              <select 
                className="form-select" 
                value={icon} 
                onChange={(e) => setIcon(e.target.value)}
                style={{ textAlign: 'center', fontSize: '1.2rem', padding: '9px 4px' }}
              >
                <option value="📱">📱</option>
                <option value="💻">💻</option>
                <option value="🏍️">🏍️</option>
                <option value="🚗">🚗</option>
                <option value="🎮">🎮</option>
                <option value="🎧">🎧</option>
                <option value="✈️">✈️</option>
                <option value="🏠">🏠</option>
                <option value="⌚">⌚</option>
                <option value="🎯">🎯</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">What do you want to buy?</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. iPhone 16 Pro, MacBook, Bike..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Price, Already Saved, Monthly Saving */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '18px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Product Price (₹)</label>
              <input
                type="number"
                className="form-input"
                min="0"
                step="500"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Already Saved (₹)</label>
              <input
                type="number"
                className="form-input"
                min="0"
                step="500"
                value={saved}
                onChange={(e) => setSaved(Number(e.target.value))}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Monthly Saving (₹)</label>
              <input
                type="number"
                className="form-input"
                min="0"
                step="250"
                value={monthlySaving}
                onChange={(e) => setMonthlySaving(Number(e.target.value))}
                required
              />
            </div>
          </div>

          {/* Urgency & Importance */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '18px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Urgency Priority</label>
              <select
                className="form-select"
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
              >
                <option value="high">High (Need ASAP)</option>
                <option value="medium">Medium (Standard)</option>
                <option value="low">Low (Flexible / Leisure)</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Importance (1 to 5 Stars)</label>
              <select
                className="form-select"
                value={importance}
                onChange={(e) => setImportance(Number(e.target.value))}
              >
                <option value="5">⭐⭐⭐⭐⭐ Essential</option>
                <option value="4">⭐⭐⭐⭐ High</option>
                <option value="3">⭐⭐⭐ Moderate</option>
                <option value="2">⭐⭐ Nice to have</option>
                <option value="1">⭐ Optional</option>
              </select>
            </div>
          </div>

          {/* Live Outcome Calculation Box */}
          <div style={{
            background: previewTimeline.isZeroSaving 
              ? 'rgba(244, 63, 94, 0.12)' 
              : 'linear-gradient(135deg, rgba(99, 102, 241, 0.14) 0%, rgba(16, 185, 129, 0.1) 100%)',
            border: `1.5px solid ${previewTimeline.isZeroSaving ? '#f43f5e' : '#6366f1'}`,
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            marginBottom: '22px'
          }}>
            {previewTimeline.isZeroSaving ? (
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <AlertCircle size={20} color="#f43f5e" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 800, color: '#fb7185', fontSize: '0.92rem' }}>
                    Zero Monthly Contribution
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#fecdd3', marginTop: '2px' }}>
                    At ₹0/month, this goal will take an infinite number of months to achieve! Enter a monthly contribution or deposit funds.
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                    Projected Purchase Date
                  </span>
                  <span className="badge badge-indigo" style={{ fontSize: '0.65rem' }}>
                    {useInterest ? 'WITH 6% INTEREST' : 'WITHOUT INTEREST'}
                  </span>
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginTop: '3px' }}>
                  In {previewTimeline.months} Months — <span style={{ color: '#38bdf8' }}>{previewTimeline.targetDate.fullString}</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Progress: {previewTimeline.progressPct}% | Remaining: {formatCurrency(Math.max(0, price - saved), currency)}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ fontWeight: 700 }}>
              <Check size={16} />
              <span>{editingGoal ? 'Update Goal' : 'Save Goal to GPS'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
