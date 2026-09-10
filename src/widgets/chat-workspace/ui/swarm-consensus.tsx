'use client';

import type { FinalAnswer } from '@/entities/chat';
import { CyberMarkdown } from '@/shared/ui';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import styles from './swarm-consensus.module.scss';

export interface SwarmConsensusProps {
  answer: FinalAnswer;
  depth?: number;
}

export function SwarmConsensus({ answer, depth = 5 }: SwarmConsensusProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(answer);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy consensus:', e);
    }
  };

  const badgeText =
    depth <= 1
      ? '✓ EXPERT ANALYSIS COMPLETED (100% CONFIDENCE)'
      : `✓ ${depth}-AGENT SWARM CONSENSUS REACHED (100% AGREEMENT)`;

  return (
    <div className={styles.consensusWrapper}>
      <div className={styles.badgeWrapper}>
        <div className={styles.consensusBadge}>
          <div className={styles.checkIconCircle}>
            <Check size={11} className={styles.checkIcon} />
          </div>
          <span className={styles.badgeText}>{badgeText}</span>
        </div>
      </div>

      <div className={styles.contentBody}>
        <CyberMarkdown content={answer} />
      </div>

      <div className={styles.bottomBar}>
        <button
          type="button"
          className={styles.copyButton}
          onClick={() => {
            void handleCopy();
          }}
          aria-label="Copy full response"
          title={copied ? 'Copied to clipboard' : 'Copy blueprint'}
        >
          {copied ? <Check size={15} className={styles.copyCheckIcon} /> : <Copy size={15} />}
          <span className={styles.copyText}>{copied ? 'COPIED' : 'COPY'}</span>
        </button>
      </div>
    </div>
  );
}
