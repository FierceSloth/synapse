'use client';

import { useChatStore, type Chat, type ChatIteration, type ClarificationAnswers } from '@/entities/chat';
import { useSettingsStore } from '@/entities/settings';
import { useSwarmOrchestrator } from '@/features/swarm-orchestrator';
import { getInitials } from '@/shared/lib';
import { useEffect, useRef, useState } from 'react';
import { ChatInputDock } from './chat-input-dock';
import styles from './chat-workspace.module.scss';
import { SpecificationCalibration } from './specification-calibration';
import { SwarmConsensus } from './swarm-consensus';
import { SwarmDeliberation } from './swarm-deliberation';
import { UserMessage } from './user-message';

export interface ChatWorkspaceProps {
  chat: Chat;
}

interface IterationItemProps {
  chat: Chat;
  iteration: ChatIteration;
  isLast: boolean;
}

function IterationItem({ chat, iteration: initialIteration, isLast }: IterationItemProps) {
  const updateIteration = useChatStore((state) => state.updateIteration);
  const userName = useSettingsStore((state) => state.name);
  const userInitials = getInitials(userName);

  const iteration = useChatStore((state) => {
    const liveChat = state.chats.find((c) => c.id === chat.id);
    return liveChat?.iterations.find((it) => it.id === initialIteration.id) ?? initialIteration;
  });

  const { isPaused, togglePause, isSynthesizing, triggerSynthesis, injectGuidance, activeSpeaker } =
    useSwarmOrchestrator({
      chatId: chat.id,
      patternId: chat.patternId,
      iteration,
    });

  const handleConfirmCalibration = (answers: ClarificationAnswers) => {
    updateIteration(chat.id, iteration.id, {
      answers,
      status: 'debating',
      debateProgress: 0,
    });
  };

  return (
    <div className={styles.iterationGroup}>
      <UserMessage
        query={iteration.userQuery}
        timestamp={iteration.timestamp}
        userName={userName}
        userInitials={userInitials}
      />

      {iteration.status === 'calibration' && (
        <SpecificationCalibration
          questions={iteration.questions}
          initialAnswers={iteration.answers}
          onConfirm={handleConfirmCalibration}
        />
      )}

      {iteration.status === 'debating' && (
        <SwarmDeliberation
          debates={iteration.debates || []}
          progress={iteration.debateProgress ?? 0}
          activeSpeaker={isLast ? activeSpeaker : null}
          depth={iteration.depth ?? 5}
          isPaused={isPaused}
          isSynthesizing={isSynthesizing}
          onTogglePause={togglePause}
          onInjectGuidance={injectGuidance}
          onFinalizeConsensus={() => {
            void triggerSynthesis();
          }}
        />
      )}

      {iteration.status === 'completed' && iteration.answer && (
        <SwarmConsensus answer={iteration.answer} depth={iteration.depth ?? 5} />
      )}
    </div>
  );
}

export function ChatWorkspace({ chat }: ChatWorkspaceProps) {
  const streamRef = useRef<HTMLDivElement>(null);
  const dockInputRef = useRef<HTMLInputElement>(null);
  const addIteration = useChatStore((state) => state.addIteration);
  const cancelActiveIteration = useChatStore((state) => state.cancelActiveIteration);

  const [restoredPrompt, setRestoredPrompt] = useState('');

  const iterationsCount = chat.iterations.length;
  const lastIteration = chat.iterations[iterationsCount - 1];
  const lastDebatesCount = lastIteration?.debates?.length ?? 0;
  const lastStatus = lastIteration?.status;

  const isActionActive = lastStatus === 'calibration' || lastStatus === 'debating';

  useEffect(() => {
    if (streamRef.current) {
      streamRef.current.scrollTo({
        top: streamRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [iterationsCount, lastDebatesCount, lastStatus]);

  const handleNewQuery = (text: string) => {
    setRestoredPrompt('');
    const inheritedDepth = lastIteration?.depth ?? 5;
    addIteration(chat.id, text, inheritedDepth);
  };

  const handleCancelActive = () => {
    const cancelled = cancelActiveIteration(chat.id);
    if (cancelled) {
      setRestoredPrompt(cancelled);
    }
  };

  return (
    <div className={styles.workspace}>
      <div ref={streamRef} className={styles.stream}>
        <div className={styles.streamInner}>
          {chat.iterations.map((iteration, index) => (
            <IterationItem
              key={iteration.id}
              chat={chat}
              iteration={iteration}
              isLast={index === iterationsCount - 1}
            />
          ))}
        </div>
      </div>

      <ChatInputDock
        key={`${chat.iterations.length}-${restoredPrompt}`}
        onSubmit={handleNewQuery}
        onCancel={handleCancelActive}
        isActionActive={isActionActive}
        initialValue={restoredPrompt}
        inputRef={dockInputRef}
      />
    </div>
  );
}
