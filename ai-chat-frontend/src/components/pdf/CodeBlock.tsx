import React from 'react';

export default function CodeBlock({ language, value }: { language: string; value: string }) {
  return (
    <div className="my-6 rounded-xl overflow-hidden bg-slate-900 border border-slate-700 shadow-sm break-inside-avoid print:bg-slate-900 print:border-slate-700">
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800/80 border-b border-slate-700 print:bg-slate-800">
        <span className="text-xs font-mono text-slate-300 uppercase tracking-wider font-semibold">
          {language || 'text'}
        </span>
      </div>
      <div className="p-5 overflow-x-auto print:overflow-visible">
        <pre className="text-[13px] leading-relaxed text-slate-50 font-mono whitespace-pre-wrap break-all m-0 p-0 print:whitespace-pre-wrap print:break-all">
          <code>{value}</code>
        </pre>
      </div>
    </div>
  );
}
