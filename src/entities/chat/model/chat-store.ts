import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PatternId } from '@/entities/pattern';
import type { AgentDebateMessage, Chat, ChatIteration, FinalAnswer } from './types';

function getCurrentTimeString(): string {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

export interface ChatState {
  chats: Chat[];
  currentChatId: string | null;
  draftPrompt: string;
  selectedPatternId: PatternId;
  isMobileSidebarOpen: boolean;

  setSelectedPatternId: (patternId: PatternId) => void;
  setDraftPrompt: (prompt: string) => void;
  setMobileSidebarOpen: (open: boolean) => void;
  toggleMobileSidebar: () => void;
  selectChat: (chatId: string) => void;
  openNewChat: () => void;
  deleteChat: (chatId: string) => void;
  cancelActiveIteration: (chatId: string) => string;
  createChat: (prompt: string, patternId?: PatternId, depth?: number) => string;
  addIteration: (chatId: string, userQuery: string, depth?: number) => string;
  updateIteration: (chatId: string, iterationId: string, patch: Partial<ChatIteration>) => void;
  addDebateMessage: (chatId: string, iterationId: string, message: AgentDebateMessage) => void;
  setActiveSpeaker: (
    chatId: string,
    iterationId: string,
    speaker: { slotIndex: number; agentName: string; stageName?: string } | null
  ) => void;
  injectHumanGuidance: (chatId: string, iterationId: string, text: string) => void;
  setFinalAnswer: (chatId: string, iterationId: string, answer: FinalAnswer) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      chats: [],
      currentChatId: null,
      draftPrompt: '',
      selectedPatternId: 'fullstack-architecture',
      isMobileSidebarOpen: false,

      setSelectedPatternId: (patternId: PatternId) => {
        set({ selectedPatternId: patternId });
      },

      setDraftPrompt: (prompt: string) => {
        set({ draftPrompt: prompt });
      },

      setMobileSidebarOpen: (open: boolean) => {
        set({ isMobileSidebarOpen: open });
      },

      toggleMobileSidebar: () => {
        set((state) => ({ isMobileSidebarOpen: !state.isMobileSidebarOpen }));
      },

      selectChat: (chatId: string) => {
        set({ currentChatId: chatId, isMobileSidebarOpen: false });
      },

      openNewChat: () => {
        set({ currentChatId: null, draftPrompt: '', isMobileSidebarOpen: false });
      },

      deleteChat: (chatId: string) => {
        set((state) => ({
          chats: state.chats.filter((c) => c.id !== chatId),
          currentChatId: state.currentChatId === chatId ? null : state.currentChatId,
        }));
      },

      cancelActiveIteration: (chatId: string) => {
        const state = get();
        const chat = state.chats.find((c) => c.id === chatId);
        if (!chat) return '';

        const iterations = chat.iterations;
        const lastIteration = iterations[iterations.length - 1];
        const cancelledPrompt = lastIteration?.userQuery || '';

        if (iterations.length <= 1) {
          set({
            chats: state.chats.filter((c) => c.id !== chatId),
            currentChatId: null,
            draftPrompt: cancelledPrompt,
          });
        } else {
          set({
            chats: state.chats.map((c) => {
              if (c.id !== chatId) return c;
              return {
                ...c,
                iterations: c.iterations.slice(0, -1),
              };
            }),
            draftPrompt: cancelledPrompt,
          });
        }

        return cancelledPrompt;
      },

      createChat: (prompt: string, patternId?: PatternId, depth = 5) => {
        const time = getCurrentTimeString();
        const newChatId = `chat-${Date.now()}`;
        const newIterationId = `iter-${Date.now()}`;
        const resolvedPattern = patternId ?? get().selectedPatternId;

        const firstIteration: ChatIteration = {
          id: newIterationId,
          userQuery: prompt,
          timestamp: time,
          status: 'calibration',
          depth,
          debates: [],
          debateProgress: 0,
        };

        const newChat: Chat = {
          id: newChatId,
          title: prompt.length > 32 ? `${prompt.slice(0, 32).trim()}...` : prompt,
          time,
          patternId: resolvedPattern,
          iterations: [firstIteration],
        };

        set((state) => ({
          chats: [newChat, ...state.chats],
          currentChatId: newChatId,
          draftPrompt: '',
          isMobileSidebarOpen: false,
        }));

        return newChatId;
      },

      addIteration: (chatId: string, userQuery: string, depth = 5) => {
        const time = getCurrentTimeString();
        const newIterationId = `iter-${Date.now()}`;

        const newIteration: ChatIteration = {
          id: newIterationId,
          userQuery,
          timestamp: time,
          status: 'calibration',
          depth,
          debates: [],
          debateProgress: 0,
        };

        set((state) => ({
          chats: state.chats.map((chat) => {
            if (chat.id !== chatId) return chat;
            return {
              ...chat,
              iterations: [...chat.iterations, newIteration],
            };
          }),
        }));

        return newIterationId;
      },

      updateIteration: (chatId: string, iterationId: string, patch: Partial<ChatIteration>) => {
        set((state) => ({
          chats: state.chats.map((chat) => {
            if (chat.id !== chatId) return chat;
            return {
              ...chat,
              iterations: chat.iterations.map((iter) => {
                if (iter.id !== iterationId) return iter;
                return { ...iter, ...patch };
              }),
            };
          }),
        }));
      },

      addDebateMessage: (chatId: string, iterationId: string, message: AgentDebateMessage) => {
        set((state) => ({
          chats: state.chats.map((chat) => {
            if (chat.id !== chatId) return chat;
            return {
              ...chat,
              iterations: chat.iterations.map((iter) => {
                if (iter.id !== iterationId) return iter;
                const debates = iter.debates ? [...iter.debates, message] : [message];
                return { ...iter, debates };
              }),
            };
          }),
        }));
      },

      setActiveSpeaker: (
        chatId: string,
        iterationId: string,
        speaker: { slotIndex: number; agentName: string; stageName?: string } | null
      ) => {
        set((state) => ({
          chats: state.chats.map((chat) => {
            if (chat.id !== chatId) return chat;
            return {
              ...chat,
              iterations: chat.iterations.map((iter) => {
                if (iter.id !== iterationId) return iter;
                if (
                  iter.activeSpeaker?.slotIndex === speaker?.slotIndex &&
                  iter.activeSpeaker?.agentName === speaker?.agentName &&
                  iter.activeSpeaker?.stageName === speaker?.stageName
                ) {
                  return iter;
                }
                return { ...iter, activeSpeaker: speaker };
              }),
            };
          }),
        }));
      },

      injectHumanGuidance: (chatId: string, iterationId: string, text: string) => {
        const time = getCurrentTimeString();
        const humanMessage: AgentDebateMessage = {
          slotIndex: 0,
          agentName: 'HUMAN OPERATOR',
          text: `"${text}"`,
          time,
          isHuman: true,
        };

        set((state) => ({
          chats: state.chats.map((chat) => {
            if (chat.id !== chatId) return chat;
            return {
              ...chat,
              iterations: chat.iterations.map((iter) => {
                if (iter.id !== iterationId) return iter;
                const debates = iter.debates ? [...iter.debates, humanMessage] : [humanMessage];
                return {
                  ...iter,
                  debates,
                  humanGuidance: text,
                };
              }),
            };
          }),
        }));
      },

      setFinalAnswer: (chatId: string, iterationId: string, answer: FinalAnswer) => {
        set((state) => ({
          chats: state.chats.map((chat) => {
            if (chat.id !== chatId) return chat;
            return {
              ...chat,
              iterations: chat.iterations.map((iter) => {
                if (iter.id !== iterationId) return iter;
                return {
                  ...iter,
                  status: 'completed',
                  answer,
                };
              }),
            };
          }),
        }));
      },
    }),
    {
      name: 'synapse-chats-storage',
      partialize: (state) => ({
        chats: state.chats,
      }),
    }
  )
);
