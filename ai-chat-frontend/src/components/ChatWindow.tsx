import { useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Bot } from 'lucide-react';

import type { Message } from '../types';
import ChatBubble from './ChatBubble';
import TypingIndicator from './TypingIndicator';

interface Props {
  messages: Message[];
  isTyping: boolean;
}

export default function ChatWindow({
  messages = [],
  isTyping,
}: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  }, [messages, isTyping]);

  const showWelcome = messages.length === 0 && !isTyping;

  if (showWelcome) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center shadow-inner">
          <Bot className="w-8 h-8 text-blue-500" />
        </div>

        <div>
          <h2 className="text-slate-700 font-semibold text-base">
            How can I help you today?
          </h2>

          <p className="text-slate-400 text-sm mt-1 max-w-xs">
            Ask me anything — I can explain concepts, write code,
            draft text, summarize documents, and more.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 w-full max-w-xs mt-2">
          {[
            'Explain a concept',
            'Write some code',
            'Summarize text',
            'Suggest ideas',
          ].map((hint) => (
            <div
              key={hint}
              className="px-3 py-2.5 rounded-xl bg-white border border-slate-100 shadow-sm text-xs text-slate-600 text-center hover:border-blue-200 hover:bg-blue-50/50 transition-colors"
            >
              {hint}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      id="chat-window"
      className="flex-1 overflow-y-auto px-4 pt-4 pb-2"
    >
      <AnimatePresence initial={false}>
        {messages.map((message, index) => (
          <ChatBubble
            key={message.id ?? `${message.role}-${index}`}
            message={message}
          />
        ))}
      </AnimatePresence>

      {isTyping && <TypingIndicator />}

      <div ref={bottomRef} />
    </div>
  );
}