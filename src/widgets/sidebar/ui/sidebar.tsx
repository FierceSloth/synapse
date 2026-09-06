'use client';

import clsx from 'clsx';
import { Atom as AtomIcon, PlusSquare as PlusSquareIcon, Settings as SettingsIcon } from 'lucide-react';
import { MOCK_SESSIONS, type SessionLog } from '@/entities/session';
import { MOCK_USER, type UserProfile } from '@/entities/user';
import { getInitials } from '@/shared/lib';
import { Button, IconButton } from '@/shared/ui';
import styles from './sidebar.module.scss';

export interface SidebarProps {
  sessions?: SessionLog[];
  activeSessionId?: string;
  onSelectSession?: (id: string) => void;
  onNewSession?: () => void;
  user?: UserProfile;
}

export function Sidebar({
  sessions = MOCK_SESSIONS,
  activeSessionId = 'log-viewer',
  onSelectSession,
  onNewSession,
  user = MOCK_USER,
}: SidebarProps) {
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
        <Button fullWidth variant="cyber" icon={<PlusSquareIcon size={16} />} onClick={onNewSession}>
          INITIALIZE NEURAL SESSION
        </Button>
      </div>

      <div className={styles.archives}>
        <div className={styles.archivesHeader}>
          <div className={styles.archivesTitle}>Session Archives</div>
          <div className={styles.archivesCount}>[{sessions.length} LOGS]</div>
        </div>

        {sessions.map((session) => {
          const isActive = session.id === activeSessionId;
          return (
            <div
              key={session.id}
              className={clsx(styles.logItem, isActive && styles.active)}
              onClick={() => onSelectSession?.(session.id)}
            >
              <div className={styles.logMeta}>
                <span className={styles.logTime}>{session.time}</span>
                {isActive && <span className={styles.activeDot} />}
              </div>
              <div className={styles.logTitle}>{session.title}</div>
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
