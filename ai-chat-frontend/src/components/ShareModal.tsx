import { useState } from 'react';
import { Copy, Link } from 'lucide-react';

interface Props {
  chatId: string;
  onClose: () => void;
}

export default function ShareModal({ chatId, onClose }: Props) {
  const [copied, setCopied] = useState(false);
const url = `${window.location.origin}/chat/${chatId}`;  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
        <h3 className="text-lg font-semibold mb-2">Share this conversation</h3>
        <p className="text-sm text-slate-500 mb-4">A shareable link has been generated for this chat.</p>

        <div className="flex items-center gap-2">
          <div className="flex-1 px-3 py-2 rounded-md bg-slate-50 border border-slate-100 text-sm truncate">
            {url}
          </div>
          <button
            className="px-3 py-2 bg-blue-600 rounded-md text-white text-sm flex items-center gap-2"
            onClick={handleCopy}
          >
            <Copy className="w-4 h-4" />
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        <div className="mt-4 flex justify-end">
          <button className="text-sm text-slate-600" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
