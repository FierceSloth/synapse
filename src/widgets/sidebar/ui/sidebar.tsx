'use client';

import { useSyncExternalStore } from 'react';
import clsx from 'clsx';
import {
  Atom as AtomIcon,
  PlusSquare as PlusSquareIcon,
  Settings as SettingsIcon,
  Trash2 as Trash2Icon,
} from 'lucide-react';
import { useChatStore } from '@/entities/chat';
import type { SessionLog } from '@/entities/session';
import { MOCK_USER, type UserProfile } from '@/entities/user';
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
  user = MOCK_USER,
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

  const effectiveSessions = sessions ?? (isMounted ? storeChats : []);
  const effectiveActiveId = activeSessionId !== undefined ? activeSessionId : isMounted ? storeCurrentChatId : null;
  const handleSelect = onSelectSession ?? storeSelectChat;
  const handleNewSession = onNewSession ?? storeOpenNewChat;
  const handleDelete = onDeleteSession ?? storeDeleteChat;

  const avatarInitials = getInitials(user.name);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <div className={styles.brandInfo}>
          <AtomIcon className={styles.logoIcon} size={26} />
          <div>
            <div className={styles.title}>SYNAPSE {`//`} OS</div>
            <div className={styles.subtitle}>Quantum Orchestration</div>
          </div>
        </div>
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

      <div className={styles.profile}>
        <div className={styles.avatar}>{avatarInitials}</div>
        <div className={styles.userInfo}>
          <div className={styles.userName}>{user.name}</div>
          <div className={styles.userRole}>{user.role}</div>
        </div>
        <IconButton icon={<SettingsIcon size={16} />} title="System Settings" aria-label="System Settings" />
      </div>
    </aside>
  );
}
