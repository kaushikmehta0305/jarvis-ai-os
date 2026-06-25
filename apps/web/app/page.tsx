'use client';

import { useState } from 'react';
import type { CSSProperties, KeyboardEvent } from 'react';

type ChatMessage = {
  role: 'user' | 'jarvis';
  content: string;
};

export default function Home() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || loading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: trimmedMessage,
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: trimmedMessage }),
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      const data = await response.json();

      const jarvisMessage: ChatMessage = {
        role: 'jarvis',
        content: data.reply || 'No response received from JARVIS.',
      };

      setMessages((prev) => [...prev, jarvisMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        role: 'jarvis',
        content:
          'Unable to connect to JARVIS. Please make sure backend is running on port 3000 and Ollama is running on port 11434.',
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <main style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>JARVIS AI OS</h1>
          <p style={styles.subtitle}>Module 01.2 - Chat UX Cleanup</p>
        </div>

        <div style={styles.chatBox}>
          {messages.length === 0 ? (
            <div style={styles.emptyState}>
              Start a conversation with JARVIS.
            </div>
          ) : (
            messages.map((chatMessage, index) => (
              <div
                key={index}
                style={{
                  ...styles.messageRow,
                  justifyContent:
                    chatMessage.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    ...styles.messageBubble,
                    ...(chatMessage.role === 'user'
                      ? styles.userBubble
                      : styles.jarvisBubble),
                  }}
                >
                  <strong>
                    {chatMessage.role === 'user' ? 'You' : 'JARVIS'}
                  </strong>
                  <p style={styles.messageText}>{chatMessage.content}</p>
                </div>
              </div>
            ))
          )}

          {loading && (
            <div style={styles.messageRow}>
              <div style={{ ...styles.messageBubble, ...styles.jarvisBubble }}>
                <strong>JARVIS</strong>
                <p style={styles.messageText}>Thinking...</p>
              </div>
            </div>
          )}
        </div>

        <div style={styles.inputArea}>
          <textarea
            style={styles.textarea}
            placeholder="Type your message..."
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={handleKeyDown}
          />

          <button style={styles.button} onClick={sendMessage} disabled={loading}>
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </main>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#111827',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
  },
  card: {
    width: '100%',
    maxWidth: '800px',
    height: '85vh',
    background: '#1f2937',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    marginBottom: '16px',
  },
  title: {
    margin: 0,
    fontSize: '32px',
  },
  subtitle: {
    color: '#9ca3af',
    marginTop: '6px',
    marginBottom: 0,
  },
  chatBox: {
    flex: 1,
    background: '#111827',
    border: '1px solid #374151',
    borderRadius: '10px',
    padding: '16px',
    overflowY: 'auto',
    marginBottom: '16px',
  },
  emptyState: {
    height: '100%',
    color: '#9ca3af',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  messageRow: {
    display: 'flex',
    marginBottom: '12px',
  },
  messageBubble: {
    maxWidth: '75%',
    padding: '12px',
    borderRadius: '10px',
    lineHeight: 1.5,
  },
  userBubble: {
    background: '#2563eb',
    color: '#ffffff',
  },
  jarvisBubble: {
    background: '#374151',
    color: '#ffffff',
  },
  messageText: {
    margin: '6px 0 0 0',
    whiteSpace: 'pre-wrap',
  },
  inputArea: {
    display: 'flex',
    gap: '10px',
  },
  textarea: {
    flex: 1,
    minHeight: '60px',
    maxHeight: '120px',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #374151',
    resize: 'vertical',
    fontSize: '16px',
    boxSizing: 'border-box',
  },
  button: {
    width: '120px',
    padding: '12px',
    background: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
  },
};