'use client';

import { SwarmInput } from '@/features/swarm-input';
import { PatternSelector } from '@/features/pattern-selector';
import styles from './new-directive.module.scss';

export interface NewDirectiveProps {
  initialPrompt?: string;
  onEngage?: (prompt: string, options: { depth: number }) => void;
}

export function NewDirective({ initialPrompt, onEngage }: NewDirectiveProps) {
  return (
    <div className={styles.container}>
      <div className={styles.agentsPlaceholder} />
      <SwarmInput initialPrompt={initialPrompt} onEngage={onEngage} />
      <PatternSelector />
    </div>
  );
}
