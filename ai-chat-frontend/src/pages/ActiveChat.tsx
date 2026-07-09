import { useState, useCallback, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { toast } from 'sonner';
import { nanoid } from 'nanoid';
import { startSession, sendMessage, finishChatWithLink } from '../api/chat';
import { createShare } from '../api/shared';
import type { Message, AppStatus } from '../types';

import ChatHeader from '../components/ChatHeader';
import ChatWindow from '../components/ChatWindow';
import ChatInput from '../components/ChatInput';
import ProgressBar from '../components/ProgressBar';
import EmailForm from '../components/EmailForm';
import LoadingScreen from '../components/LoadingScreen';
import ErrorScreen from '../components/ErrorScreen';
import ShareModal from '../components/ShareModal';
import { PDFConversation } from '../components/pdf/PDFConversation';

const MAX_MESSAGES = 5;

export default function ActiveChat() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<AppStatus>('loading');
  const [isTyping, setIsTyping] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [isLimitReached, setIsLimitReached] = useState(false); // show export banner
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailDone, setEmailDone] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | undefined>(undefined);
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const [shareId, setShareId] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  const chatRef = useRef<HTMLDivElement>(null);

  const initSession = useCallback(async () => {
    setStatus('loading');
    setMessages([]);
    setMessageCount(0);
    setIsLimitReached(false);
    setEmailDone(false);
    setInput('');
    try {
      const res = await startSession();
      setSessionId(res.session_id);
      setStatus('chatting');
    } catch {
      setErrorMsg('Failed to connect to the server.');
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    initSession();
  }, [initSession]);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || !sessionId || status !== 'chatting' || isTyping) return;

    const userMsg: Message = {
      id: nanoid(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await sendMessage(sessionId, text);
      const aiMsg: Message = {
        id: nanoid(),
        role: 'assistant',
        content: res.reply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setMessageCount((c) => c + 1);

      if (res.limit_reached) {
        setIsLimitReached(true);
      }
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsTyping(false);
    }
  }, [input, sessionId, status, isTyping]);

  // Create share link when messageCount reaches exactly MAX_MESSAGES
  useEffect(() => {
    if (messageCount === MAX_MESSAGES && sessionId) {
      (async () => {
        try {
          const res = await createShare(sessionId);
          setShareId(res.chat_id);
          setShowShareModal(true);
        } catch (err) {
          toast.error('Failed to create shareable link.');
        }
      })();
    }
  }, [messageCount, sessionId]);

  const handleEmailSubmit = useCallback(
    async (email: string) => {
      if (!sessionId) return;
      setIsSendingEmail(true);
      try {
        const res = await finishChatWithLink(sessionId, email);
        if (res.success) {
          setEmailDone(true);
          setStatus('exported');
          toast.success('Share link sent! Check your inbox.');
        } else {
          toast.error(res.message ?? 'Something went wrong.');
        }
      } catch (err: unknown) {
        const detail =
          (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail;
        toast.error(detail ?? 'Failed to send link. Please try again.');
      } finally {
        setIsSendingEmail(false);
      }
    },
    [sessionId]
  );

  const pdfRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = useReactToPrint({
    contentRef: pdfRef,
    documentTitle: `AI_Chat_${new Date().toISOString().split('T')[0]}`,
    onBeforePrint: () => setIsExportingPDF(true),
    onAfterPrint: () => setIsExportingPDF(false),
  });

  if (status === 'loading') {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="w-full max-w-md h-[90vh] max-h-[700px] rounded-3xl bg-white shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
          <LoadingScreen />
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="w-full max-w-md h-[90vh] max-h-[700px] rounded-3xl bg-white shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
          <ErrorScreen message={errorMsg} onRetry={initSession} />
        </div>
      </div>
    );
  }

  const inputDisabled = isTyping || status === 'exported';

  return (
    <div className="h-screen flex items-center justify-center bg-slate-50 p-4">
      <div 
        ref={chatRef}
        className="w-full max-w-md h-full max-h-[780px] rounded-3xl bg-white shadow-2xl shadow-slate-200/70 border border-slate-100 overflow-hidden flex flex-col relative"
      >

        <ChatHeader 
          onExportPDF={messages.length > 0 ? handleExportPDF : undefined}
          isExporting={isExportingPDF}
        />

        <ProgressBar current={messageCount} max={MAX_MESSAGES} />

        <ChatWindow messages={messages} isTyping={isTyping} />

        {isLimitReached && (
          <EmailForm
            onSubmit={handleEmailSubmit}
            isSending={isSendingEmail}
            isDone={emailDone}
          />
        )}

        <ChatInput
          value={input}
          onChange={setInput}
          onSend={handleSend}
          disabled={inputDisabled}
          placeholder={
            status === 'exported'
              ? 'Session ended — transcript sent to your email'
              : isTyping
              ? 'AI is typing…'
              : 'Message AI assistant…'
          }
        />

        {showShareModal && shareId && (
          <ShareModal
            chatId={shareId}
            onClose={() => setShowShareModal(false)}
          />
        )}

        {/* Hidden Print Layout */}
        <PDFConversation ref={pdfRef} messages={messages} title="Chat Export" />
      </div>
    </div>
  );
}
