import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle2, Download } from 'lucide-react';

interface Props {
  onSubmit: (email: string) => Promise<void>;
  isSending: boolean;
  isDone: boolean;
}

export default function EmailForm({
  onSubmit,
  isSending,
  isDone,
}: Props) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const value = email.trim();

    setError('');

    if (!value) {
      setError('Email is required.');
      return;
    }

    if (!validateEmail(value)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      await onSubmit(value);
    } catch (err) {
      console.error(err);
      setError('Failed to send PDF. Please try again.');
    }
  };

  // Success State
  if (isDone) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mx-4 my-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 flex items-center gap-3"
      >
        <div className="w-9 h-9 shrink-0 rounded-xl bg-emerald-500 flex items-center justify-center shadow-sm shadow-emerald-500/30">
          <CheckCircle2 className="w-5 h-5 text-white" />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800">
            Transcript sent!
          </p>

          <p className="text-xs text-slate-500 truncate">
            PDF delivered to{' '}
            <span className="font-medium text-slate-700">
              {email}
            </span>
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="mx-4 my-3 rounded-2xl border border-blue-100 bg-blue-50/60 p-4"
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm shadow-blue-500/30">
          <Download className="w-4 h-4 text-white" />
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-800">
            Export your conversation
          </p>

          <p className="text-xs text-slate-500">
            Get the full chat as a PDF — your chat continues
          </p>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2.5"
        noValidate
      >
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />

            <input
              id="email-input"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              placeholder="your@email.com"
              disabled={isSending}
              className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all disabled:opacity-50"
            />
          </div>

          <button
            id="send-transcript-btn"
            type="submit"
            disabled={isSending || !email.trim()}
            className="shrink-0 flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 active:scale-95 transition-all shadow-md shadow-blue-500/20 disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isSending ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                Send PDF
              </>
            )}
          </button>
        </div>

        {error && (
          <p className="text-sm text-red-600">
            {error}
          </p>
        )}
      </form>
    </motion.div>
  );
}