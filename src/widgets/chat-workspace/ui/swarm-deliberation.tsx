'use client';

import type { AgentDebateMessage } from '@/entities/chat';
import clsx from 'clsx';
import { useState } from 'react';
import styles from './swarm-deliberation.module.scss';

export interface SwarmDeliberationProps {
  debates?: AgentDebateMessage[];
  progress?: number;
  activeSpeaker?: { slotIndex: number; agentName: string; stageName?: string } | null;
  depth?: number;
  isPaused?: boolean;
  isSynthesizing?: boolean;
  onTogglePause?: () => void;
  onInjectGuidance?: (text: string) => void;
  onFinalizeConsensus?: () => void;
}

const PRESET_GUIDANCES = [
  'Prioritize ultra-low latency & 0ms blocking',
  'Enforce zero external dependencies',
  'Strict security & sandbox isolation priority',
  'Simplify implementation for pragmatic MVP',
];

export function SwarmDeliberation({
  debates = [],
  progress = 0,
  activeSpeaker,
  depth = 5,
  isPaused = false,
  isSynthesizing = false,
  onTogglePause,
  onInjectGuidance,
  onFinalizeConsensus,
}: SwarmDeliberationProps) {
  const [isGuidanceOpen, setIsGuidanceOpen] = useState(false);
  const [guidanceInput, setGuidanceInput] = useState('');

  const handleOpenGuidance = () => {
    setIsGuidanceOpen(true);
    if (!isPaused && onTogglePause) {
      onTogglePause();
    }
  };

  const handleCloseGuidance = () => {
    setIsGuidanceOpen(false);
    setGuidanceInput('');
  };

  const handleSubmitGuidance = () => {
    if (!guidanceInput.trim()) return;
    onInjectGuidance?.(guidanceInput.trim());
    setIsGuidanceOpen(false);
    setGuidanceInput('');
  };

  const nonHumanCount = debates.filter((d) => !d.isHuman).length;
  const targetTotalSlots = Math.min(5, Math.max(1, depth ?? 5));

  return (
    <div className={styles.deliberationCard}>
      <div className={styles.cornerTl} />
      <div className={styles.cornerTr} />
      <div className={styles.cornerBl} />
      <div className={styles.cornerBr} />

      <div className={styles.cardHeader}>
        <div className={styles.headerLeft}>
          <div className={clsx(styles.headerDot, isPaused && styles.headerDotPaused)} />
          <span className={styles.headerTitle}>
            {isPaused ? '[ SWARM DELIBERATION // PAUSED ]' : '[ LIVE SWARM DELIBERATION ]'}
          </span>
        </div>
        <div className={styles.headerMeta}>
          <span className={styles.meterText}>CONSENSUS METER: {progress}%</span>
          <span className={styles.agentsCount}>
            AGENTS DELIBERATING: {Math.min(targetTotalSlots, nonHumanCount)}/{targetTotalSlots}
          </span>
        </div>
      </div>

      <div className={styles.cardBody}>
        {debates.length === 0 && !activeSpeaker && (
          <div className={styles.emptyState}>
            <span className={styles.emptyStatePulse} />
            <span>INITIALIZING {targetTotalSlots}-STAGE SWARM DELIBERATION... AWAITING FIRST TRANSMISSION</span>
          </div>
        )}

        {debates.map((message, index) => {
          if (message.isHuman) {
            return (
              <div key={`human-${message.time}-${index}`} className={clsx(styles.messageRow, styles.humanRow)}>
                <div className={styles.humanBadge}>OP</div>

                <div className={styles.messageContent}>
                  <div className={styles.agentMeta}>
                    <span className={styles.humanName}>HUMAN OPERATOR</span>
                    <span className={styles.humanTag}>[OPERATOR OVERRIDE INJECTED]</span>
                    <span className={styles.messageTime}>{message.time}</span>
                  </div>
                  <div className={styles.humanBubble}>{message.text}</div>
                </div>
              </div>
            );
          }

          const slotClass = styles[`slot${message.slotIndex}`] ?? styles.slot1;
          const slotFormatted = String(message.slotIndex).padStart(2, '0');

          return (
            <div key={`${message.agentName}-${message.time}-${index}`} className={clsx(styles.messageRow, slotClass)}>
              <div className={styles.agentBadge}>{slotFormatted}</div>

              <div className={styles.messageContent}>
                <div className={styles.agentMeta}>
                  <span className={styles.agentName}>{message.agentName}</span>
                  {message.stageName && <span className={styles.stageTag}>[{message.stageName.toUpperCase()}]</span>}
                  <span className={styles.messageTime}>{message.time}</span>
                </div>
                <div className={styles.agentBubble}>{message.text}</div>
              </div>
            </div>
          );
        })}

        {activeSpeaker && (
          <div
            className={clsx(
              styles.messageRow,
              styles[`slot${activeSpeaker.slotIndex}`] ?? styles.slot1,
              styles.transmittingRow
            )}
          >
            <div className={clsx(styles.agentBadge, styles.transmittingBadge)}>
              {String(activeSpeaker.slotIndex).padStart(2, '0')}
            </div>

            <div className={styles.messageContent}>
              <div className={styles.agentMeta}>
                <span className={styles.agentName}>{activeSpeaker.agentName}</span>
                <span className={styles.transmittingLabel}>
                  {activeSpeaker.stageName
                    ? `[${activeSpeaker.stageName.toUpperCase()} // DELIBERATING...]`
                    : '[FORMULATING ANALYSIS...]'}
                </span>
              </div>
              <div className={clsx(styles.agentBubble, styles.transmittingBubble)}>
                <span className={styles.typingDot} />
                <span className={styles.typingDot} />
                <span className={styles.typingDot} />
                <span className={styles.cursorBlink}>▋</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={styles.cardFooter}>
        <div className={styles.progressRow}>
          <span className={styles.progressLabel}>CONSENSUS PROGRESS</span>
          <div className={styles.progressTrack} role="progressbar" aria-valuenow={progress}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
          <span className={styles.progressPercent}>{progress}%</span>
        </div>

        <div className={styles.actionsRow}>
          <button type="button" className={clsx(styles.pauseBtn, isPaused && styles.paused)} onClick={onTogglePause}>
            {isPaused ? '[ RESUME DELIBERATION ]' : '[ PAUSE DELIBERATION ]'}
          </button>

          <button type="button" className={styles.guidanceBtn} onClick={handleOpenGuidance}>
            [ INJECT HUMAN GUIDANCE ]
          </button>

          {onFinalizeConsensus && (
            <button
              type="button"
              className={clsx(
                styles.consensusBtn,
                (isSynthesizing || nonHumanCount >= targetTotalSlots) && styles.synthesizing
              )}
              disabled={isSynthesizing || nonHumanCount >= targetTotalSlots}
              onClick={onFinalizeConsensus}
            >
              {isSynthesizing || nonHumanCount >= targetTotalSlots
                ? '[ SYNTHESIZING CONSENSUS... ]'
                : '[ FORCE EARLY CONSENSUS ↵ ]'}
            </button>
          )}
        </div>
      </div>

      {isGuidanceOpen && (
        <div className={styles.guidanceOverlay}>
          <div className={styles.guidanceModal}>
            <div className={styles.modalCornerTl} />
            <div className={styles.modalCornerTr} />
            <div className={styles.modalCornerBl} />
            <div className={styles.modalCornerBr} />

            <div className={styles.guidanceHeader}>
              <div className={styles.guidanceTitle}>
                <span className={styles.guidancePulseDot} />
                <span>[ OPERATOR OVERRIDE // HUMAN-IN-THE-LOOP TERMINAL ]</span>
              </div>
              <span className={styles.guidanceStatus}>SWARM PAUSED // AWAITING DIRECTIVE</span>
            </div>

            <div className={styles.guidanceBody}>
              <div className={styles.presetGroup}>
                <span className={styles.presetLabel}>QUICK CONSTRAINT INJECTION:</span>
                <div className={styles.presetChips}>
                  {PRESET_GUIDANCES.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      className={styles.presetChip}
                      onClick={() => setGuidanceInput(preset)}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                className={styles.guidanceTextarea}
                rows={3}
                placeholder="Inject direct technical constraint, challenge an agent, or redirect swarm focus..."
                value={guidanceInput}
                onChange={(e) => setGuidanceInput(e.target.value)}
                autoFocus
              />
            </div>

            <div className={styles.guidanceFooter}>
              <button type="button" className={styles.guidanceCancelBtn} onClick={handleCloseGuidance}>
                [ DISMISS OVERRIDE ]
              </button>
              <button
                type="button"
                className={styles.guidanceSubmitBtn}
                disabled={!guidanceInput.trim()}
                onClick={handleSubmitGuidance}
              >
                [ TRANSMIT DIRECTIVE TO SWARM ↵ ]
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
