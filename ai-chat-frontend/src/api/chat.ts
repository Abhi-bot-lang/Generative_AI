import axios from 'axios';
import type {
  ChatResponse,
  FinishChatResponse,
  SessionResponse,
} from '../types';

const api = axios.create({
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const startSession = async (): Promise<SessionResponse> => {
  const { data } = await api.post<SessionResponse>('/start-session');
  return data;
};

export const sendMessage = async (
  session_id: string,
  message: string
): Promise<ChatResponse> => {
  const { data } = await api.post<ChatResponse>('/chat', {
    session_id,
    message,
  });

  return data;
};

export const finishChatWithLink = async (
  session_id: string,
  email: string
): Promise<FinishChatResponse> => {
  const formData = new FormData();

  formData.append('session_id', session_id);
  formData.append('email', email);

  const { data } = await axios.post<FinishChatResponse>('/finish-chat-link', formData);

  return data;
};