import type { Message } from '../types';
import UserBubble from './UserBubble';
import AssistantBubble from './AssistantBubble';

export default function PDFMessage({ message }: { message: Message }) {
  return (
    <div className="page-break-avoid w-full">
      {message.role === 'user' ? (
        <UserBubble message={message} />
      ) : (
        <AssistantBubble message={message} />
      )}
    </div>
  );
}
