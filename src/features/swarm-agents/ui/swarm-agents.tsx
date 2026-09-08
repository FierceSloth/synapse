'use client';

import { PATTERN_AGENTS } from '@/entities/agent';
import type { PatternId } from '@/entities/pattern';
import { AgentCard } from './agent-card';
import styles from './swarm-agents.module.scss';

export interface SwarmAgentsProps {
  patternId?: PatternId;
}

export function SwarmAgents({ patternId = 'fullstack-architecture' }: SwarmAgentsProps) {
  const agents = PATTERN_AGENTS[patternId] ?? PATTERN_AGENTS['fullstack-architecture'];

  return (
    <div className={styles.container}>
      <div className={styles.radarGrid} aria-hidden="true">
        <div className={styles.radarEllipseLarge} />
        <div className={styles.radarEllipseMedium} />
        <div className={styles.radarEllipseSmall} />
        <div className={styles.radarLineH} />
        <div className={styles.radarLineD1} />
        <div className={styles.radarLineD2} />
        <div className={styles.radarLineV} />
      </div>

      <div className={styles.cardsRow}>
        {agents.map((agent, index) => (
          <AgentCard key={index} slotIndex={index} agent={agent} />
        ))}
      </div>
    </div>
  );
}
