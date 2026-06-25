'use client';

import { useEffect, useState } from 'react';
import type { CSSProperties, KeyboardEvent } from 'react';

type ChatMessage = {
  role: 'user' | 'jarvis';
  content: string;
};

type Memory = {
  id: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
};

export default function Home() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [memoryContent, setMemoryContent] = useState('');
  const [memories, setMemories] = useState<Memory[]>([]);
  const [editingMemoryId, setEditingMemoryId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');

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

  const fetchMemories = async () => {
  try {
    const response = await fetch('http://localhost:3000/memory');
    const data = await response.json();
    setMemories(data);
  } catch (error) {
    console.error('Failed to fetch memories:', error);
  }
};

const saveMemory = async () => {
  const trimmedMemory = memoryContent.trim();

  if (!trimmedMemory) return;

  try {
    await fetch('http://localhost:3000/memory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: trimmedMemory }),
    });

    setMemoryContent('');
    fetchMemories();
  } catch (error) {
    console.error('Failed to save memory:', error);
  }
};

const startEditingMemory = (memory: Memory) => {
  setEditingMemoryId(memory.id);
  setEditingContent(memory.content);
};

const updateMemory = async (id: string) => {
  const trimmedMemory = editingContent.trim();

  if (!trimmedMemory) return;

  try {
    await fetch(`http://localhost:3000/memory/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: trimmedMemory }),
    });

    setEditingMemoryId(null);
    setEditingContent('');
    fetchMemories();
  } catch (error) {
    console.error('Failed to update memory:', error);
  }
};

const deleteMemory = async (id: string) => {
  try {
    await fetch(`http://localhost:3000/memory/${id}`, {
      method: 'DELETE',
    });

    fetchMemories();
  } catch (error) {
    console.error('Failed to delete memory:', error);
  }
};

useEffect(() => {
  fetchMemories();
}, []);

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
      <section style={styles.memorySection}>
  <h2 style={styles.memoryTitle}>Module 2 - Memory Engine MVP</h2>
  <p style={styles.memoryNote}>Memory is separate from chat for now.</p>

  <div style={styles.memoryInputRow}>
    <input
      value={memoryContent}
      onChange={(event) => setMemoryContent(event.target.value)}
      placeholder="Write a memory..."
      style={styles.memoryInput}
    />

    <button onClick={saveMemory} style={styles.memoryButton}>
      Save Memory
    </button>
  </div>

  <div style={styles.memoryList}>
    <h3 style={styles.memorySubtitle}>Saved Memories</h3>

    {memories.length === 0 && (
      <p style={styles.memoryNote}>No memories saved yet.</p>
    )}

    {memories.map((memory) => (
      <div key={memory.id} style={styles.memoryCard}>
        {editingMemoryId === memory.id ? (
          <>
            <input
              value={editingContent}
              onChange={(event) => setEditingContent(event.target.value)}
              style={styles.memoryEditInput}
            />

            <button
              onClick={() => updateMemory(memory.id)}
              style={styles.smallButton}
            >
              Save
            </button>

            <button
              onClick={() => setEditingMemoryId(null)}
              style={styles.smallButtonSecondary}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <p style={styles.memoryText}>{memory.content}</p>

            <button
              onClick={() => startEditingMemory(memory)}
              style={styles.smallButton}
            >
              Edit
            </button>

            <button
              onClick={() => deleteMemory(memory.id)}
              style={styles.smallButtonSecondary}
            >
              Delete
            </button>
          </>
        )}
      </div>
    ))}
  </div>
</section>
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

  memorySection: {
  marginTop: '32px',
  padding: '24px',
  borderRadius: '16px',
  border: '1px solid #334155',
  background: '#111827',
} satisfies CSSProperties,

memoryTitle: {
  margin: 0,
  color: '#ffffff',
  fontSize: '24px',
} satisfies CSSProperties,

memoryNote: {
  color: '#cbd5e1',
  marginTop: '8px',
} satisfies CSSProperties,

memoryInputRow: {
  display: 'flex',
  gap: '12px',
  marginTop: '20px',
} satisfies CSSProperties,

memoryInput: {
  flex: 1,
  padding: '14px',
  borderRadius: '10px',
  border: '1px solid #475569',
  background: '#0f172a',
  color: '#ffffff',
  fontSize: '16px',
} satisfies CSSProperties,

memoryButton: {
  padding: '14px 22px',
  borderRadius: '10px',
  border: 'none',
  background: '#2563eb',
  color: '#ffffff',
  cursor: 'pointer',
  fontSize: '16px',
} satisfies CSSProperties,

memoryList: {
  marginTop: '24px',
} satisfies CSSProperties,

memorySubtitle: {
  color: '#ffffff',
  marginBottom: '12px',
} satisfies CSSProperties,

memoryCard: {
  padding: '16px',
  borderRadius: '12px',
  border: '1px solid #334155',
  background: '#1e293b',
  marginBottom: '12px',
} satisfies CSSProperties,

memoryText: {
  color: '#ffffff',
  marginBottom: '12px',
} satisfies CSSProperties,

memoryEditInput: {
  width: '100%',
  padding: '12px',
  borderRadius: '8px',
  border: '1px solid #475569',
  background: '#0f172a',
  color: '#ffffff',
  marginBottom: '12px',
} satisfies CSSProperties,

smallButton: {
  padding: '8px 14px',
  borderRadius: '8px',
  border: 'none',
  background: '#2563eb',
  color: '#ffffff',
  cursor: 'pointer',
  marginRight: '8px',
} satisfies CSSProperties,

smallButtonSecondary: {
  padding: '8px 14px',
  borderRadius: '8px',
  border: '1px solid #64748b',
  background: 'transparent',
  color: '#ffffff',
  cursor: 'pointer',
} satisfies CSSProperties,
};

