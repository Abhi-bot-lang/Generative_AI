export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface SessionResponse {
  session_id: string;
}

export interface ChatResponse {
  reply: string;
  limit_reached: boolean;
}

export interface FinishChatResponse {
  success: boolean;
  message: string;
}

export type AppStatus =
  | 'loading'    // creating session
  | 'chatting'   // normal chat (continues past 5 messages)
  | 'exported'   // PDF sent, session deleted — chat locked
  | 'error';     // fatal error

export interface SharedChatResponse {
  chat_id: string;
  messages: { role: 'user' | 'assistant'; content: string }[];
}
