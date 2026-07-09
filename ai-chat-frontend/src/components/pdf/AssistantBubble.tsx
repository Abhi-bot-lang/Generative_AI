import React from 'react';
import type { Message } from '../../types';
import { Bot } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';

export default function AssistantBubble({ message }: { message: Message }) {
  return (
    <div className="flex items-start gap-4 flex-row print:flex print:flex-row w-full chat-bubble-card break-inside-avoid">
      <div className="w-10 h-10 shrink-0 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 shadow-sm print:bg-white print:border-slate-200">
        <Bot className="w-5 h-5" />
      </div>
      
      <div className="max-w-[85%] bg-white text-slate-800 p-6 rounded-2xl rounded-tl-sm border border-slate-200 shadow-sm print:bg-white print:border-slate-200 print:shadow-none">
        <MarkdownRenderer content={message.content} />
        <p className="text-xs text-slate-400 mt-4 font-medium">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}
