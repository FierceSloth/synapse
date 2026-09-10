'use client';

import { useChatStore } from '@/entities/chat';
import { SettingsModal } from '@/features/settings-modal';
import { ChatWorkspace } from '@/widgets/chat-workspace';
import { Header } from '@/widgets/header';
import { NewDirective } from '@/widgets/new-directive';
import { Sidebar } from '@/widgets/sidebar';
import clsx from 'clsx';
import { useEffect } from 'react';
import styles from './workspace-page.module.scss';

export function WorkspacePage() {
  const currentChatId = useChatStore((state) => state.currentChatId);
  const currentChat = useChatStore((state) => state.chats.find((c) => c.id === currentChatId));
  const draftPrompt = useChatStore((state) => state.draftPrompt);
  const isMobileSidebarOpen = useChatStore((state) => state.isMobileSidebarOpen);
  const setMobileSidebarOpen = useChatStore((state) => state.setMobileSidebarOpen);

  useEffect(() => {
    if (!isMobileSidebarOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileSidebarOpen, setMobileSidebarOpen]);

  const screenKey = currentChat ? currentChat.id : 'new-directive';

  return (
    <div className={styles.page}>
      {isMobileSidebarOpen && (
        <div className={styles.backdrop} onClick={() => setMobileSidebarOpen(false)} aria-hidden="true" />
      )}
      <Sidebar />

      <main className={styles.main}>
        <Header currentLabel={currentChat ? currentChat.title : 'NEW_DIRECTIVE'} />
        <div className={clsx(styles.content, currentChat && styles.chatContent)}>
          <div key={screenKey} className={styles.screenTransitionWrapper}>
            {currentChatId && currentChat ? (
              <ChatWorkspace chat={currentChat} />
            ) : (
              <NewDirective initialPrompt={draftPrompt} />
            )}
          </div>
        </div>
      </main>

      <SettingsModal />
    </div>
  );
}
