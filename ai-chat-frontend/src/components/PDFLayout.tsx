import React, { forwardRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Bot, User } from 'lucide-react';
import type { Message } from '../types';

interface Props {
  messages: Message[];
  chatId?: string;
}

const PDFLayout = forwardRef<HTMLDivElement, Props>(({ messages, chatId }, ref) => {
  return (
    <div
      ref={ref}
      id="pdf-layout-container"
      className="absolute -left-[9999px] top-0 w-[800px] bg-slate-50 p-8 flex flex-col gap-6"
    >
      <div className="pdf-block text-center mb-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-800">Conversation Export</h1>
        <p className="text-sm text-slate-500 mt-1">
          {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
        </p>
        {chatId && <p className="text-xs text-slate-400 mt-2">ID: {chatId}</p>}
      </div>

      {messages.map((message) => {
        const isUser = message.role === 'user';
        return (
          <div
            key={message.id}
            className={`pdf-block flex items-start gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center shadow-sm text-white ${
              isUser ? 'bg-slate-700' : 'bg-gradient-to-br from-blue-500 to-blue-700'
            }`}>
              {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
            </div>
            
            <div className={`flex-1 p-5 rounded-2xl text-sm leading-relaxed shadow-sm ${
              isUser
                ? 'bg-blue-600 text-white rounded-tr-sm'
                : 'bg-white text-slate-800 border border-slate-200 rounded-tl-sm'
            }`}>
               {isUser ? (
                  <p className="whitespace-pre-wrap break-words text-base">{message.content}</p>
                ) : (
                  <div className="prose prose-sm max-w-none break-words">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                )}
                
                <p className={`text-[11px] mt-3 select-none ${isUser ? 'text-blue-200 text-right' : 'text-slate-400'}`}>
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
            </div>
          </div>
        );
      })}
    </div>
  );
});

PDFLayout.displayName = 'PDFLayout';
export default PDFLayout;
