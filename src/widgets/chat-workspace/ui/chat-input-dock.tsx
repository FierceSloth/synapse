'use client';

import { Button } from '@shared/ui';
import clsx from 'clsx';
import { Terminal as TerminalIcon } from 'lucide-react';
import { useState, type KeyboardEvent } from 'react';
import styles from './chat-input-dock.module.scss';

export interface ChatInputDockProps {
  onSubmit: (text: string) => void;
  onCancel?: () => void;
  placeholder?: string;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

export function ChatInputDock({
  onSubmit,
  onCancel,
  placeholder = 'Ask a follow-up, challenge an agent, or request changes...',
  inputRef,
}: ChatInputDockProps) {
  const [value, setValue] = useState('');

  const hasText = value.trim().length > 0;

  const handleSubmit = () => {
    if (!hasText) return;
    onSubmit(value.trim());
    setValue('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleActionClick = () => {
    if (hasText) {
      handleSubmit();
    } else {
      setValue('');
      onCancel?.();
    }
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
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            aria-label="Directive follow-up input"
          />

          <Button variant="cyber" className={clsx(styles.dockActionBtn)} onClick={handleActionClick}>
            {hasText ? '[ SEND ↵ ]' : '[ CANCEL ]'}
          </Button>
        </div>

        <div className={styles.disclaimer}>SynapseOS — is powered by AI. It may make mistakes.</div>
      </div>
    </div>
  );
}
