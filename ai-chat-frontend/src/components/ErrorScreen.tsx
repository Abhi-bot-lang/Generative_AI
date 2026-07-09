import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorScreen({ message, onRetry }: Props) {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-4 px-6">
      <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center">
        <AlertTriangle className="w-8 h-8 text-red-500" />
      </div>
      <div className="text-center max-w-sm">
        <p className="text-slate-800 font-semibold text-base">Something went wrong</p>
        <p className="text-slate-500 text-sm mt-1">
          {message ?? 'Unable to connect. Please check your connection and try again.'}
        </p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 mt-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 active:scale-95 transition-all shadow-md shadow-blue-500/20"
        >
          <RefreshCw className="w-4 h-4" />
          Try again
        </button>
      )}
    </div>
  );
}
