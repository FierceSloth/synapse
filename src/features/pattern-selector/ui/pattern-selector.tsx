'use client';

import { useState } from 'react';
import { LayoutGrid as LayoutGridIcon } from 'lucide-react';
import { THINKING_PATTERNS, type ThinkingPattern } from '@/entities/pattern';
import { PatternCard } from './pattern-card';
import styles from './pattern-selector.module.scss';

export interface PatternSelectorProps {
  initialPatternId?: string;
  onSelectPattern?: (pattern: ThinkingPattern) => void;
}

export function PatternSelector({
  initialPatternId = 'fullstack-architecture',
  onSelectPattern,
}: PatternSelectorProps) {
  const [activeId, setActiveId] = useState(initialPatternId);

  const handleSelect = (pattern: ThinkingPattern) => {
    setActiveId(pattern.id);
    onSelectPattern?.(pattern);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <LayoutGridIcon className={styles.headerIcon} size={13} />
        <span>Thinking Patterns</span>
      </div>

      <div className={styles.grid}>
        {THINKING_PATTERNS.map((pattern) => (
          <PatternCard
            key={pattern.id}
            pattern={pattern}
            isActive={pattern.id === activeId}
            onSelect={() => handleSelect(pattern)}
          />
        ))}
      </div>
    </div>
  );
}
