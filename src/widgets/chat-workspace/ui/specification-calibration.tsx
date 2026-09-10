'use client';

import type { ClarificationAnswers, ClarificationQuestion } from '@/entities/chat';
import clsx from 'clsx';
import { useState } from 'react';
import styles from './specification-calibration.module.scss';

export interface SpecificationCalibrationProps {
  questions?: ClarificationQuestion[];
  initialAnswers?: ClarificationAnswers;
  onConfirm?: (answers: ClarificationAnswers) => void;
  isConfirmed?: boolean;
}

function extractDefaultAnswers(questions: ClarificationQuestion[]): ClarificationAnswers {
  const result: ClarificationAnswers = {};
  for (const q of questions) {
    result[q.id] = q.defaultOption ?? q.options[0] ?? '';
  }
  return result;
}

export function SpecificationCalibration({
  questions = [],
  initialAnswers,
  onConfirm,
  isConfirmed = false,
}: SpecificationCalibrationProps) {
  const [userSelectedAnswers, setUserSelectedAnswers] = useState<ClarificationAnswers>(() => initialAnswers ?? {});

  const effectiveAnswers: ClarificationAnswers = {
    ...extractDefaultAnswers(questions),
    ...(initialAnswers ?? {}),
    ...userSelectedAnswers,
  };

  const handleSelectOption = (questionId: string, option: string) => {
    if (isConfirmed) return;
    setUserSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleConfirm = () => {
    onConfirm?.(effectiveAnswers);
  };

  const hasQuestions = questions && questions.length > 0;

  return (
    <div className={styles.calibrationCard}>
      <div className={styles.cornerTl} />
      <div className={styles.cornerTr} />
      <div className={styles.cornerBl} />
      <div className={styles.cornerBr} />

      <div className={styles.cardHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.headerDot} />
          <span className={styles.headerTitle}>[ ARCHITECT // SPECIFICATION CALIBRATION ]</span>
        </div>
        <span className={styles.headerStatus}>
          {isConfirmed
            ? '[ CALIBRATION LOCKED ]'
            : hasQuestions
              ? '[ AWAITING USER INPUT ]'
              : '[ COMPUTING SYSTEM VECTORS... ]'}
        </span>
      </div>

      <div className={styles.cardBody}>
        {!hasQuestions ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingPulseRow}>
              <div className={styles.loadingDotPulse} />
              <span className={styles.loadingText}>
                ARCHITECT SCANNING DIRECTIVE // GENERATING REAL-TIME SYSTEM SPECIFICATION VECTORS...
              </span>
            </div>
            <div className={styles.skeletonGroup}>
              {[1, 2, 3].map((idx) => (
                <div key={idx} className={styles.skeletonBlock}>
                  <div className={styles.skeletonTitle} />
                  <div className={styles.skeletonChips}>
                    <div className={styles.skeletonChip} />
                    <div className={styles.skeletonChip} />
                    <div className={styles.skeletonChip} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          questions.map((question, index) => {
            const selectedOption = effectiveAnswers[question.id] || question.options[0];
            const slotNumber = String(index + 1).padStart(2, '0');
            const cleanName = question.title.replace(/^VECTOR\s*\d*\s*\[?|\]?$/gi, '').trim();
            const formattedTitle = `VECTOR ${slotNumber} [${cleanName.toUpperCase()}]`;

            return (
              <div key={question.id} className={styles.questionBlock}>
                <div className={styles.questionTitle}>{formattedTitle}</div>
                <div className={styles.chipGroup}>
                  {question.options.map((option) => {
                    const isActive = selectedOption === option;

                    return (
                      <button
                        key={option}
                        type="button"
                        className={clsx(styles.chip, isActive && styles.chipActive)}
                        onClick={() => handleSelectOption(question.id, option)}
                        disabled={isConfirmed}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {!isConfirmed && (
        <div className={styles.cardFooter}>
          <button type="button" className={styles.confirmBtn} onClick={handleConfirm} disabled={!hasQuestions}>
            <span>[ CONFIRM CALIBRATION &amp; IGNITE 5-AGENT SWARM ↵ ]</span>
          </button>
        </div>
      )}
    </div>
  );
}
