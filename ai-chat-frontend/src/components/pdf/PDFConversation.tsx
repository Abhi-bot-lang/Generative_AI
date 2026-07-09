import React, { forwardRef } from 'react';
import type { Message } from '../../types';
import PDFHeader from './PDFHeader';
import PDFFooter from './PDFFooter';
import UserBubble from './UserBubble';
import AssistantBubble from './AssistantBubble';
import './print.css';

interface Props {
  messages: Message[];
  title?: string;
  chatId?: string;
}

export const PDFConversation = forwardRef<HTMLDivElement, Props>(
  ({ messages, title = 'Conversation Export', chatId }, ref) => {
    return (
      <div 
        ref={ref} 
        id="pdf-render-root"
        className="pdf-print-only w-full bg-slate-50 min-h-screen text-slate-900 font-sans print:bg-slate-50 print:block"
      >
        <PDFHeader title={title} chatId={chatId} />
        
        <div className="flex flex-col gap-6 pt-6 pb-20 px-8 print:flex print:flex-col">
          {messages.map((message) => (
            <div key={message.id} className="w-full break-inside-avoid print:block">
              {message.role === 'user' ? (
                <UserBubble message={message} />
              ) : (
                <AssistantBubble message={message} />
              )}
            </div>
          ))}
        </div>

        <PDFFooter />
      </div>
    );
  }
);

PDFConversation.displayName = 'PDFConversation';
