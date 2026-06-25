import { useEffect, useState } from 'react';

type Memory = {
  id: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
};

function App() {
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);

  const [memoryContent, setMemoryContent] = useState('');
  const [memories, setMemories] = useState<Memory[]>([]);
  const [editingMemoryId, setEditingMemoryId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');

  const sendMessage = async () => {
    if (!message.trim()) return;

    try {
      setLoading(true);
      setReply('');

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
      console.error(error);
    } finally {
      setLoading(false);
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
    if (!memoryContent.trim()) return;

    try {
      await fetch('http://localhost:3000/memory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: memoryContent }),
      });

      setMemoryContent('');
      fetchMemories();
    } catch (error) {
      console.error('Failed to save memory:', error);
    }
  };

  const startEditing = (memory: Memory) => {
    setEditingMemoryId(memory.id);
    setEditingContent(memory.content);
  };

  const updateMemory = async (id: string) => {
    if (!editingContent.trim()) return;

    try {
      await fetch(`http://localhost:3000/memory/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: editingContent }),
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
    <div style={{ padding: '40px', fontFamily: 'Arial' }}>
      <h1 style={{ color: 'red' }}>CURRENT APP.TSX IS RUNNING</h1>

      <section>
        <h2>Module 1 – AI Brain MVP</h2>

        <div style={{ marginTop: '20px' }}>
          <input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{
              width: '300px',
              padding: '10px',
              marginRight: '10px',
            }}
          />

          <button
            onClick={sendMessage}
            disabled={loading}
            style={{
              padding: '10px 20px',
              cursor: 'pointer',
            }}
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>

        {reply && (
          <div
            style={{
              marginTop: '30px',
              padding: '20px',
              border: '1px solid #ccc',
              borderRadius: '8px',
              maxWidth: '600px',
            }}
          >
            <strong>JARVIS:</strong>
            <p>{reply}</p>
          </div>
        )}
      </section>

      <hr style={{ margin: '40px 0' }} />

      <section>
        <h2>Module 2 – Memory Engine MVP</h2>
        <p>Memory is separate from chat for now.</p>

        <div style={{ marginTop: '20px' }}>
          <input
            type="text"
            placeholder="Write a memory..."
            value={memoryContent}
            onChange={(e) => setMemoryContent(e.target.value)}
            style={{
              width: '400px',
              padding: '10px',
              marginRight: '10px',
            }}
          />

          <button
            onClick={saveMemory}
            style={{
              padding: '10px 20px',
              cursor: 'pointer',
            }}
          >
            Save Memory
          </button>
        </div>

        <div style={{ marginTop: '30px', maxWidth: '700px' }}>
          <h3>Saved Memories</h3>

          {memories.length === 0 && <p>No memories saved yet.</p>}

          {memories.map((memory) => (
            <div
              key={memory.id}
              style={{
                padding: '15px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                marginBottom: '10px',
              }}
            >
              {editingMemoryId === memory.id ? (
                <>
                  <input
                    type="text"
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                    style={{
                      width: '400px',
                      padding: '10px',
                      marginRight: '10px',
                    }}
                  />

                  <button
                    onClick={() => updateMemory(memory.id)}
                    style={{ marginRight: '10px' }}
                  >
                    Save
                  </button>

                  <button onClick={() => setEditingMemoryId(null)}>
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <p>{memory.content}</p>

                  <button
                    onClick={() => startEditing(memory)}
                    style={{ marginRight: '10px' }}
                  >
                    Edit
                  </button>

                  <button onClick={() => deleteMemory(memory.id)}>
                    Delete
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default App;