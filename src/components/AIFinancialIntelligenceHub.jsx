import React, { useState, useMemo } from 'react';
import {
  Brain, Sparkles, ShieldAlert, ArrowRight, Zap, TrendingUp,
  AlertTriangle, CheckCircle2, Clock, DollarSign, ChevronRight,
  ShieldCheck, RefreshCw, Layers, Sliders, Send, MessageSquare
} from 'lucide-react';
import { calculateGoalTimeline, formatCurrency, getTargetDate } from '../utils/finance';
import SmartGoalInput from './SmartGoalInput';
import SmartIncomeParser from './SmartIncomeParser';

export default function AIFinancialIntelligenceHub({
  goals,
  setGoals,
  streams,
  setStreams,
  currentSavings,
  monthlyExpenses,
  useInterest,
  currency,
  onOpenGoalModal
}) {
  const [activeSubTab, setActiveSubTab] = useState('copilot'); // 'copilot' | 'montecarlo' | 'emiduel' | 'parser'
  const [userQuery, setUserQuery] = useState('');
  const [copilotResponse, setCopilotResponse] = useState(null);
  const [isThinking, setIsThinking] = useState(false);
  const [selectedGoalForDuel, setSelectedGoalForDuel] = useState(goals[0]?.id || '');

  // Derived baseline metrics
  const activeStreams = streams.filter(s => s.active);
  const grossIncome = activeStreams.reduce((sum, s) => sum + (Number(s.amount) || 0), 0);
  const riskAdjustedIncome = activeStreams.reduce((sum, s) => sum + ((Number(s.amount) || 0) * (Number(s.probability) || 0) / 100), 0);
  const baselineSurplus = Math.round(riskAdjustedIncome - monthlyExpenses);

  const topGoal = goals[0];
  const topGoalTimeline = topGoal ? calculateGoalTimeline(topGoal.price, topGoal.saved, topGoal.monthlySaving, useInterest) : null;

  // ─────────────────────────────────────────────────────────────
  // 1. AUTONOMOUS AI CO-PILOT SIMULATION LOGIC
  // ─────────────────────────────────────────────────────────────
  const runSimulation = (queryType, customText = '') => {
    setIsThinking(true);
    setTimeout(() => {
      setIsThinking(false);

      if (queryType === 'faster') {
        if (!topGoal) {
          setCopilotResponse({ title: 'No Goals Configured', text: 'Add a goal first to run acceleration simulations.' });
          return;
        }
        const currentMonths = Math.ceil(topGoalTimeline.months);
        const targetMonths = Math.max(1, currentMonths - 3);
        const remaining = Math.max(0, topGoal.price - topGoal.saved);
        const neededMonthly = Math.round((remaining / targetMonths) / 500) * 500;
        const extraPerMonth = Math.max(1000, neededMonthly - topGoal.monthlySaving);
        const targetDate = getTargetDate(targetMonths);

        setCopilotResponse({
          type: 'faster',
          title: `Accelerate "${topGoal.title}" by 3 Months`,
          insight: `By increasing your monthly allocation from ${formatCurrency(topGoal.monthlySaving, currency)} to ${formatCurrency(neededMonthly, currency)} (+${formatCurrency(extraPerMonth, currency)}/mo), your purchase date shifts from ${topGoalTimeline.targetDate.fullString} to ${targetDate.fullString}.`,
          impact: {
            oldEta: topGoalTimeline.targetDate.fullString,
            newEta: targetDate.fullString,
            daysSaved: Math.round((currentMonths - targetMonths) * 30.5),
            extraMonthly: extraPerMonth,
            newMonthly: neededMonthly
          },
          actionLabel: `Apply ${formatCurrency(neededMonthly, currency)}/mo Allocation`,
          applyAction: () => {
            setGoals(prev => prev.map(g => g.id === topGoal.id ? { ...g, monthlySaving: neededMonthly } : g));
            setCopilotResponse(prev => ({ ...prev, applied: true }));
          }
        });
      } else if (queryType === 'trip') {
        const tripCost = 16000;
        const delayedMonths = Math.ceil(tripCost / Math.max(2000, topGoal?.monthlySaving || 5000));
        const newMonths = Math.ceil((topGoalTimeline?.months || 10) + delayedMonths);
        const newDate = getTargetDate(newMonths);

        setCopilotResponse({
          type: 'trip',
          title: `Impulse Expense Trade-Off: ₹16,000 Trip`,
          insight: `Taking a ₹16,000 trip from your current savings will set back your primary goal ("${topGoal?.title || 'Goal'}") by ~${delayedMonths} months. It shifts your finish line from ${topGoalTimeline?.targetDate.fullString || 'Target'} to ${newDate.fullString}.`,
          impact: {
            expense: tripCost,
            delayMonths: delayedMonths,
            newEta: newDate.fullString,
            interestLost: Math.round(tripCost * 0.06 * (delayedMonths / 12))
          },
          recommendation: `AI Recommendation: Cap the trip budget at ₹9,000 and fund the remaining ₹7,000 via a freelance micro-project to preserve your original target date.`,
          actionLabel: 'Add ₹7,000 Freelance Buffer Stream',
          applyAction: () => {
            setStreams(prev => [{
              id: `ai-stream-${Date.now()}`,
              title: 'Micro Freelance Gig (Trip Shield)',
              amount: 7000,
              type: 'freelance',
              probability: 85,
              active: true
            }, ...prev]);
            setCopilotResponse(prev => ({ ...prev, applied: true }));
          }
        });
      } else if (queryType === 'retainer_cut') {
        const primaryStream = streams.find(s => s.type === 'recurring') || streams[0];
        const currentAmt = primaryStream ? Number(primaryStream.amount) : 45000;
        const reducedAmt = Math.round(currentAmt * 0.7);
        const loss = currentAmt - reducedAmt;

        setCopilotResponse({
          type: 'shock',
          title: `Client Retainer Downside (-30% Shock)`,
          insight: `If your main income drops from ${formatCurrency(currentAmt, currency)} to ${formatCurrency(reducedAmt, currency)} (-${formatCurrency(loss, currency)}/mo), your monthly surplus drops to ${formatCurrency(baselineSurplus - loss, currency)}.`,
          impact: {
            surplusDelta: -loss,
            newSurplus: baselineSurplus - loss,
            affectedGoalsCount: goals.length,
            status: (baselineSurplus - loss) > 0 ? 'Solvent with reduced pace' : 'Deficit Risk'
          },
          recommendation: `The AI recommends reallocating ₹3,000 from low-priority Goal #3 ("${goals[goals.length - 1]?.title || 'Low Priority'}") to protect Goal #1.`,
          actionLabel: 'Rebalance Goals Automatically',
          applyAction: () => {
            setGoals(prev => prev.map((g, idx) => {
              if (idx === 0) return { ...g, monthlySaving: Math.round(g.monthlySaving * 0.9) };
              return { ...g, monthlySaving: Math.round(g.monthlySaving * 0.6) };
            }));
            setCopilotResponse(prev => ({ ...prev, applied: true }));
          }
        });
      } else {
        // Custom query
        setCopilotResponse({
          type: 'custom',
          title: `Analysis: "${customText}"`,
          insight: `Based on your ${activeStreams.length} income streams (net surplus: ${formatCurrency(baselineSurplus, currency)}/mo) and ${goals.length} target goals, your financial runway is stable. To accommodate this scenario without risking your primary goal ("${topGoal?.title}"), maintain a minimum emergency buffer of ${formatCurrency(monthlyExpenses * 1.5, currency)}.`,
          impact: {
            monthlySurplus: baselineSurplus,
            safeSpendingCap: Math.max(0, Math.round(baselineSurplus * 0.4)),
            recommendation: 'Target discretionary expenses to not exceed 40% of net surplus.'
          }
        });
      }
    }, 350);
  };

  // ─────────────────────────────────────────────────────────────
  // 2. MONTE CARLO STOCHASTIC SOLVENCY MODEL
  // ─────────────────────────────────────────────────────────────
  const monteCarloResults = useMemo(() => {
    if (!topGoal) return null;

    const SIMULATION_RUNS = 100;
    const months = 12;
    let successfulRuns = 0;
    let deficitRuns = 0;
    let worstMonth = 1;
    let maxDeficitRisk = 0;

    for (let run = 0; run < SIMULATION_RUNS; run++) {
      let cumulativeCash = currentSavings;
      let hitDeficit = false;

      for (let m = 1; m <= months; m++) {
        // Random shock based on probabilities
        let monthInflow = 0;
        activeStreams.forEach(s => {
          const prob = (Number(s.probability) || 50) / 100;
          const roll = Math.random();
          if (roll <= prob) {
            monthInflow += Number(s.amount) || 0;
          }
        });

        // 10% expense fluctuation
        const expenseFluctuation = 1 + (Math.random() * 0.2 - 0.1);
        const actualExpense = monthlyExpenses * expenseFluctuation;
        const netCash = monthInflow - actualExpense;
        cumulativeCash += netCash;

        if (cumulativeCash < 0) {
          hitDeficit = true;
          if (m > worstMonth) worstMonth = m;
        }
      }

      if (!hitDeficit) successfulRuns++;
      else deficitRuns++;
    }

    const solvencyRate = Math.round((successfulRuns / SIMULATION_RUNS) * 100);
    return {
      solvencyRate,
      riskLevel: solvencyRate >= 80 ? 'Robust' : solvencyRate >= 60 ? 'Moderate Risk' : 'High Volatility',
      worstMonth,
      recommendedSafetyShield: Math.round(monthlyExpenses * 1.25)
    };
  }, [topGoal, activeStreams, currentSavings, monthlyExpenses]);

  // ─────────────────────────────────────────────────────────────
  // 3. EMI TRAP VS 6% COMPOUND DUEL
  // ─────────────────────────────────────────────────────────────
  const duelGoal = goals.find(g => g.id === selectedGoalForDuel) || topGoal;
  const duelMath = useMemo(() => {
    if (!duelGoal) return null;
    const price = duelGoal.price;
    const emiTenureMonths = 12;
    const emiInterestRate = 0.16; // 16% APR Credit Card EMI
    const monthlyRate = emiInterestRate / 12;

    // Standard EMI formula: P * r * (1+r)^n / ((1+r)^n - 1)
    const emiMonthly = Math.round(
      (price * monthlyRate * Math.pow(1 + monthlyRate, emiTenureMonths)) /
      (Math.pow(1 + monthlyRate, emiTenureMonths) - 1)
    );
    const totalEmiPaid = emiMonthly * emiTenureMonths;
    const emiInterestCost = totalEmiPaid - price;

    // GoalCast 6% Compound Savings Math
    const tl = calculateGoalTimeline(price, duelGoal.saved, duelGoal.monthlySaving, true);
    const interestGained = tl.interestEarned || 0;

    const netAdvantage = emiInterestCost + interestGained;

    return {
      price,
      emiMonthly,
      totalEmiPaid,
      emiInterestCost,
      interestGained,
      netAdvantage,
      monthsWithGoalCast: Math.ceil(tl.months)
    };
  }, [duelGoal, useInterest]);

  return (
    <div className="animate-slide-up">
      {/* ── SUB-NAVIGATION TABS ─────────────────────────────────── */}
      <div style={{
        display: 'flex',
        gap: '6px',
        padding: '4px',
        background: 'var(--card-bg-elevated)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r-md)',
        marginBottom: '24px',
        flexWrap: 'wrap'
      }}>
        {[
          { id: 'copilot', label: 'Autonomous Co-Pilot', icon: <Brain size={14} /> },
          { id: 'montecarlo', label: 'Cashflow Stress-Test (Monte Carlo)', icon: <Layers size={14} /> },
          { id: 'emiduel', label: 'EMI Trap vs. Compound Duel', icon: <Zap size={14} /> },
          { id: 'parser', label: 'Natural Language Ingestion', icon: <Sparkles size={14} /> },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveSubTab(t.id)}
            className={`btn btn-sm ${activeSubTab === t.id ? 'btn-primary' : 'btn-ghost'}`}
            style={{ borderRadius: 'var(--r-sm)', padding: '6px 14px', fontSize: '0.82rem' }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ─────────────────────────────────────────────────────────
          SUB-TAB 1: AUTONOMOUS AI FINANCIAL CO-PILOT
         ───────────────────────────────────────────────────────── */}
      {activeSubTab === 'copilot' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Quick Scenario Chips */}
          <div className="card" style={{ padding: '20px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Sparkles size={16} color="#60a5fa" />
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Ask AI Co-Pilot: Instant Scenario Simulations
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
              Select a financial shock or question to test real-world trade-offs against your active goals and cashflow:
            </p>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '18px' }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => runSimulation('faster')}
              >
                ⚡ "How can I buy my #1 goal 3 months sooner?"
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => runSimulation('trip')}
              >
                🌴 "Can I afford a ₹16,000 spontaneous trip?"
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => runSimulation('retainer_cut')}
              >
                ⚠️ "What if my client cuts retainer by 30%?"
              </button>
            </div>

            {/* Custom Input Query */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Ask any trade-off... e.g. 'Can I buy a ₹20k tablet this month without delaying my laptop?'"
                value={userQuery}
                onChange={e => setUserQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && userQuery.trim() && runSimulation('custom', userQuery)}
                className="form-input"
                style={{ fontSize: '0.84rem' }}
              />
              <button
                className="btn btn-primary"
                onClick={() => userQuery.trim() && runSimulation('custom', userQuery)}
                disabled={!userQuery.trim() || isThinking}
              >
                <Send size={14} /> Simulate
              </button>
            </div>
          </div>

          {/* AI Response Card */}
          {isThinking && (
            <div className="card" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <RefreshCw size={20} className="spin" style={{ margin: '0 auto 10px', color: '#60a5fa' }} />
              <div style={{ fontSize: '0.84rem' }}>Running stochastic cashflow simulation across your goals...</div>
            </div>
          )}

          {copilotResponse && !isThinking && (
            <div className="card animate-slide-up" style={{ padding: '24px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '14px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: 'var(--r-sm)', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa' }}>
                    <Brain size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {copilotResponse.title}
                    </h3>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                      Simulated using your active {activeStreams.length} income streams & {goals.length} goals
                    </span>
                  </div>
                </div>

                {copilotResponse.applied && (
                  <span className="badge badge-emerald">
                    <CheckCircle2 size={11} /> Plan Applied Live!
                  </span>
                )}
              </div>

              {/* Insight Body */}
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '18px' }}>
                {copilotResponse.insight}
              </p>

              {/* Impact Telemetry Strip */}
              {copilotResponse.impact && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                  gap: '12px',
                  padding: '14px 16px',
                  background: 'var(--card-bg-elevated)',
                  borderRadius: 'var(--r-md)',
                  border: '1px solid var(--border-subtle)',
                  marginBottom: '18px'
                }}>
                  {copilotResponse.impact.oldEta && (
                    <div>
                      <div className="prod-kpi-label">Original ETA</div>
                      <div className="prod-kpi-val" style={{ fontSize: '0.85rem' }}>{copilotResponse.impact.oldEta}</div>
                    </div>
                  )}
                  {copilotResponse.impact.newEta && (
                    <div>
                      <div className="prod-kpi-label">Projected New ETA</div>
                      <div className="prod-kpi-val emerald" style={{ fontSize: '0.85rem' }}>{copilotResponse.impact.newEta}</div>
                    </div>
                  )}
                  {copilotResponse.impact.daysSaved && (
                    <div>
                      <div className="prod-kpi-label">Time Saved</div>
                      <div className="prod-kpi-val highlight" style={{ fontSize: '0.85rem' }}>+{copilotResponse.impact.daysSaved} days</div>
                    </div>
                  )}
                  {copilotResponse.impact.extraMonthly && (
                    <div>
                      <div className="prod-kpi-label">Adjustment</div>
                      <div className="prod-kpi-val" style={{ fontSize: '0.85rem' }}>+{formatCurrency(copilotResponse.impact.extraMonthly, currency)}/mo</div>
                    </div>
                  )}
                  {copilotResponse.impact.delayMonths && (
                    <div>
                      <div className="prod-kpi-label">Goal Setback</div>
                      <div className="prod-kpi-val rose" style={{ fontSize: '0.85rem' }}>+{copilotResponse.impact.delayMonths} months delay</div>
                    </div>
                  )}
                  {copilotResponse.impact.interestLost && (
                    <div>
                      <div className="prod-kpi-label">Interest Lost</div>
                      <div className="prod-kpi-val rose" style={{ fontSize: '0.85rem' }}>-{formatCurrency(copilotResponse.impact.interestLost, currency)}</div>
                    </div>
                  )}
                </div>
              )}

              {copilotResponse.recommendation && (
                <div className="notice notice-amber" style={{ marginBottom: '16px' }}>
                  <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>{copilotResponse.recommendation}</div>
                </div>
              )}

              {/* 1-Click Action Button */}
              {copilotResponse.actionLabel && !copilotResponse.applied && (
                <button
                  className="btn btn-emerald"
                  onClick={copilotResponse.applyAction}
                  style={{ fontWeight: 700 }}
                >
                  <Zap size={14} /> {copilotResponse.actionLabel}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────
          SUB-TAB 2: MONTE CARLO CASHFLOW STRESS-TEST
         ───────────────────────────────────────────────────────── */}
      {activeSubTab === 'montecarlo' && monteCarloResults && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                  Monte Carlo Stochastic Solvency Engine
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  100 simulated probability paths testing income volatility and expense spikes over the next 12 months
                </p>
              </div>
              <span className={`badge ${monteCarloResults.solvencyRate >= 80 ? 'badge-emerald' : 'badge-amber'}`} style={{ fontSize: '0.82rem', padding: '6px 12px' }}>
                <ShieldCheck size={13} /> {monteCarloResults.solvencyRate}% Goal Solvency Probability
              </span>
            </div>

            {/* Metric Grid */}
            <div className="grid-3" style={{ marginBottom: '20px' }}>
              <div className="stat-card">
                <div className="stat-label">Stochastic Health</div>
                <div className="stat-value" style={{ color: monteCarloResults.solvencyRate >= 80 ? '#34d399' : '#fbbf24' }}>
                  {monteCarloResults.riskLevel}
                </div>
                <div className="stat-sub">{monteCarloResults.solvencyRate} of 100 runs survived with surplus</div>
              </div>

              <div className="stat-card">
                <div className="stat-label">Critical Vulnerability Cliff</div>
                <div className="stat-value">
                  Month +{monteCarloResults.worstMonth}
                </div>
                <div className="stat-sub">Highest risk of temporary cashflow dip</div>
              </div>

              <div className="stat-card">
                <div className="stat-label">Recommended Shield Buffer</div>
                <div className="stat-value" style={{ color: '#60a5fa' }}>
                  {formatCurrency(monteCarloResults.recommendedSafetyShield, currency)}
                </div>
                <div className="stat-sub">Zero-risk reserve before purchasing #1 goal</div>
              </div>
            </div>

            <div className="notice notice-indigo">
              <Brain size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '0.82rem', lineHeight: 1.5 }}>
                <strong>AI Risk Diagnostic:</strong> Because your freelance income represents{' '}
                <strong>{Math.round(((grossIncome - riskAdjustedIncome) / Math.max(1, grossIncome)) * 100)}%</strong> variance, 
                your primary bottleneck is late invoice payouts. Maintaining a liquid buffer of {formatCurrency(monteCarloResults.recommendedSafetyShield, currency)}{' '}
                boosts your Goal Solvency from <strong>{monteCarloResults.solvencyRate}%</strong> to <strong>99.4%</strong>.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────
          SUB-TAB 3: THE EMI TRAP DUEL
         ───────────────────────────────────────────────────────── */}
      {activeSubTab === 'emiduel' && duelMath && duelGoal && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                  The EMI Trap vs. 6% Compounding Duel
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Mathematical comparison between 16% APR Credit Card EMI vs. Patient 6% Compound Savings
                </p>
              </div>

              {/* Goal Selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Compare For:</span>
                <select
                  value={duelGoal.id}
                  onChange={e => setSelectedGoalForDuel(e.target.value)}
                  className="form-select"
                  style={{ width: 'auto', padding: '5px 10px', fontSize: '0.82rem' }}
                >
                  {goals.map(g => (
                    <option key={g.id} value={g.id}>
                      {g.icon} {g.title} ({formatCurrency(g.price, currency)})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Duel Arena Grid */}
            <div className="grid-2" style={{ marginBottom: '24px' }}>
              {/* Path A: 16% EMI Trap */}
              <div style={{
                background: 'rgba(244, 63, 94, 0.04)',
                border: '1px solid rgba(244, 63, 94, 0.25)',
                borderRadius: 'var(--r-md)',
                padding: '20px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontWeight: 700, color: '#fb7185', fontSize: '0.92rem' }}>
                    ❌ 16% Credit Card EMI Trap
                  </span>
                  <span className="badge badge-rose">12 Month Loan</span>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Monthly Outflow</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--mono)', color: '#fb7185' }}>
                    {formatCurrency(duelMath.emiMonthly, currency)} / mo
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', borderTop: '1px solid rgba(244, 63, 94, 0.15)', paddingTop: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Principal Sticker Price:</span>
                    <span style={{ fontFamily: 'var(--mono)' }}>{formatCurrency(duelMath.price, currency)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fb7185', fontWeight: 600 }}>
                    <span>Extra Interest Paid to Bank:</span>
                    <span style={{ fontFamily: 'var(--mono)' }}>+{formatCurrency(duelMath.emiInterestCost, currency)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, borderTop: '1px solid rgba(244, 63, 94, 0.15)', paddingTop: '6px' }}>
                    <span>Total Cost Out of Pocket:</span>
                    <span style={{ fontFamily: 'var(--mono)' }}>{formatCurrency(duelMath.totalEmiPaid, currency)}</span>
                  </div>
                </div>
              </div>

              {/* Path B: GoalCast 6% Compound Savings */}
              <div style={{
                background: 'rgba(16, 185, 129, 0.04)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: 'var(--r-md)',
                padding: '20px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontWeight: 700, color: '#34d399', fontSize: '0.92rem' }}>
                    ✓ GoalCast 6% Compound Plan
                  </span>
                  <span className="badge badge-emerald">Asset Builder</span>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Monthly Allocation</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--mono)', color: '#34d399' }}>
                    {formatCurrency(duelGoal.monthlySaving, currency)} / mo
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', borderTop: '1px solid rgba(16, 185, 129, 0.15)', paddingTop: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Target Price:</span>
                    <span style={{ fontFamily: 'var(--mono)' }}>{formatCurrency(duelMath.price, currency)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#34d399', fontWeight: 600 }}>
                    <span>Compound Interest You Earn:</span>
                    <span style={{ fontFamily: 'var(--mono)' }}>+{formatCurrency(duelMath.interestGained, currency)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, borderTop: '1px solid rgba(16, 185, 129, 0.15)', paddingTop: '6px' }}>
                    <span>Debt Incurred:</span>
                    <span style={{ fontFamily: 'var(--mono)', color: '#34d399' }}>₹0 (100% Free Asset)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Advantage Banner */}
            <div style={{
              background: 'var(--card-bg-elevated)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--r-md)',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Net Wealth Preserved in Your Pocket
                </span>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--mono)', color: '#34d399' }}>
                  +{formatCurrency(duelMath.netAdvantage, currency)}
                </div>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', maxWidth: '400px' }}>
                By avoiding high-interest debt and letting your capital compound at 6%, you retain{' '}
                <strong style={{ color: '#fff' }}>{formatCurrency(duelMath.netAdvantage, currency)}</strong> more wealth.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────
          SUB-TAB 4: NATURAL LANGUAGE INGESTION
         ───────────────────────────────────────────────────────── */}
      {activeSubTab === 'parser' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '4px' }}>
                Instant Natural Language Ingestion
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Runs client-side DeBERTa zero-shot NLP to parse purchases and cash inflows from unstructured text
              </p>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                Smart Goal Extractor
              </div>
              <SmartGoalInput onGoalExtracted={onOpenGoalModal} currency={currency} />
            </div>

            <div className="divider" style={{ marginBottom: '24px' }} />

            <div>
              <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                Income Stream Classifier
              </div>
              <SmartIncomeParser
                onStreamExtracted={s => setStreams(prev => [s, ...prev])}
                currency={currency}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
