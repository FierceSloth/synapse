import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserSettings {
  name: string;
  role: string;
  geminiApiKey: string;
}

export interface SettingsState extends UserSettings {
  isSettingsOpen: boolean;

  openSettings: () => void;
  closeSettings: () => void;
  updateSettings: (partial: Partial<UserSettings>) => void;
  resetSettings: () => void;
}

export const DEFAULT_USER_SETTINGS: UserSettings = {
  name: 'TEST USER',
  role: 'SYNAPSE // SWARM COMMAND',
  geminiApiKey: '',
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_USER_SETTINGS,
      isSettingsOpen: false,

      openSettings: () => set({ isSettingsOpen: true }),
      closeSettings: () => set({ isSettingsOpen: false }),
      updateSettings: (partial) => set((state) => ({ ...state, ...partial })),
      resetSettings: () => set(() => ({ ...DEFAULT_USER_SETTINGS, isSettingsOpen: false })),
    }),
    {
      name: 'synapse_user_settings',
      partialize: (state) => ({
        name: state.name,
        role: state.role,
        geminiApiKey: state.geminiApiKey,
      }),
    }
  )
);
