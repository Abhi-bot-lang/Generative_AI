export default function TypingIndicator() {
  return (
    <div className="flex items-end gap-3 mb-4">
      {/* Avatar */}
      <div className="w-8 h-8 shrink-0 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-md shadow-blue-500/20">
        <span className="text-white text-xs font-bold select-none">AI</span>
      </div>

      {/* Bubble */}
      <div className="flex items-center gap-1.5 px-4 py-3 bg-white border border-slate-100 rounded-2xl rounded-bl-sm shadow-sm">
        <span className="typing-dot w-2 h-2 rounded-full bg-slate-400" />
        <span className="typing-dot w-2 h-2 rounded-full bg-slate-400" />
        <span className="typing-dot w-2 h-2 rounded-full bg-slate-400" />
      </div>
    </div>
  );
}
