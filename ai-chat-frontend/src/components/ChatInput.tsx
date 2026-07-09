import { useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export default function ChatInput({ value, onChange, onSend, disabled, placeholder }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea height
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!disabled && value.trim()) onSend();
    }
  };

  const canSend = !disabled && value.trim().length > 0;

  return (
    <div className="px-4 py-3 border-t border-slate-100 bg-white/80 backdrop-blur-sm">
      <div className="flex items-end gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
        <textarea
          ref={textareaRef}
          id="chat-input"
          rows={1}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder ?? 'Message AI assistant…'}
          className="flex-1 resize-none bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none min-h-[24px] max-h-40 leading-relaxed disabled:opacity-50"
        />
        <button
          id="send-btn"
          onClick={() => canSend && onSend()}
          disabled={!canSend}
          aria-label="Send message"
          className={`shrink-0 mb-0.5 w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
            canSend
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 hover:bg-blue-700 active:scale-90'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
      <p className="text-[10px] text-slate-400 mt-1.5 text-center select-none">
        Enter to send · Shift + Enter for new line
      </p>
    </div>
  );
}
