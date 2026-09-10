'use client';

import { useChatStore } from '@/entities/chat';
import type { ThinkingPattern } from '@/entities/pattern';
import { PatternSelector } from '@/features/pattern-selector';
import { SwarmAgents } from '@/features/swarm-agents';
import { SwarmInput } from '@/features/swarm-input';
import styles from './new-directive.module.scss';

export interface NewDirectiveProps {
  initialPrompt?: string;
  onEngage?: (prompt: string, options: { depth: number }) => void;
}

export function NewDirective({ initialPrompt, onEngage }: NewDirectiveProps) {
  const selectedPatternId = useChatStore((state) => state.selectedPatternId);
  const setSelectedPatternId = useChatStore((state) => state.setSelectedPatternId);
  const createChat = useChatStore((state) => state.createChat);

  const handleSelectPattern = (pattern: ThinkingPattern) => {
    setSelectedPatternId(pattern.id);
  };

  const handleEngage = (prompt: string, options: { depth: number }) => {
    createChat(prompt, selectedPatternId, options.depth);
    onEngage?.(prompt, options);
  };

  return (
    <div className={styles.container}>
      <SwarmAgents patternId={selectedPatternId} />
      <SwarmInput initialPrompt={initialPrompt} onEngage={handleEngage} />
      <PatternSelector initialPatternId={selectedPatternId} onSelectPattern={handleSelectPattern} />
    </div>
  );
}
