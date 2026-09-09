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

  return (
    <div className={styles.page}>
      <Sidebar />

      <main className={styles.main}>
        <Header currentLabel={currentChat ? currentChat.title : 'NEW_DIRECTIVE'} />
        <div className={clsx(styles.content, currentChat && styles.chatContent)}>
          {currentChatId && currentChat ? <ChatWorkspace chat={currentChat} /> : <NewDirective />}
        </div>
      </main>
    </div>
  );
}
