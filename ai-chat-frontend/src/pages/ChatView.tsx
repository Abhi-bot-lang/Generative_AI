import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { nanoid } from 'nanoid';

import ChatHeader from '../components/ChatHeader';
import ChatWindow from '../components/ChatWindow';
import LoadingScreen from '../components/LoadingScreen';
import ErrorScreen from '../components/ErrorScreen';

import { getSharedChat } from '../api/shared';
import type { Message } from '../types';

export default function ChatView() {
  const { chatId } = useParams<{ chatId: string }>();

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!chatId) {
      setError('Invalid chat ID.');
      setLoading(false);
      return;
    }

    const loadChat = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getSharedChat(chatId);

        const mapped: Message[] = (data.messages ?? []).map(
          (message: {
            role: 'user' | 'assistant';
            content: string;
          }) => ({
            id: nanoid(),
            role: message.role,
            content: message.content,
            timestamp: new Date(),
          })
        );

        setMessages(mapped);
      } catch (error: unknown) {
        console.error(error);

        const status =
          (error as {
            response?: {
              status?: number;
            };
          }).response?.status;

        if (status === 404) {
          setError('Chat history not found.');
        } else if (status === 500) {
          setError('Internal server error.');
        } else {
          setError('Unable to load the shared chat.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadChat();
  }, [chatId]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="w-full max-w-md h-[90vh] max-h-[700px] rounded-3xl bg-white shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
          <LoadingScreen />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="w-full max-w-md h-full max-h-[780px] rounded-3xl bg-white shadow-2xl shadow-slate-200/70 border border-slate-100 overflow-hidden flex flex-col">
          <ChatHeader title="Shared Chat" />

          <ErrorScreen
            message={error}
            onRetry={() => window.location.reload()}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md h-full max-h-[780px] rounded-3xl bg-white shadow-2xl shadow-slate-200/70 border border-slate-100 overflow-hidden flex flex-col">
        <ChatHeader title="Shared Chat" />

        <div className="px-4 py-3 border-b border-slate-100 bg-yellow-50 text-sm text-yellow-800">
          You are viewing a shared chat history.
        </div>

        <ChatWindow
          messages={messages}
          isTyping={false}
        />
      </div>
    </div>
  );
}