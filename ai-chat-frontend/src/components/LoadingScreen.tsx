import { Bot } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
          <Bot className="w-8 h-8 text-white" />
        </div>
        <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full border-2 border-blue-600 flex items-center justify-center">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
        </span>
      </div>
      <div className="text-center">
        <p className="text-slate-700 font-semibold text-base">Starting session…</p>
        <p className="text-slate-400 text-sm mt-1">Connecting to AI assistant</p>
      </div>
    </div>
  );
}
