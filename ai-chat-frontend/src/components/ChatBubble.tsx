import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import type { Message } from '../types';

interface Props {
  message: Message;
}

const bubbleVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.25, ease: 'easeOut' } },
};

export default function ChatBubble({ message }: Props) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      variants={bubbleVariants}
      initial="hidden"
      animate="visible"
      className={`flex items-end gap-3 mb-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div
        className={`w-8 h-8 shrink-0 rounded-xl flex items-center justify-center shadow-md text-xs font-bold select-none ${
          isUser
            ? 'bg-slate-700 text-white shadow-slate-700/20'
            : 'bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-blue-500/20'
        }`}
      >
        {isUser ? 'You' : 'AI'}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-sm'
            : 'bg-white text-slate-800 border border-slate-100 rounded-bl-sm'
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        ) : (
          <div className="prose prose-sm max-w-none break-words">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}

        {/* Timestamp */}
        <p
          className={`text-[10px] mt-1.5 select-none ${
            isUser ? 'text-blue-200 text-right' : 'text-slate-400'
          }`}
        >
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </motion.div>
  );
}
