import React from 'react';
import type { Message } from '../../types';
import { User } from 'lucide-react';

export default function UserBubble({ message }: { message: Message }) {
  return (
    <div className="flex items-start gap-4 flex-row-reverse print:flex print:flex-row-reverse w-full chat-bubble-card break-inside-avoid">
      <div className="w-10 h-10 shrink-0 rounded-xl bg-slate-700 flex items-center justify-center text-white shadow-sm print:bg-slate-700 print:text-white print:border-none print:shadow-none">
        <User className="w-5 h-5" />
      </div>
      
      <div className="max-w-[75%] bg-blue-600 text-white p-5 rounded-2xl rounded-tr-sm shadow-sm print:bg-blue-600 print:text-white print:border-none">
        <p className="whitespace-pre-wrap break-words text-base leading-relaxed font-medium">
          {message.content}
        </p>
        <p className="text-xs text-blue-200 text-right mt-2 font-medium">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}
