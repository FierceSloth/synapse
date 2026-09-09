'use client';

import { MOCK_FINAL_ANSWER, useChatStore, type Chat, type ClarificationAnswers } from '@/entities/chat';
import { useEffect, useRef } from 'react';
import { ChatInputDock } from './chat-input-dock';
import styles from './chat-workspace.module.scss';
import { SpecificationCalibration } from './specification-calibration';
import { SwarmConsensus } from './swarm-consensus';
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

  const handleCompleteDeliberation = (iterationId: string) => {
    const currentIter = chat.iterations.find((it) => it.id === iterationId);
    updateIteration(chat.id, iterationId, {
      status: 'completed',
      debateProgress: 100,
      answer: currentIter?.answer || MOCK_FINAL_ANSWER,
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
                  onFinalizeConsensus={() => handleCompleteDeliberation(iteration.id)}
                />
              )}

              {iteration.status === 'completed' && iteration.answer && <SwarmConsensus answer={iteration.answer} />}
            </div>
          ))}
        </div>
      </div>

      <ChatInputDock onSubmit={handleNewQuery} inputRef={dockInputRef} />
    </div>
  );
}
