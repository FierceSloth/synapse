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

export const DEPTH_CONFIG: Record<number, { title: string; desc: string }> = {
  1: { title: '1/5', desc: '1 Agent (Express)' },
  2: { title: '2/5', desc: '2 Agents (Dialogue)' },
  3: { title: '3/5', desc: '3 Agents (Council)' },
  4: { title: '4/5', desc: '4 Agents (Deep Audit)' },
  5: { title: '5/5', desc: '5 Agents (Full Swarm)' },
};

export function SwarmInput({ initialPrompt = '', onEngage }: SwarmInputProps) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [depth, setDepth] = useState(5);
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

  const handlePromptChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setPrompt((prev) => (prev ? `${prev}\n\n[FILE: ${file.name}]\n${content}` : `[FILE: ${file.name}]\n${content}`));
    };
    reader.readAsText(file);
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
          onChange={handlePromptChange}
          placeholder="ENTER DIRECTIVE FOR MULTI-AGENT SWARM DELIBERATION..."
          rows={4}
          aria-label="Directive Prompt Input"
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

          <div
            className={styles.depthControl}
            title={`Swarm depth: ${DEPTH_CONFIG[depth]?.desc} — sequential multi-agent analysis`}
          >
            <span>DEPTH:</span>
            <div className={styles.depthBars}>
              {[1, 2, 3, 4, 5].map((level) => (
                <span
                  key={level}
                  className={clsx(styles.depthBar, level <= depth && styles.filled)}
                  onClick={() => setDepth(level)}
                  role="button"
                  tabIndex={0}
                  title={`Level ${level}: ${DEPTH_CONFIG[level]?.desc}`}
                />
              ))}
            </div>
            <span className={styles.depthBadge}>{DEPTH_CONFIG[depth]?.desc}</span>
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
