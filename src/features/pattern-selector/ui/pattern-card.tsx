'use client';

import type { PatternIconName, ThinkingPattern } from '@/entities/pattern';
import clsx from 'clsx';
import { Radar as RadarIcon, Rocket as RocketIcon, Scale as ScaleIcon, Terminal as TerminalIcon } from 'lucide-react';
import Image from 'next/image';
import type { ReactNode } from 'react';
import styles from './pattern-card.module.scss';

function getPatternIcon(iconName: PatternIconName): ReactNode {
  switch (iconName) {
    case 'terminal':
      return <TerminalIcon size={15} />;
    case 'radar':
      return <RadarIcon size={15} />;
    case 'rocket':
      return <RocketIcon size={15} />;
    case 'scale':
      return <ScaleIcon size={15} />;
    default:
      return <TerminalIcon size={15} />;
  }
}

function renderConstellation(patternNumber: string, isActive: boolean) {
  return (
    <Image
      src={`/assets/patterns/pattern-${patternNumber}.svg`}
      alt={`Pattern ${patternNumber} constellation`}
      width={120}
      height={36}
      className={clsx(styles.constellation, isActive && styles.active)}
      unoptimized
    />
  );
}

export interface PatternCardProps {
  pattern: ThinkingPattern;
  index: number;
  isActive: boolean;
  onSelect: () => void;
}

export function PatternCard({ pattern, index, isActive, onSelect }: PatternCardProps) {
  const patternNumber = `0${index + 1}`;
  const firstRowTags = pattern.tags.slice(0, 4);
  const secondRowTags = pattern.tags.slice(4);

  return (
    <div className={clsx(styles.card, isActive && styles.active)} onClick={onSelect} role="button" tabIndex={0}>
      {isActive && <div className={styles.laserScan} />}

      <div className={styles.cardHeader}>
        <div className={clsx(styles.iconWrapper, isActive && styles.active)}>{getPatternIcon(pattern.iconName)}</div>
        <div className={clsx(styles.patternBadge, isActive && styles.active)}>
          [ PATTERN {'//'} {patternNumber} ]
        </div>
      </div>

      <div className={clsx(styles.title, isActive && styles.active)}>{pattern.title}</div>
      <div className={clsx(styles.description, isActive && styles.active)}>{pattern.description}</div>

      <div className={styles.constellationWrapper}>{renderConstellation(patternNumber, isActive)}</div>

      <div className={styles.tags}>
        <div className={styles.tagRow}>
          {firstRowTags.map((tag) => (
            <span key={tag} className={clsx(styles.tag, isActive && styles.active)}>
              {tag}
            </span>
          ))}
        </div>
        {secondRowTags.length > 0 && (
          <div className={styles.tagRow}>
            {secondRowTags.map((tag) => (
              <span key={tag} className={clsx(styles.tag, isActive && styles.active)}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className={clsx(styles.footer, isActive && styles.active)}>
        <span>CORES: 5/5</span>
        <span>MODE: 3-PASS DEBATE</span>
      </div>
    </div>
  );
}
