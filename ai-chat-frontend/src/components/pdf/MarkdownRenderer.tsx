import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeBlock from './CodeBlock';

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="prose prose-slate max-w-none break-words leading-relaxed print:text-slate-800">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            if (!inline && match) {
              return <CodeBlock language={match[1]} value={String(children).replace(/\n$/, '')} />;
            }
            return (
              <code className="bg-slate-100 text-pink-600 px-1.5 py-0.5 rounded-md text-[0.85em] font-mono break-inside-avoid print:bg-slate-100 print:text-pink-600" {...props}>
                {children}
              </code>
            );
          },
          table({ children }) {
            return (
              <div className="my-6 overflow-hidden rounded-xl border border-slate-200 shadow-sm break-inside-avoid print:border-slate-300 w-full">
                <table className="w-full text-sm text-left m-0 print:border-collapse">
                  {children}
                </table>
              </div>
            );
          },
          thead({ children }) {
            return <thead className="bg-slate-50 border-b border-slate-200 print:bg-slate-100">{children}</thead>;
          },
          th({ children }) {
            return <th className="px-4 py-3 font-semibold text-slate-800">{children}</th>;
          },
          td({ children }) {
            return <td className="px-4 py-3 border-b border-slate-100 last:border-0">{children}</td>;
          },
          h1({ children }) { return <h1 className="text-xl font-bold mt-6 mb-4 text-slate-900 break-after-avoid">{children}</h1>; },
          h2({ children }) { return <h2 className="text-lg font-bold mt-6 mb-3 text-slate-900 break-after-avoid">{children}</h2>; },
          h3({ children }) { return <h3 className="text-base font-bold mt-5 mb-2 text-slate-900 break-after-avoid">{children}</h3>; },
          ul({ children }) { return <ul className="list-disc pl-6 my-4 space-y-1 marker:text-slate-400">{children}</ul>; },
          ol({ children }) { return <ol className="list-decimal pl-6 my-4 space-y-1 marker:text-slate-400">{children}</ol>; },
          li({ children }) { return <li className="pl-1 break-inside-avoid">{children}</li>; },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-blue-500 pl-4 py-1 my-4 bg-blue-50/50 italic text-slate-700 rounded-r-lg break-inside-avoid print:bg-blue-50">
                {children}
              </blockquote>
            );
          },
          img({ src, alt }) {
            return <img src={src} alt={alt} className="rounded-xl max-w-full h-auto my-4 shadow-sm border border-slate-200 break-inside-avoid" />;
          },
          p({ children }) { return <p className="mb-4 last:mb-0 break-inside-avoid">{children}</p>; },
          hr() { return <hr className="my-6 border-slate-200" />; }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
