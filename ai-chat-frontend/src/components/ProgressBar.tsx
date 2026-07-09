interface Props {
  current: number;
  max: number;
}

export default function ProgressBar({ current, max }: Props) {
  const pct = Math.min((current / max) * 100, 100); // cap at 100%
  const remaining = max - current;
  const isNearLimit = remaining <= 5 && remaining > 0;
  const isAtLimit = current >= max;

  return (
    <div className="px-4 py-2.5 border-b border-slate-100 bg-white/80 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-slate-500">Messages used</span>
        <span
          className={`text-xs font-semibold tabular-nums ${
            isAtLimit ? 'text-blue-600' : isNearLimit ? 'text-amber-600' : 'text-slate-600'
          }`}
        >
          {current} / {max}
        </span>
      </div>
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            isNearLimit
              ? 'bg-gradient-to-r from-amber-400 to-orange-500'
              : 'bg-gradient-to-r from-blue-500 to-blue-600'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {isAtLimit && (
        <p className="text-xs text-blue-600 mt-1 font-medium">
          Export available ↓ — chat continues
        </p>
      )}
      {isNearLimit && (
        <p className="text-xs text-amber-600 mt-1 font-medium">
          {remaining} message{remaining !== 1 ? 's' : ''} until export unlocks
        </p>
      )}
    </div>
  );
}
