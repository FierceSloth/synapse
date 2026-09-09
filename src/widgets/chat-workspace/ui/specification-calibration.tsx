'use client';

import type { ClarificationAnswers, ClarificationQuestion } from '@/entities/chat';
import clsx from 'clsx';
import { useState } from 'react';
import { MOCK_QUESTIONS, getDefaultAnswers } from '../model/mock-questions';
import styles from './specification-calibration.module.scss';

export interface SpecificationCalibrationProps {
  questions?: ClarificationQuestion[];
  initialAnswers?: ClarificationAnswers;
  onConfirm?: (answers: ClarificationAnswers) => void;
  isConfirmed?: boolean;
}

export function SpecificationCalibration({
  questions = MOCK_QUESTIONS,
  initialAnswers,
  onConfirm,
  isConfirmed = false,
}: SpecificationCalibrationProps) {
  const [answers, setAnswers] = useState<ClarificationAnswers>(() => {
    return initialAnswers ?? getDefaultAnswers(questions);
  });

  const handleSelectOption = (questionId: string, option: string) => {
    if (isConfirmed) return;
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleConfirm = () => {
    onConfirm?.(answers);
  };

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
        <span className={styles.headerStatus}>{isConfirmed ? '[ CALIBRATION LOCKED ]' : '[AWAITING USER INPUT]'}</span>
      </div>

      <div className={styles.cardBody}>
        {questions.map((question) => {
          const selectedOption = answers[question.id];

          return (
            <div key={question.id} className={styles.questionBlock}>
              <div className={styles.questionTitle}>{question.title}</div>
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
        })}
      </div>

      {!isConfirmed && (
        <div className={styles.cardFooter}>
          <button type="button" className={styles.confirmBtn} onClick={handleConfirm}>
            <span>[ CONFIRM CALIBRATION &amp; IGNITE 5-AGENT SWARM ↵ ]</span>
          </button>
        </div>
      )}
    </div>
  );
}
