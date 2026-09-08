'use client';

import type { AgentColorTheme, SwarmAgent } from '@/entities/agent';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import styles from './agent-card.module.scss';
import { AgentIcon } from './agent-icon';

const SLOT_THEMES: AgentColorTheme[] = ['blue', 'cyan', 'amber', 'indigo', 'purple'];

export interface AgentCardProps {
  slotIndex: number;
  agent: SwarmAgent;
}

export function AgentCard({ slotIndex, agent }: AgentCardProps) {
  const [prevAgentName, setPrevAgentName] = useState(agent.name);
  const [displayedAgent, setDisplayedAgent] = useState(agent);
  const [phase, setPhase] = useState<'idle' | 'exit' | 'enter'>('idle');

  if (agent.name !== prevAgentName) {
    setPrevAgentName(agent.name);
    setPhase('exit');
  }

  useEffect(() => {
    if (phase === 'exit') {
      const exitTimeout = setTimeout(() => {
        setDisplayedAgent(agent);
        setPhase('enter');
      }, 140);

      return () => {
        clearTimeout(exitTimeout);
      };
    }

    if (phase === 'enter') {
      const enterTimeout = setTimeout(() => {
        setPhase('idle');
      }, 220);

      return () => {
        clearTimeout(enterTimeout);
      };
    }
  }, [phase, agent]);

  const slotNumber = `0${slotIndex + 1}`;
  const colorTheme = SLOT_THEMES[slotIndex] ?? 'blue';
  const isPrimary = slotIndex === 2;

  return (
    <div className={clsx(styles.cardWrapper, styles[colorTheme], isPrimary && styles.primary)}>
      <div className={clsx(styles.cardBox, isPrimary && styles.primary)}>
        <div className={styles.gradientOverlay} />

        <div className={clsx(styles.slotNumber, isPrimary && styles.primary)}>{slotNumber}</div>

        <span className={clsx(styles.corner, styles.topLeft, isPrimary && styles.primary)} />
        <span className={clsx(styles.corner, styles.topRight, isPrimary && styles.primary)} />
        <span className={clsx(styles.corner, styles.bottomLeft, isPrimary && styles.primary)} />
        <span className={clsx(styles.corner, styles.bottomRight, isPrimary && styles.primary)} />

        <div
          className={clsx(
            styles.agentContent,
            phase === 'exit' && styles.exiting,
            phase === 'enter' && styles.entering
          )}
        >
          <div className={clsx(styles.iconContainer, isPrimary && styles.primary)}>
            <AgentIcon name={displayedAgent.iconName} size={isPrimary ? 26 : 20} />
            {isPrimary && <div className={styles.orbitalRing} />}
          </div>

          <div className={clsx(styles.infoSection, isPrimary && styles.primary)}>
            <div className={clsx(styles.name, isPrimary && styles.primary)}>[{displayedAgent.name}]</div>
            <div className={clsx(styles.status, isPrimary && styles.primary)}>Node Active</div>
          </div>
        </div>
      </div>

      <div className={clsx(styles.pedestal, isPrimary && styles.primary)}>
        <div className={clsx(styles.outerDisc, isPrimary && styles.primary)}>
          <div className={clsx(styles.innerRing, isPrimary && styles.primary)} />
          {isPrimary && <div className={styles.pingRing} />}
        </div>
      </div>
    </div>
  );
}
