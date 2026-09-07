'use client';

import { useMemo, useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import clsx from 'clsx';
import { countTokens } from 'gpt-tokenizer';
import { Paperclip as PaperclipIcon } from 'lucide-react';
import { Button } from '@/shared/ui';
import styles from './swarm-input.module.scss';

export interface SwarmInputProps {
  initialPrompt?: string;
  onEngage?: (prompt: string, options: { depth: number }) => void;
}

export function SwarmInput({ initialPrompt = '', onEngage }: SwarmInputProps) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [depth, setDepth] = useState(3);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const charsCount = prompt.length;
  const tokensCount = useMemo(() => {
    if (!prompt.trim()) return 0;
    try {
      return countTokens(prompt);
    } catch {
      return Math.ceil(prompt.length / 4);
    }
  }, [prompt]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      e.target.value = '';
    }
  };

  const handleEngageClick = () => {
    if (!prompt.trim()) return;
    onEngage?.(prompt, { depth });
  };

  return (
    <div className={styles.terminalWrapper}>
      <div className={styles.cornerTl} />
      <div className={styles.cornerTr} />
      <div className={styles.cornerBl} />
      <div className={styles.cornerBr} />

      <div className={styles.terminalHeader}>
        <div className={styles.terminalTitle}>
          <span className={styles.statusDot} />
          <span>Swarm Input Terminal</span>
        </div>
        <div className={styles.encryptionBadge}>ENCRYPTION: ACTIVE</div>
      </div>

      <div className={styles.terminalBody}>
        <textarea
          className={styles.textarea}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="ENTER DIRECTIVE FOR MULTI-AGENT SWARM DELIBERATION..."
          rows={4}
        />
      </div>

      <div className={styles.terminalFooter}>
        <div className={styles.leftControls}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
            aria-label="Attach file"
          />
          <button
            type="button"
            className={styles.attachBtn}
            onClick={() => fileInputRef.current?.click()}
            title="Attach Code or Document"
          >
            <PaperclipIcon size={14} />
            <span>ATTACH</span>
          </button>

          <div className={styles.divider} />

          <div className={styles.depthControl}>
            <span>DEPTH:</span>
            <div className={styles.depthBars}>
              {[1, 2, 3, 4, 5].map((level) => (
                <span
                  key={level}
                  className={clsx(styles.depthBar, level <= depth && styles.filled)}
                  onClick={() => setDepth(level)}
                  role="button"
                  tabIndex={0}
                  title={`Depth level ${level}`}
                />
              ))}
            </div>
          </div>

          <div className={styles.divider} />

          <div className={styles.tokenCounter} title="Buffer Token Usage">
            <span>
              CHARS: <span className={styles.counterValue}>{charsCount}</span>
            </span>
            <span className={styles.counterSlash}>{'//'}</span>
            <span>
              TOKENS: <span className={styles.counterValue}>~{tokensCount}</span>
            </span>
          </div>
        </div>

        <Button variant="cyber" onClick={handleEngageClick}>
          [ ENGAGE SWARM CLUSTER ↵ ]
        </Button>
      </div>
    </div>
  );
}
