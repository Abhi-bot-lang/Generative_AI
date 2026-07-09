import React from 'react';
import { Bot } from 'lucide-react';

interface Props {
  title: string;
  chatId?: string;
}

export default function PDFHeader({ title, chatId }: Props) {
  return (
    <div className="flex items-center justify-between pb-6 pt-8 px-8 border-b border-slate-200 mb-6 break-inside-avoid print:flex message-header bg-white shadow-sm rounded-b-2xl">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white shadow-sm">
          <Bot className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{title}</h1>
          <p className="text-sm text-slate-500 font-medium">AI Assistant</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold text-slate-800">Exported On</p>
        <p className="text-sm text-slate-500 font-medium">{new Date().toLocaleString()}</p>
        {chatId && <p className="text-xs text-slate-400 mt-1">ID: {chatId}</p>}
      </div>
    </div>
  );
}
