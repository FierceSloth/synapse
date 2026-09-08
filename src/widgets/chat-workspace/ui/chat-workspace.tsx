'use client';

import type { Chat } from '@/entities/chat';

export interface ChatWorkspaceProps {
  chat: Chat;
}

export function ChatWorkspace({ chat }: ChatWorkspaceProps) {
  return (
    <div>
      <div>{chat.title}</div>
      {chat.iterations.map((iteration) => (
        <div key={iteration.id}>
          <p>{iteration.userQuery}</p>
        </div>
      ))}
    </div>
  );
}
