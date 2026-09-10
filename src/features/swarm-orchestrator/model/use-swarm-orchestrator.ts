'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { DELIBERATION_STAGES, PATTERN_AGENTS } from '@/entities/agent';
import { useChatStore, type AgentDebateMessage, type ChatIteration, type ClarificationQuestion } from '@/entities/chat';
import type { PatternId } from '@/entities/pattern';
import { useSettingsStore } from '@/entities/settings';

export interface UseSwarmOrchestratorOptions {
  chatId: string;
  patternId: PatternId;
  iteration: ChatIteration;
}

export function useSwarmOrchestrator({ chatId, patternId, iteration }: UseSwarmOrchestratorOptions) {
  const updateIteration = useChatStore((state) => state.updateIteration);
  const addDebateMessage = useChatStore((state) => state.addDebateMessage);
  const injectHumanGuidanceStore = useChatStore((state) => state.injectHumanGuidance);
  const setFinalAnswer = useChatStore((state) => state.setFinalAnswer);
  const geminiApiKey = useSettingsStore((state) => state.geminiApiKey);

  const [isPaused, setIsPaused] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const agents = PATTERN_AGENTS[patternId] ?? PATTERN_AGENTS['fullstack-architecture'];
  const targetSlots = Math.min(5, Math.max(1, iteration.depth ?? 5));

  const isCalibrating =
    iteration.status === 'calibration' && (!iteration.questions || iteration.questions.length === 0);

  const nonHumanCount = (iteration.debates || []).filter((d) => !d.isHuman).length;
  const isDebatingActive = iteration.status === 'debating' && !isPaused && nonHumanCount < targetSlots;
  const nextActiveSlot = nonHumanCount + 1;
  const activeAgent = agents[nextActiveSlot - 1];
  const activeStageInfo = DELIBERATION_STAGES[nextActiveSlot];

  const activeSpeaker =
    isDebatingActive && activeAgent
      ? {
          slotIndex: nextActiveSlot,
          agentName: activeAgent.name,
          stageName: activeStageInfo?.name,
        }
      : null;

  const inFlightSlotRef = useRef<number | null>(null);

  useEffect(() => {
    if (iteration.status !== 'calibration') return;
    if (iteration.questions && iteration.questions.length > 0) return;

    const controller = new AbortController();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(geminiApiKey ? { 'x-gemini-api-key': geminiApiKey } : {}),
    };

    fetch('/api/swarm/calibrate', {
      method: 'POST',
      headers,
      signal: controller.signal,
      body: JSON.stringify({
        prompt: iteration.userQuery,
        patternId,
      }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`Calibration failed: ${res.statusText}`);
        return (await res.json()) as { needsCalibration?: boolean; questions?: ClarificationQuestion[] };
      })
      .then((data) => {
        if (data.needsCalibration === false || !data.questions || data.questions.length === 0) {
          updateIteration(chatId, iteration.id, {
            status: 'debating',
            questions: [],
            debateProgress: 0,
          });
        } else {
          updateIteration(chatId, iteration.id, {
            questions: data.questions,
          });
        }
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
        console.error('Calibration error:', err);
        setError(err instanceof Error ? err.message : 'Calibration failed');
      });

    return () => {
      controller.abort();
    };
  }, [
    chatId,
    iteration.id,
    iteration.status,
    iteration.userQuery,
    iteration.questions,
    patternId,
    geminiApiKey,
    updateIteration,
  ]);

  useEffect(() => {
    if (iteration.status !== 'debating') {
      inFlightSlotRef.current = null;
      return;
    }
    if (isPaused) return;

    const debates = iteration.debates || [];
    const nonHumanMessages = debates.filter((d) => !d.isHuman);

    if (nonHumanMessages.length >= targetSlots) {
      inFlightSlotRef.current = null;
      return;
    }

    const nextSlotIndex = nonHumanMessages.length + 1;
    if (inFlightSlotRef.current === nextSlotIndex) {
      return;
    }

    const currentAgent = agents[nextSlotIndex - 1];
    if (!currentAgent) return;

    inFlightSlotRef.current = nextSlotIndex;

    const transcript = debates.map((d) => ({
      agentName: d.agentName,
      text: d.text,
      isHuman: d.isHuman,
    }));

    const delayMs = nextSlotIndex === 1 ? 300 : 1200;
    const controller = new AbortController();

    const timer = setTimeout(() => {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(geminiApiKey ? { 'x-gemini-api-key': geminiApiKey } : {}),
      };

      fetch('/api/swarm/deliberate', {
        method: 'POST',
        headers,
        signal: controller.signal,
        body: JSON.stringify({
          prompt: iteration.userQuery,
          patternId,
          slotIndex: nextSlotIndex,
          totalSlots: targetSlots,
          agentName: currentAgent.name,
          calibrationAnswers: iteration.answers,
          transcript,
          humanGuidance: iteration.humanGuidance,
        }),
      })
        .then(async (res) => {
          if (!res.ok) throw new Error(`Agent deliberation failed: ${res.statusText}`);
          return (await res.json()) as { message?: AgentDebateMessage };
        })
        .then((data) => {
          if (data.message) {
            addDebateMessage(chatId, iteration.id, data.message);
            const newTotal = nonHumanMessages.length + 1;
            const newProgress = Math.min(100, Math.round((newTotal / targetSlots) * 100));
            updateIteration(chatId, iteration.id, {
              debateProgress: newProgress,
            });
          }
        })
        .catch((err: unknown) => {
          if (err instanceof DOMException && err.name === 'AbortError') {
            return;
          }
          console.error('Deliberation error:', err);
          setError(err instanceof Error ? err.message : 'Deliberation failed');
        })
        .finally(() => {
          inFlightSlotRef.current = null;
        });
    }, delayMs);

    return () => {
      clearTimeout(timer);
      controller.abort();
      inFlightSlotRef.current = null;
    };
  }, [
    chatId,
    iteration.id,
    iteration.status,
    iteration.debates,
    iteration.userQuery,
    iteration.answers,
    iteration.depth,
    iteration.humanGuidance,
    targetSlots,
    patternId,
    agents,
    isPaused,
    geminiApiKey,
    addDebateMessage,
    updateIteration,
  ]);

  const triggerSynthesis = useCallback(async () => {
    if (isSynthesizing) return;
    setIsSynthesizing(true);
    setError(null);

    try {
      const debates = iteration.debates || [];
      const transcript = debates.map((d) => ({
        agentName: d.agentName,
        text: d.text,
        isHuman: d.isHuman,
      }));

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(geminiApiKey ? { 'x-gemini-api-key': geminiApiKey } : {}),
      };

      const res = await fetch('/api/swarm/synthesize', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          prompt: iteration.userQuery,
          patternId,
          calibrationAnswers: iteration.answers,
          transcript,
        }),
      });

      if (!res.ok) throw new Error(`Synthesis failed: ${res.statusText}`);
      const data = (await res.json()) as { answer?: string };

      if (data.answer) {
        setFinalAnswer(chatId, iteration.id, data.answer);
      }
    } catch (err: unknown) {
      console.error('Synthesis error:', err);
      setError(err instanceof Error ? err.message : 'Synthesis failed');
    } finally {
      setIsSynthesizing(false);
    }
  }, [
    chatId,
    iteration.id,
    iteration.userQuery,
    iteration.answers,
    iteration.debates,
    patternId,
    geminiApiKey,
    isSynthesizing,
    setFinalAnswer,
  ]);

  const autoSynthTriggeredRef = useRef<string | null>(null);

  useEffect(() => {
    if (iteration.status !== 'debating' || isPaused || isSynthesizing || iteration.answer) {
      return;
    }

    const debates = iteration.debates || [];
    const nonHumanMessages = debates.filter((d) => !d.isHuman);

    if (nonHumanMessages.length >= targetSlots && autoSynthTriggeredRef.current !== `${chatId}-${iteration.id}`) {
      autoSynthTriggeredRef.current = `${chatId}-${iteration.id}`;
      const timer = setTimeout(() => {
        void triggerSynthesis();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [
    chatId,
    iteration.id,
    iteration.status,
    iteration.debates,
    iteration.answer,
    isPaused,
    isSynthesizing,
    targetSlots,
    triggerSynthesis,
  ]);

  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  const injectGuidance = useCallback(
    (guidanceText: string) => {
      if (!guidanceText.trim()) return;
      injectHumanGuidanceStore(chatId, iteration.id, guidanceText.trim());
      setIsPaused(false);
    },
    [chatId, iteration.id, injectHumanGuidanceStore]
  );

  return {
    isPaused,
    togglePause,
    isSynthesizing,
    isCalibrating,
    triggerSynthesis,
    injectGuidance,
    error,
    activeSpeaker,
  };
}
