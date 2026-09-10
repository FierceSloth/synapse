'use client';

import { useState, useSyncExternalStore } from 'react';
import clsx from 'clsx';
import {
  Atom as AtomIcon,
  ChevronRight as ChevronRightIcon,
  Key as KeyIcon,
  PlusSquare as PlusSquareIcon,
  Settings as SettingsIcon,
  Trash2 as Trash2Icon,
  X as CloseIcon,
} from 'lucide-react';
import { useChatStore } from '@/entities/chat';
import type { SessionLog } from '@/entities/session';
import { useSettingsStore } from '@/entities/settings';
import { DEFAULT_USER, type UserProfile } from '@/entities/user';
import { getInitials } from '@/shared/lib';
import { Button, IconButton } from '@/shared/ui';
import styles from './sidebar.module.scss';

const emptySubscribe = () => () => {};

export interface SidebarProps {
  sessions?: SessionLog[];
  activeSessionId?: string | null;
  onSelectSession?: (id: string) => void;
  onNewSession?: () => void;
  onDeleteSession?: (id: string) => void;
  user?: UserProfile;
}

export function Sidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  user = DEFAULT_USER,
}: SidebarProps) {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const storeChats = useChatStore((state) => state.chats);
  const storeCurrentChatId = useChatStore((state) => state.currentChatId);
  const storeSelectChat = useChatStore((state) => state.selectChat);
  const storeOpenNewChat = useChatStore((state) => state.openNewChat);
  const storeDeleteChat = useChatStore((state) => state.deleteChat);
  const isMobileSidebarOpen = useChatStore((state) => state.isMobileSidebarOpen);
  const setMobileSidebarOpen = useChatStore((state) => state.setMobileSidebarOpen);

  const settingsName = useSettingsStore((state) => state.name);
  const settingsRole = useSettingsStore((state) => state.role);
  const settingsApiKey = useSettingsStore((state) => state.geminiApiKey);
  const openSettings = useSettingsStore((state) => state.openSettings);

  const [isBannerDismissed, setIsBannerDismissed] = useState(false);
  const hasApiKey = isMounted ? Boolean(settingsApiKey && settingsApiKey.trim().length > 0) : true;

  const effectiveSessions = sessions ?? (isMounted ? storeChats : []);
  const effectiveActiveId = activeSessionId !== undefined ? activeSessionId : isMounted ? storeCurrentChatId : null;
  const handleSelect = onSelectSession ?? storeSelectChat;
  const handleNewSession = onNewSession ?? storeOpenNewChat;
  const handleDelete = onDeleteSession ?? storeDeleteChat;

  const effectiveUserName =
    user?.name && user.name !== DEFAULT_USER.name ? user.name : isMounted ? settingsName : DEFAULT_USER.name;
  const effectiveUserRole =
    user?.role && user.role !== DEFAULT_USER.role ? user.role : isMounted ? settingsRole : DEFAULT_USER.role;
  const avatarInitials = getInitials(effectiveUserName);

  return (
    <aside className={clsx(styles.sidebar, isMobileSidebarOpen && styles.open)}>
      <div className={styles.brand}>
        <div className={styles.brandInfo}>
          <AtomIcon className={styles.logoIcon} size={26} />
          <div>
            <div className={styles.title}>SYNAPSE {`//`} OS</div>
            <div className={styles.subtitle}>Quantum Orchestration</div>
          </div>
        </div>
        <button
          type="button"
          className={styles.closeMobileBtn}
          onClick={() => setMobileSidebarOpen(false)}
          title="Close Navigation Menu"
          aria-label="Close Navigation Menu"
        >
          <CloseIcon size={18} />
        </button>
      </div>

      <div className={styles.initAction}>
        <Button fullWidth variant="cyber" icon={<PlusSquareIcon size={16} />} onClick={handleNewSession}>
          INITIALIZE NEURAL SESSION
        </Button>
      </div>

      <div className={styles.archives}>
        <div className={styles.archivesHeader}>
          <div className={styles.archivesTitle}>Session Archives</div>
          <div className={styles.archivesCount}>[{effectiveSessions.length} LOGS]</div>
        </div>

        {effectiveSessions.map((session) => {
          const isActive = session.id === effectiveActiveId;
          return (
            <div
              key={session.id}
              className={clsx(styles.logItem, isActive && styles.active)}
              onClick={() => handleSelect(session.id)}
            >
              <div className={styles.logMeta}>
                <span className={styles.logTime}>{session.time}</span>
              </div>
              <div className={styles.logTitle}>{session.title}</div>
              <button
                type="button"
                className={styles.deleteBtn}
                title="Delete Session"
                aria-label={`Delete ${session.title}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(session.id);
                }}
              >
                <Trash2Icon size={12} />
              </button>
            </div>
          );
        })}
      </div>

      {!hasApiKey && !isBannerDismissed && (
        <div
          className={styles.keyAlertBanner}
          onClick={openSettings}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              openSettings();
            }
          }}
          aria-label="Connect Gemini API Key in Settings"
        >
          <div className={styles.alertHeader}>
            <div className={styles.alertTag}>
              <span className={styles.alertBeaconWrap}>
                <span className={styles.alertBeaconPing} />
                <span className={styles.alertBeaconDot} />
              </span>
              <KeyIcon size={12} className={styles.alertKeyIcon} />
              <span>API KEY REQUIRED</span>
            </div>
            <button
              type="button"
              className={styles.alertDismissBtn}
              onClick={(e) => {
                e.stopPropagation();
                setIsBannerDismissed(true);
              }}
              title="Dismiss alert"
              aria-label="Dismiss API key alert"
            >
              <CloseIcon size={12} />
            </button>
          </div>

          <p className={styles.alertText}>
            Gemini API key is not connected. Configure your key in Settings to activate the neural swarm.
          </p>

          <div className={styles.alertCtaRow}>
            <span className={styles.alertCta}>
              <span>CONNECT KEY</span>
              <ChevronRightIcon size={12} />
            </span>
          </div>

          <span className={styles.alertPointer} />
        </div>
      )}

      <div className={styles.profile}>
        <div className={styles.avatar}>{avatarInitials}</div>
        <div className={styles.userInfo}>
          <div className={styles.userName}>{effectiveUserName}</div>
          <div className={styles.userRole}>{effectiveUserRole}</div>
        </div>
        <div className={styles.settingsWrapper}>
          <IconButton
            icon={<SettingsIcon size={16} />}
            title="System Settings"
            aria-label="System Settings"
            onClick={openSettings}
          />
          {!hasApiKey && <span className={styles.settingsAlertPulse} title="API Key Required" />}
        </div>
      </div>
    </aside>
  );
}
