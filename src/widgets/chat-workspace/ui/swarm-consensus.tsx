'use client';

import type { FinalAnswer } from '@/entities/chat';
import { CyberMarkdown } from '@/shared/ui';
import { Check } from 'lucide-react';
import styles from './swarm-consensus.module.scss';

export interface SwarmConsensusProps {
  answer: FinalAnswer;
}

export function SwarmConsensus({ answer }: SwarmConsensusProps) {
  return (
    <div className={styles.consensusWrapper}>
      <div className={styles.badgeWrapper}>
        <div className={styles.consensusBadge}>
          <div className={styles.checkIconCircle}>
            <Check size={11} className={styles.checkIcon} />
          </div>
          <span className={styles.badgeText}>✓ 5-AGENT SWARM CONSENSUS REACHED (100% AGREEMENT)</span>
        </div>
      </div>

      <div className={styles.contentBody}>
        <CyberMarkdown content={answer} />
      </div>
    </div>
  );
}
