'use client';

import { useChatStore, type Chat, type ClarificationAnswers } from '@/entities/chat';
import { useEffect, useRef } from 'react';
import { ChatInputDock } from './chat-input-dock';
import styles from './chat-workspace.module.scss';
import { SpecificationCalibration } from './specification-calibration';
import { SwarmDeliberation } from './swarm-deliberation';
import { UserMessage } from './user-message';

export interface ChatWorkspaceProps {
  chat: Chat;
}

export function ChatWorkspace({ chat }: ChatWorkspaceProps) {
  const streamRef = useRef<HTMLDivElement>(null);
  const dockInputRef = useRef<HTMLInputElement>(null);
  const updateIteration = useChatStore((state) => state.updateIteration);
  const addIteration = useChatStore((state) => state.addIteration);

  const iterationsCount = chat.iterations.length;
  const lastIteration = chat.iterations[iterationsCount - 1];
  const lastIterationStatus = lastIteration ? lastIteration.status : undefined;

  useEffect(() => {
    if (streamRef.current) {
      streamRef.current.scrollTo({
        top: streamRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [iterationsCount, lastIterationStatus]);

  const handleConfirmCalibration = (iterationId: string, answers: ClarificationAnswers) => {
    updateIteration(chat.id, iterationId, {
      answers,
      status: 'debating',
      debateProgress: 78,
    });
  };

  const handleInjectGuidance = () => {
    dockInputRef.current?.focus();
  };

  const handleNewQuery = (text: string) => {
    addIteration(chat.id, text);
  };

  return (
    <div className={styles.workspace}>
      <div ref={streamRef} className={styles.stream}>
        <div className={styles.streamInner}>
          {chat.iterations.map((iteration) => (
            <div key={iteration.id} className={styles.iterationGroup}>
              <UserMessage query={iteration.userQuery} timestamp={iteration.timestamp} />

              {iteration.status === 'calibration' && (
                <SpecificationCalibration
                  questions={iteration.questions}
                  initialAnswers={iteration.answers}
                  onConfirm={(answers) => handleConfirmCalibration(iteration.id, answers)}
                />
              )}

              {iteration.status === 'debating' && (
                <SwarmDeliberation
                  debates={iteration.debates && iteration.debates.length > 0 ? iteration.debates : undefined}
                  progress={iteration.debateProgress ?? 78}
                  onInjectGuidance={handleInjectGuidance}
                />
              )}

              {iteration.status === 'completed' && iteration.answer && (
                <div className={styles.debatingPlaceholder}>
                  <div className={styles.cornerTl} />
                  <div className={styles.cornerTr} />
                  <div className={styles.cornerBl} />
                  <div className={styles.cornerBr} />
                  <div className={styles.debatingTitle}>[ CONSENSUS REACHED: {iteration.answer.title} ]</div>
                  <div className={styles.debatingSubtitle}>{iteration.answer.overview}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <ChatInputDock onSubmit={handleNewQuery} inputRef={dockInputRef} />
    </div>
  );
}
