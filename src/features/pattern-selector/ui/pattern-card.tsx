'use client';

import type { ThinkingPattern } from '@/entities/pattern';
import clsx from 'clsx';
import { Radar as RadarIcon, Rocket as RocketIcon, Scale as ScaleIcon, Terminal as TerminalIcon } from 'lucide-react';
import Image from 'next/image';
import type { ReactNode } from 'react';
import styles from './pattern-card.module.scss';

const PATTERN_SVGS: Record<string, string> = {
  '01': '/assets/patterns/pattern-01.svg',
  '02': '/assets/patterns/pattern-02.svg',
  '03': '/assets/patterns/pattern-03.svg',
  '04': '/assets/patterns/pattern-04.svg',
};

function getPatternIcon(iconName: string): ReactNode {
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
  const svgSrc = PATTERN_SVGS[patternNumber];
  if (!svgSrc) return null;

  return (
    <Image
      src={svgSrc}
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
  isActive: boolean;
  onSelect: () => void;
}

export function PatternCard({ pattern, isActive, onSelect }: PatternCardProps) {
  const firstRowTags = pattern.tags.slice(0, 4);
  const secondRowTags = pattern.tags.slice(4);

  return (
    <div className={clsx(styles.card, isActive && styles.active)} onClick={onSelect} role="button" tabIndex={0}>
      {isActive && <div className={styles.laserScan} />}

      <div className={styles.cardHeader}>
        <div className={clsx(styles.iconWrapper, isActive && styles.active)}>{getPatternIcon(pattern.iconName)}</div>
        <div className={clsx(styles.patternBadge, isActive && styles.active)}>
          [ PATTERN {'//'} {pattern.patternNumber} ]
        </div>
      </div>

      <div className={clsx(styles.title, isActive && styles.active)}>{pattern.title}</div>
      <div className={clsx(styles.description, isActive && styles.active)}>{pattern.description}</div>

      <div className={styles.constellationWrapper}>{renderConstellation(pattern.patternNumber, isActive)}</div>

      <div className={styles.tags}>
        <div className={styles.tagRow}>
          {firstRowTags.map((tag) => (
            <span key={tag.label} className={clsx(styles.tag, isActive && styles.active)}>
              {tag.label}
            </span>
          ))}
        </div>
        {secondRowTags.length > 0 && (
          <div className={styles.tagRow}>
            {secondRowTags.map((tag) => (
              <span key={tag.label} className={clsx(styles.tag, isActive && styles.active)}>
                {tag.label}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className={clsx(styles.footer, isActive && styles.active)}>
        <span>{pattern.footer.cores}</span>
        <span>{pattern.footer.mode}</span>
      </div>
    </div>
  );
}
