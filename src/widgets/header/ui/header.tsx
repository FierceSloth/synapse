'use client';

import { useSyncExternalStore } from 'react';
import { useChatStore } from '@/entities/chat';
import { useSettingsStore } from '@/entities/settings';
import { IconButton } from '@/shared/ui';
import { Folder as FolderIcon, Key as KeyIcon, Menu as MenuIcon } from 'lucide-react';
import styles from './header.module.scss';

const emptySubscribe = () => () => {};

export interface HeaderProps {
  rootLabel?: string;
  currentLabel?: string;
}

export function Header({ rootLabel = 'SYS_ROOT', currentLabel = 'NEW_DIRECTIVE' }: HeaderProps) {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const toggleMobileSidebar = useChatStore((state) => state.toggleMobileSidebar);
  const settingsApiKey = useSettingsStore((state) => state.geminiApiKey);
  const openSettings = useSettingsStore((state) => state.openSettings);

  const hasApiKey = isMounted ? Boolean(settingsApiKey && settingsApiKey.trim().length > 0) : true;

  return (
    <header className={styles.header}>
      <div className={styles.leftNav}>
        <div className={styles.burgerWrapper}>
          <IconButton
            icon={<MenuIcon size={18} />}
            onClick={toggleMobileSidebar}
            className={styles.burgerBtn}
            title="Toggle Navigation Menu"
            aria-label="Toggle Navigation Menu"
          />
          {!hasApiKey && <span className={styles.burgerAlertDot} title="API Key Required" />}
        </div>

        {!hasApiKey && (
          <button
            type="button"
            className={styles.mobileKeyBanner}
            onClick={openSettings}
            title="Gemini API Key Required. Tap to open Settings."
            aria-label="Gemini API Key Required"
          >
            <span className={styles.beaconWrap}>
              <span className={styles.beaconPing} />
              <span className={styles.beaconDot} />
            </span>
            <KeyIcon size={12} className={styles.keyIcon} />
            <span className={styles.bannerText}>API KEY REQUIRED</span>
          </button>
        )}

        <div className={styles.breadcrumbs}>
          <FolderIcon className={styles.folderIcon} size={12} />
          <span className={styles.crumbLink}>{rootLabel}</span>
          <span className={styles.separator}>/</span>
          <span className={styles.currentCrumb}>{currentLabel}</span>
        </div>
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
