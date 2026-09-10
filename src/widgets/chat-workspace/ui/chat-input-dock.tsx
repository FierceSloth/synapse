'use client';

import { Button } from '@shared/ui';
import { Terminal as TerminalIcon } from 'lucide-react';
import { useState, type KeyboardEvent } from 'react';
import styles from './chat-input-dock.module.scss';

export interface ChatInputDockProps {
  onSubmit: (text: string) => void;
  onCancel?: () => void;
  placeholder?: string;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  isActionActive?: boolean;
  initialValue?: string;
}

export function ChatInputDock({
  onSubmit,
  onCancel,
  placeholder = 'Ask a follow-up, challenge an agent, or request changes...',
  inputRef,
  isActionActive = false,
  initialValue = '',
}: ChatInputDockProps) {
  const [value, setValue] = useState(initialValue);

  const hasText = value.trim().length > 0;

  const handleSubmit = () => {
    if (isActionActive || !hasText) return;
    onSubmit(value.trim());
    setValue('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (isActionActive) {
      e.preventDefault();
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleCancelClick = () => {
    onCancel?.();
    setValue('');
  };

  return (
    <div className={styles.dockWrapper}>
      <div className={styles.dockSmoke} />
      <div className={styles.dockInner}>
        <div className={styles.inputPill}>
          <div className={styles.dockIcon}>
            <TerminalIcon size={18} />
          </div>

          <input
            ref={inputRef}
            type="text"
            className={styles.dockInput}
            value={isActionActive ? '' : value}
            disabled={isActionActive}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isActionActive ? 'SWARM DELIBERATION IN PROGRESS...' : placeholder}
            aria-label="Directive follow-up input"
          />

          {isActionActive ? (
            <Button
              variant="cyber"
              className={styles.dockActionBtn}
              onClick={handleCancelClick}
              title="Cancel active deliberation and write a new prompt"
            >
              [ CANCEL ]
            </Button>
          ) : (
            <Button variant="cyber" className={styles.dockActionBtn} disabled={!hasText} onClick={handleSubmit}>
              [ SEND ↵ ]
            </Button>
          )}
        </div>

        <div className={styles.disclaimer}>SynapseOS — is powered by AI. It may make mistakes.</div>
      </div>
    </div>
  );
}
