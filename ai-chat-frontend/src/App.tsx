import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ActiveChat from './pages/ActiveChat';
import ChatView from './pages/ChatView';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ActiveChat />} />
        <Route path="/chat/:chatId" element={<ChatView />} />
      </Routes>
    </BrowserRouter>
  );
}
