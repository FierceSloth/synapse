'use client';

import type { AgentDebateMessage } from '@/entities/chat';
import clsx from 'clsx';
import { useState } from 'react';
import { MOCK_DEBATE_MESSAGES } from '../model/mock-debates';
import styles from './swarm-deliberation.module.scss';

export interface SwarmDeliberationProps {
  debates?: AgentDebateMessage[];
  progress?: number;
  onInjectGuidance?: () => void;
  onFinalizeConsensus?: () => void;
}

export function SwarmDeliberation({
  debates = MOCK_DEBATE_MESSAGES,
  progress = 78,
  onInjectGuidance,
  onFinalizeConsensus,
}: SwarmDeliberationProps) {
  const [isPaused, setIsPaused] = useState(false);

  const handleTogglePause = () => {
    setIsPaused((prev) => !prev);
  };

  return (
    <div className={styles.deliberationCard}>
      <div className={styles.cornerTl} />
      <div className={styles.cornerTr} />
      <div className={styles.cornerBl} />
      <div className={styles.cornerBr} />

      <div className={styles.cardHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.headerDot} />
          <span className={styles.headerTitle}>[ LIVE SWARM DELIBERATION ]</span>
        </div>
        <div className={styles.headerMeta}>
          <span className={styles.meterText}>CONSENSUS METER: {progress}%</span>
          <span className={styles.agentsCount}>AGENTS DELIBERATING: {debates.length}/5</span>
        </div>
      </div>

      <div className={styles.cardBody}>
        {debates.map((message) => {
          const slotClass = styles[`slot${message.slotIndex}`] ?? styles.slot1;
          const slotFormatted = String(message.slotIndex).padStart(2, '0');

          return (
            <div key={`${message.agentName}-${message.time}`} className={clsx(styles.messageRow, slotClass)}>
              <div className={styles.agentBadge}>{slotFormatted}</div>

              <div className={styles.messageContent}>
                <div className={styles.agentMeta}>
                  <span className={styles.agentName}>{message.agentName}</span>
                  <span className={styles.messageTime}>{message.time}</span>
                </div>
                <div className={styles.agentBubble}>{message.text}</div>
              </div>
            </div>
          );
        })}
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
          <button
            type="button"
            className={clsx(styles.pauseBtn, isPaused && styles.paused)}
            onClick={handleTogglePause}
          >
            {isPaused ? '[ RESUME DELIBERATION ]' : '[ PAUSE DELIBERATION ]'}
          </button>
          <button type="button" className={styles.guidanceBtn} onClick={onInjectGuidance}>
            [ INJECT HUMAN GUIDANCE ]
          </button>
          {onFinalizeConsensus && (
            <button type="button" className={styles.consensusBtn} onClick={onFinalizeConsensus}>
              [ VIEW SYNTHESIZED RESULT ↵ ]
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
