import { Bot, Sparkles, Download } from 'lucide-react';

interface Props {
  title?: string;
  onExportPDF?: () => void;
  isExporting?: boolean;
}

export default function ChatHeader({ title, onExportPDF, isExporting }: Props) {
  return (
    <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 bg-white/90 backdrop-blur-sm shrink-0">
      {/* Logo */}
      <div className="relative">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/30">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white" />
      </div>

      {/* Name + status */}
      <div className="flex-1 min-w-0">
        <h1 className="text-sm font-semibold text-slate-900 leading-tight truncate">
          {title ?? 'AI Assistant'}
        </h1>
        <p className="text-xs text-emerald-500 font-medium flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
          Online
        </p>
      </div>

      {/* Badge or Export */}
      {onExportPDF ? (
        <button
          onClick={onExportPDF}
          disabled={isExporting}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors disabled:opacity-50"
          title="Download PDF"
        >
          <Download className="w-3.5 h-3.5" />
          {isExporting ? 'Exporting...' : 'PDF'}
        </button>
      ) : (
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-medium">
          <Sparkles className="w-3 h-3" />
          AI
        </div>
      )}
    </div>
  );
}
