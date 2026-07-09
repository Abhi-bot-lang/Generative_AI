import axios from 'axios';
import type { SharedChatResponse } from '../types';

// Vite exposes env vars on import.meta.env. Avoid referencing `process` in the browser.
const API_BASE = (import.meta.env.VITE_API_BASE_URL as string) || '';

export const getSharedChat = async (chatId: string): Promise<SharedChatResponse> => {
  const url = `${API_BASE}/chat/${chatId}`;
  const { data } = await axios.get<SharedChatResponse>(url);
  return data;
};

// Create a share token for a session_id — backend should return { chat_id }
export const createShare = async (sessionId: string): Promise<{ chat_id: string }> => {
  const url = `${API_BASE}/share`;
  const { data } = await axios.post<{ chat_id: string }>(url, { session_id: sessionId });
  return data;
};

export default createShare;
