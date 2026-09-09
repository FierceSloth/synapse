'use client';

import styles from './user-message.module.scss';

export interface UserMessageProps {
  query: string;
  timestamp: string;
  userName?: string;
  userInitials?: string;
}

export function UserMessage({ query, timestamp, userName = 'TEST USER', userInitials = 'TU' }: UserMessageProps) {
  return (
    <div className={styles.userMessageRow}>
      <div className={styles.userMessageContent}>
        <div className={styles.userMeta}>
          <span className={styles.userTime}>{timestamp}</span>
          <span className={styles.userName}>{userName}</span>
        </div>
        <div className={styles.userBubble}>{query}</div>
      </div>
      <div className={styles.userAvatar}>{userInitials}</div>
    </div>
  );
}
