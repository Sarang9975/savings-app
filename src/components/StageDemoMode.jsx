import React, { useState } from 'react';
import TheRaceAnimation from './TheRaceAnimation';
import TheZeroSavingBlackout from './TheZeroSavingBlackout';
import JudgeLiveParticipation from './JudgeLiveParticipation';
import TheDominoDrag from './TheDominoDrag';
import TheEmiTrapDuel from './TheEmiTrapDuel';

import { Play, ChevronRight, ChevronLeft, Mic, Clock, Sparkles, HelpCircle } from 'lucide-react';

const ACTS = [
  { id: 1, time: '0:00 - 1:00', title: 'The Runaway Goal', tag: 'The Hook & The Race' },
  { id: 2, time: '1:00 - 1:20', title: 'Zero-Saving Blackout', tag: 'Infinite Horizon' },
  { id: 3, time: '1:20 - 2:10', title: 'Judge Participation', tag: 'Live Simulation' },
  { id: 4, time: '2:10 - 2:40', title: 'The Domino Drag', tag: 'Opportunity Cost' },
  { id: 5, time: '2:40 - 3:00', title: 'EMI Trap & The Close', tag: 'The Truth' }
];

const PROMPTS = {
  1: {
    speaker: "Every savings app will tell you this laptop is yours in August 2027. That date is a lie.",
    action: "Click 'Watch The Goal Run Away' and let judges watch the finish line physically drift right as August 2027 cracks into red!"
  },
  2: {
    speaker: "At ₹0/month, this laptop costs ₹1,42,000 by 2030. You'll never catch it.",
    action: "Click 'Test ₹0 Blackout' to trigger the dramatic blackout mode. Then drag the slider back to ₹6,000/mo to restore the light!"
  },
  3: {
    speaker: "Judge, what do you want to buy, and what can you realistically save each month?",
    action: "Type their exact live answer. Watch 1,000 Monte Carlo projections clear like fog in 1.2s to hand them their personalized verified truth date!"
  },
  4: {
    speaker: "Watch what happens when you prioritize one dream over another. The whole timeline ripples live.",
    action: "Click 'Prioritize Bike' and point out the cascading delay (+6 months on Phone, +3 months on Laptop)!"
  },
  5: {
    speaker: "Other apps track your savings. We tell you the truth about them.",
    action: "Flash the EMI Trap comparison (₹1,854 paid to bank vs ₹463 earned in interest), then deliver the closing punchline!"
  }
};

export default function StageDemoMode({ currency, onAdoptJudgeGoal }) {
  const [activeAct, setActiveAct] = useState(1);
  const [showScript, setShowScript] = useState(true);

  return (
    <div className="animate-slide-down">
      {/* 3-Minute Stage Pitch Navigation HUD */}
      <div style={{
        background: 'rgba(10, 14, 25, 0.9)',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px 20px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)'
      }}>
        {/* Act Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '2px' }}>
          {ACTS.map((act) => {
            const isActive = activeAct === act.id;
            return (
              <button
                key={act.id}
                onClick={() => setActiveAct(act.id)}
                style={{
                  background: isActive ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'rgba(255, 255, 255, 0.04)',
                  border: `1.5px solid ${isActive ? '#6366f1' : 'var(--border-subtle)'}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '8px 14px',
                  color: isActive ? '#fff' : 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease'
                }}
              >
                <span style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: isActive ? '#fff' : 'rgba(255, 255, 255, 0.1)',
                  color: isActive ? '#6366f1' : '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px'
                }}>
                  {act.id}
                </span>
                <span>{act.title}</span>
                <span style={{ fontSize: '0.7rem', color: isActive ? '#c7d2fe' : 'var(--text-dim)' }}>
                  ({act.time})
                </span>
              </button>
            );
          })}
        </div>

        {/* Prev / Next Stage Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setShowScript(!showScript)}
            className="btn btn-secondary btn-sm"
            style={{ fontSize: '0.78rem' }}
          >
            <Mic size={14} color="#818cf8" />
            <span>{showScript ? 'Hide Script Cues' : 'Show Script Cues'}</span>
          </button>

          <button
            onClick={() => setActiveAct(prev => Math.max(1, prev - 1))}
            disabled={activeAct === 1}
            className="btn btn-secondary btn-sm"
            style={{ opacity: activeAct === 1 ? 0.3 : 1 }}
          >
            <ChevronLeft size={16} />
          </button>

          <button
            onClick={() => setActiveAct(prev => Math.min(5, prev + 1))}
            disabled={activeAct === 5}
            className="btn btn-primary btn-sm"
            style={{ opacity: activeAct === 5 ? 0.3 : 1 }}
          >
            <span>Next Act</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Presenter Teleprompter Cues (The Script Guidance) */}
      {showScript && (
        <div style={{
          background: 'rgba(99, 102, 241, 0.1)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          borderRadius: 'var(--radius-md)',
          padding: '14px 18px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          fontSize: '0.85rem'
        }}>
          <Mic size={20} color="#818cf8" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ color: '#e0e7ff', fontWeight: 800, marginBottom: '2px' }}>
              🎤 Stage Cue (Act {activeAct}): "{PROMPTS[activeAct].speaker}"
            </div>
            <div style={{ color: '#c7d2fe', fontSize: '0.8rem' }}>
              👉 Stage Action: {PROMPTS[activeAct].action}
            </div>
          </div>
        </div>
      )}

      {/* Active Act Component Presentation */}
      <div>
        {activeAct === 1 && <TheRaceAnimation currency={currency} />}
        {activeAct === 2 && <TheZeroSavingBlackout currency={currency} />}
        {activeAct === 3 && <JudgeLiveParticipation currency={currency} onAdoptJudgeGoal={onAdoptJudgeGoal} />}
        {activeAct === 4 && <TheDominoDrag currency={currency} />}
        {activeAct === 5 && <TheEmiTrapDuel currency={currency} />}
      </div>
    </div>
  );
}
