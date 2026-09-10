'use client';

import clsx from 'clsx';
import { useChatStore } from '@/entities/chat';
import { ChatWorkspace } from '@/widgets/chat-workspace';
import { Header } from '@/widgets/header';
import { NewDirective } from '@/widgets/new-directive';
import { Sidebar } from '@/widgets/sidebar';
import styles from './workspace-page.module.scss';

export function WorkspacePage() {
  const currentChatId = useChatStore((state) => state.currentChatId);
  const currentChat = useChatStore((state) => state.chats.find((c) => c.id === currentChatId));
  const draftPrompt = useChatStore((state) => state.draftPrompt);

  const screenKey = currentChat ? currentChat.id : 'new-directive';

  return (
    <div className={styles.page}>
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
    </div>
  );
}
