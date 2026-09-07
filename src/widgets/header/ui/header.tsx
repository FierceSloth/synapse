'use client';

import { Folder as FolderIcon } from 'lucide-react';
import styles from './header.module.scss';

export interface HeaderProps {
  rootLabel?: string;
  currentLabel?: string;
}

export function Header({ rootLabel = 'SYS_ROOT', currentLabel = 'NEW_DIRECTIVE' }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.breadcrumbs}>
        <FolderIcon className={styles.folderIcon} size={12} />
        <span className={styles.crumbLink}>{rootLabel}</span>
        <span className={styles.separator}>/</span>
        <span className={styles.currentCrumb}>{currentLabel}</span>
      </div>

      <div className={styles.telemetry}>
        <div className={styles.equalizer} title="Neural Link Telemetry Active">
          <span className={styles.bar} />
          <span className={styles.bar} />
          <span className={styles.bar} />
          <span className={styles.bar} />
          <span className={styles.bar} />
          <span className={styles.bar} />
        </div>
      </div>
    </header>
  );
}
