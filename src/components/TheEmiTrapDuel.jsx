import React, { useState } from 'react';
import { CreditCard, PiggyBank, Flame, ShieldCheck, ArrowRight, Sparkles, TrendingUp, Sliders } from 'lucide-react';
import { formatCurrency } from '../utils/finance';

export default function TheEmiTrapDuel({ currency = 'INR' }) {
  const [timeTravelMonth, setTimeTravelMonth] = useState(6);

  const productPrice = 80000;
  const emiInterestRate = 0.16; // 16% APR typical credit card / consumer loan
  const savingsInterestRate = 0.06; // 6% annual compound interest

  // Monthly breakdown
  const emiInterestPerMonth = Math.round((productPrice * (emiInterestRate / 12)));
  const patienceInterestPerMonth = Math.round((30000 * (savingsInterestRate / 12)));

  // Time travel dynamic calculations
  const inflatedPrice = Math.round(productPrice * Math.pow(1.01, timeTravelMonth));
  const accumulatedSavings = Math.round(20000 + (timeTravelMonth * 5000 * 1.03));
  const cumulativeEmiCost = Math.round(emiInterestPerMonth * timeTravelMonth);

  return (
    <div className="glass-panel animate-slide-down" style={{
      padding: '28px',
      border: '1.5px solid rgba(244, 63, 94, 0.35)',
      background: 'radial-gradient(ellipse at 50% 50%, rgba(244, 63, 94, 0.1) 0%, rgba(10, 14, 25, 0.98) 80%)'
    }}>
      {/* Act Tag */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge badge-rose" style={{ fontSize: '0.7rem' }}>
            ACT 5: THE COST OF IMPATIENCE & THE CLOSE
          </span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>2:40 - 3:00 Final Pitch</span>
        </div>
        <span style={{ fontSize: '0.82rem', color: '#fb7185', fontWeight: 700 }}>
          Cost of Impatience Duel
        </span>
      </div>

      <h3 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '6px' }}>
        The EMI Trap vs The Truth of Patience
      </h3>
      <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: '22px' }}>
        Banks profit off impatience. Here is what buying today on EMI actually costs compared to saving with 6% interest.
      </p>

      {/* The Duel Comparison Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        marginBottom: '26px'
      }}>
        {/* Impatient Buyer (The EMI Trap) */}
        <div style={{
          background: 'rgba(244, 63, 94, 0.1)',
          border: '2px solid #f43f5e',
          borderRadius: 'var(--radius-md)',
          padding: '22px',
          boxShadow: '0 8px 30px rgba(244, 63, 94, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CreditCard size={20} color="#f43f5e" />
              <strong style={{ fontSize: '1rem', color: '#fff' }}>Impatience (Buy Today on EMI)</strong>
            </div>
            <span className="badge badge-rose" style={{ fontSize: '0.65rem' }}>16% APR TRAP</span>
          </div>

          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#fb7185', marginBottom: '4px' }}>
            Costs ₹{emiInterestPerMonth.toLocaleString()} Extra / Month
          </div>
          <p style={{ fontSize: '0.84rem', color: '#fecdd3', marginBottom: '16px' }}>
            Total financing surcharge over 12 months: <strong>₹{Math.round(emiInterestPerMonth * 12).toLocaleString()} paid to the bank</strong>.
          </p>

          <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', color: '#fca5a5' }}>
            💸 You pay for the product PLUS the banker's bonus.
          </div>
        </div>

        {/* Patient Saver (GoalCast Truth Route) */}
        <div style={{
          background: 'rgba(16, 185, 129, 0.1)',
          border: '2px solid #10b981',
          borderRadius: 'var(--radius-md)',
          padding: '22px',
          boxShadow: '0 8px 30px rgba(16, 185, 129, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PiggyBank size={20} color="#10b981" />
              <strong style={{ fontSize: '1rem', color: '#fff' }}>Patience (GoalCast 6% Plan)</strong>
            </div>
            <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>COMPOUND ASSET</span>
          </div>

          <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#34d399', marginBottom: '4px' }}>
            Pays YOU +₹{patienceInterestPerMonth.toLocaleString()} / Month
          </div>
          <p style={{ fontSize: '0.84rem', color: '#a7f3d0', marginBottom: '16px' }}>
            Total compound interest earned: <strong>+₹{Math.round(patienceInterestPerMonth * 12).toLocaleString()} free money credited to you</strong>.
          </p>

          <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', color: '#6ee7b7' }}>
            💎 Your savings grow into cash collateral with zero debt stress.
          </div>
        </div>
      </div>

      {/* Extra Shock Option: Interactive Time-Travel Slider */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.35)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '20px',
        marginBottom: '26px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={18} color="#818cf8" />
            <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>Time-Travel Horizon Slider (Month 1 to 24)</h4>
          </div>
          <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#38bdf8' }}>
            Month {timeTravelMonth} Projected
          </span>
        </div>

        <input
          type="range"
          min="1"
          max="24"
          step="1"
          value={timeTravelMonth}
          onChange={(e) => setTimeTravelMonth(Number(e.target.value))}
        />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
          marginTop: '16px',
          fontSize: '0.82rem'
        }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ color: 'var(--text-dim)' }}>Inflated Price at Mo {timeTravelMonth}:</span>
            <div style={{ fontWeight: 800, color: '#fb7185', fontSize: '1.05rem', marginTop: '2px' }}>
              ₹{inflatedPrice.toLocaleString()}
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ color: 'var(--text-dim)' }}>Accumulated Savings:</span>
            <div style={{ fontWeight: 800, color: '#34d399', fontSize: '1.05rem', marginTop: '2px' }}>
              ₹{accumulatedSavings.toLocaleString()}
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '10px 14px', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ color: 'var(--text-dim)' }}>Cumulative EMI Penalty:</span>
            <div style={{ fontWeight: 800, color: '#f43f5e', fontSize: '1.05rem', marginTop: '2px' }}>
              -₹{cumulativeEmiCost.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* The Dramatic Closing Statement */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(16, 185, 129, 0.2) 100%)',
        border: '2px solid rgba(99, 102, 241, 0.5)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px 28px',
        textAlign: 'center',
        boxShadow: '0 10px 40px rgba(99, 102, 241, 0.3)'
      }}>
        <div style={{ fontSize: '0.8rem', color: '#c7d2fe', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 800, marginBottom: '6px' }}>
          THE CLOSING STATEMENT
        </div>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.3 }}>
          "Other apps track your savings.<br /><span style={{ background: 'linear-gradient(90deg, #38bdf8, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>We tell you the truth about them."</span>
        </h2>
      </div>
    </div>
  );
}
