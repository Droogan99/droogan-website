import { useState, useRef, useEffect } from 'react';

const CHAT_API = '/api/chat';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hey! I'm the Droogan AI assistant — and yes, I'm a live example of what we build. Ask me anything about our services, pricing, or how AI can automate your business.",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMessage = { role: 'user', content: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const apiMessages = updatedMessages
        .filter((_, i) => i > 0) // Skip initial greeting for API
        .map((m) => ({ role: m.role, content: m.content }));

      // If this is the first user message, include it properly
      if (apiMessages.length === 0) {
        apiMessages.push({ role: 'user', content: text });
      }

      const res = await fetch(CHAT_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = await res.json();

      if (data.reply) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: "Something went wrong on my end. Try again or reach out at jesse@droogan.ai." },
        ]);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: "Couldn't connect right now. Try again in a moment or email jesse@droogan.ai." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Unread indicator
  const [hasUnread] = useState(true);

  return (
    <>
      <style>{`
        .droogan-chat-btn {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #9B7FD4 0%, #7B5FB4 100%);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 24px rgba(155, 127, 212, 0.4);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          z-index: 9999;
        }
        .droogan-chat-btn:hover {
          transform: scale(1.08);
          box-shadow: 0 6px 32px rgba(155, 127, 212, 0.55);
        }
        .droogan-chat-btn svg {
          width: 28px;
          height: 28px;
          fill: white;
        }
        .droogan-chat-btn .droogan-unread {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 16px;
          height: 16px;
          background: #e74c3c;
          border-radius: 50%;
          border: 2px solid #0a0a0e;
        }

        .droogan-chat-window {
          position: fixed;
          bottom: 96px;
          right: 24px;
          width: 380px;
          max-width: calc(100vw - 48px);
          height: 520px;
          max-height: calc(100vh - 140px);
          background: #111114;
          border: 1px solid rgba(155, 127, 212, 0.25);
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          z-index: 9999;
          box-shadow: 0 12px 48px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(155, 127, 212, 0.1);
          animation: droogan-slide-up 0.25s ease-out;
        }
        @keyframes droogan-slide-up {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .droogan-chat-header {
          padding: 16px 20px;
          background: linear-gradient(135deg, rgba(155, 127, 212, 0.15) 0%, rgba(155, 127, 212, 0.05) 100%);
          border-bottom: 1px solid rgba(155, 127, 212, 0.15);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .droogan-chat-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .droogan-chat-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          object-fit: cover;
        }
        .droogan-chat-header-info h3 {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
          color: #ffffff;
          font-family: 'Space Mono', monospace;
        }
        .droogan-chat-header-info span {
          font-size: 11px;
          color: #6ee06e;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .droogan-chat-header-info span::before {
          content: '';
          width: 6px;
          height: 6px;
          background: #6ee06e;
          border-radius: 50%;
          display: inline-block;
        }
        .droogan-chat-close {
          background: none;
          border: none;
          color: #888;
          cursor: pointer;
          padding: 4px;
          font-size: 20px;
          line-height: 1;
          transition: color 0.15s;
        }
        .droogan-chat-close:hover {
          color: #fff;
        }

        .droogan-chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          scrollbar-width: thin;
          scrollbar-color: rgba(155, 127, 212, 0.3) transparent;
        }
        .droogan-chat-messages::-webkit-scrollbar {
          width: 4px;
        }
        .droogan-chat-messages::-webkit-scrollbar-thumb {
          background: rgba(155, 127, 212, 0.3);
          border-radius: 4px;
        }

        .droogan-msg {
          max-width: 85%;
          padding: 10px 14px;
          border-radius: 12px;
          font-size: 13.5px;
          line-height: 1.5;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          word-wrap: break-word;
        }
        .droogan-msg.assistant {
          align-self: flex-start;
          background: rgba(155, 127, 212, 0.12);
          color: #e0dce8;
          border-bottom-left-radius: 4px;
        }
        .droogan-msg.user {
          align-self: flex-end;
          background: linear-gradient(135deg, #9B7FD4 0%, #8468C4 100%);
          color: #fff;
          border-bottom-right-radius: 4px;
        }

        .droogan-typing {
          align-self: flex-start;
          display: flex;
          gap: 4px;
          padding: 12px 16px;
          background: rgba(155, 127, 212, 0.12);
          border-radius: 12px;
          border-bottom-left-radius: 4px;
        }
        .droogan-typing span {
          width: 6px;
          height: 6px;
          background: #9B7FD4;
          border-radius: 50%;
          animation: droogan-bounce 1.2s infinite;
        }
        .droogan-typing span:nth-child(2) { animation-delay: 0.15s; }
        .droogan-typing span:nth-child(3) { animation-delay: 0.3s; }
        @keyframes droogan-bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-6px); opacity: 1; }
        }

        .droogan-chat-input-area {
          padding: 12px 16px;
          border-top: 1px solid rgba(155, 127, 212, 0.15);
          display: flex;
          gap: 8px;
          align-items: flex-end;
          background: rgba(0, 0, 0, 0.2);
        }
        .droogan-chat-input-area textarea {
          flex: 1;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(155, 127, 212, 0.2);
          border-radius: 10px;
          padding: 10px 14px;
          color: #fff;
          font-size: 13.5px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          resize: none;
          outline: none;
          max-height: 80px;
          line-height: 1.4;
          transition: border-color 0.15s;
        }
        .droogan-chat-input-area textarea::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }
        .droogan-chat-input-area textarea:focus {
          border-color: rgba(155, 127, 212, 0.5);
        }
        .droogan-chat-send {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: linear-gradient(135deg, #9B7FD4 0%, #7B5FB4 100%);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.15s, transform 0.15s;
          flex-shrink: 0;
        }
        .droogan-chat-send:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        .droogan-chat-send:not(:disabled):hover {
          transform: scale(1.05);
        }
        .droogan-chat-send svg {
          width: 18px;
          height: 18px;
          fill: white;
        }

        .droogan-chat-footer {
          padding: 6px 16px 8px;
          text-align: center;
          font-size: 10px;
          color: rgba(255, 255, 255, 0.2);
          font-family: 'Space Mono', monospace;
        }
        .droogan-chat-footer a {
          color: rgba(155, 127, 212, 0.5);
          text-decoration: none;
        }
        .droogan-chat-footer a:hover {
          color: #9B7FD4;
        }

        @media (max-width: 480px) {
          .droogan-chat-window {
            bottom: 0;
            right: 0;
            width: 100vw;
            max-width: 100vw;
            height: 100vh;
            max-height: 100vh;
            border-radius: 0;
            padding-top: env(safe-area-inset-top, 20px);
          }
          .droogan-chat-btn {
            bottom: 16px;
            right: 16px;
          }
        }
      `}</style>

      {/* Chat Toggle Button */}
      {!isOpen && (
        <button className="droogan-chat-btn" onClick={() => setIsOpen(true)} aria-label="Open chat">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
          </svg>
          {hasUnread && <div className="droogan-unread" />}
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="droogan-chat-window">
          {/* Header */}
          <div className="droogan-chat-header">
            <div className="droogan-chat-header-left">
              <img src="/droogan-avatar.png" alt="Droogan AI" className="droogan-chat-avatar" />
              <div className="droogan-chat-header-info">
                <h3>Droogan AI</h3>
                <span>Online</span>
              </div>
            </div>
            <button className="droogan-chat-close" onClick={() => setIsOpen(false)} aria-label="Close chat">
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="droogan-chat-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`droogan-msg ${msg.role}`}>
                {msg.content}
              </div>
            ))}
            {isLoading && (
              <div className="droogan-typing">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="droogan-chat-input-area">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              rows={1}
            />
            <button className="droogan-chat-send" onClick={sendMessage} disabled={!input.trim() || isLoading} aria-label="Send message">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>

          {/* Footer */}
          <div className="droogan-chat-footer">
            Powered by <a href="https://droogan.ai" target="_blank" rel="noopener">Droogan AI</a>
          </div>
        </div>
      )}
    </>
  );
}