import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PatternId } from '@/entities/pattern';
import { INITIAL_CHATS } from './mocks';
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
  selectedPatternId: PatternId;

  setSelectedPatternId: (patternId: PatternId) => void;
  selectChat: (chatId: string) => void;
  openNewChat: () => void;
  deleteChat: (chatId: string) => void;
  createChat: (prompt: string, patternId?: PatternId) => string;
  addIteration: (chatId: string, userQuery: string) => string;
  updateIteration: (chatId: string, iterationId: string, patch: Partial<ChatIteration>) => void;
  addDebateMessage: (chatId: string, iterationId: string, message: AgentDebateMessage) => void;
  setFinalAnswer: (chatId: string, iterationId: string, answer: FinalAnswer) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      chats: INITIAL_CHATS,
      currentChatId: null,
      selectedPatternId: 'fullstack-architecture',

      setSelectedPatternId: (patternId: PatternId) => {
        set({ selectedPatternId: patternId });
      },

      selectChat: (chatId: string) => {
        set({ currentChatId: chatId });
      },

      openNewChat: () => {
        set({ currentChatId: null });
      },

      deleteChat: (chatId: string) => {
        set((state) => ({
          chats: state.chats.filter((c) => c.id !== chatId),
          currentChatId: state.currentChatId === chatId ? null : state.currentChatId,
        }));
      },

      createChat: (prompt: string, patternId?: PatternId) => {
        const time = getCurrentTimeString();
        const newChatId = `chat-${Date.now()}`;
        const newIterationId = `iter-${Date.now()}`;
        const resolvedPattern = patternId ?? get().selectedPatternId;

        const firstIteration: ChatIteration = {
          id: newIterationId,
          userQuery: prompt,
          timestamp: time,
          status: 'calibration',
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
        }));

        return newChatId;
      },

      addIteration: (chatId: string, userQuery: string) => {
        const time = getCurrentTimeString();
        const newIterationId = `iter-${Date.now()}`;

        const newIteration: ChatIteration = {
          id: newIterationId,
          userQuery,
          timestamp: time,
          status: 'calibration',
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
