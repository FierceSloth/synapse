'use client';

import type { PatternId, ThinkingPattern } from '@/entities/pattern';
import { PatternSelector } from '@/features/pattern-selector';
import { SwarmAgents } from '@/features/swarm-agents';
import { SwarmInput } from '@/features/swarm-input';
import { useState } from 'react';
import styles from './new-directive.module.scss';

export interface NewDirectiveProps {
  initialPrompt?: string;
  onEngage?: (prompt: string, options: { depth: number }) => void;
}

export function NewDirective({ initialPrompt, onEngage }: NewDirectiveProps) {
  const [selectedPatternId, setSelectedPatternId] = useState<PatternId>('fullstack-architecture');

  const handleSelectPattern = (pattern: ThinkingPattern) => {
    setSelectedPatternId(pattern.id);
  };

  return (
    <div className={styles.container}>
      <SwarmAgents patternId={selectedPatternId} />
      <SwarmInput initialPrompt={initialPrompt} onEngage={onEngage} />
      <PatternSelector initialPatternId={selectedPatternId} onSelectPattern={handleSelectPattern} />
    </div>
  );
}
