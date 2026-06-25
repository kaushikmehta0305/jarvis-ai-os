'use client';

import { useState } from 'react';
import type { CSSProperties } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    setLoading(true);
    setReply('');

    try {
      const response = await fetch('http://localhost:3000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      setReply(data.reply);
    } catch (error) {
      setReply('Something went wrong while connecting to JARVIS backend.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>JARVIS AI OS</h1>
        <p style={styles.subtitle}>Module 1 - AI Brain MVP</p>

        <textarea
          style={styles.textarea}
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button style={styles.button} onClick={sendMessage} disabled={loading}>
          {loading ? 'Thinking...' : 'Send'}
        </button>

        {reply && (
          <div style={styles.responseBox}>
            <strong>JARVIS:</strong>
            <p>{reply}</p>
          </div>
        )}
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
    maxWidth: '600px',
    background: '#1f2937',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
  },
  title: {
    margin: 0,
    fontSize: '32px',
  },
  subtitle: {
    color: '#9ca3af',
    marginBottom: '20px',
  },
  textarea: {
    width: '100%',
    minHeight: '120px',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #374151',
    resize: 'vertical',
    fontSize: '16px',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    marginTop: '15px',
    padding: '12px',
    background: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  responseBox: {
    marginTop: '20px',
    background: '#111827',
    padding: '15px',
    borderRadius: '8px',
    border: '1px solid #374151',
  },
};