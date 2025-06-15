'use client';

import { useState } from 'react';

export default function Home() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const[loading,setLoading] = useState(false);
  const [error,setError] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError('');
try{
    const res = await fetch('http://localhost:8000/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input }),
    });

    if (!res.ok) throw new Error('Server error');

    const data = await res.json();
    const botMessage = { role: 'assistant', content: data.response };
    setMessages((prev) => [...prev, botMessage]);
  } catch (erer:any){
    setError('Something went wrong. Please try again.');
  } finally {
    setLoading(false);
  }
  };

  return (
    <main className="flex flex-col h-screen bg-gray-100">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg max-w-md ${
              msg.role === 'user' ? 'bg-blue-500 text-white self-end ml-auto' : 'bg-white text-black self-start mr-auto'
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>
      {loading && (
        <div className="text-sm text-gray-500 italic">Bot is typing...</div>
      )}

      {error && (
        <div className="text-sm text-red-600">{error}</div>
      )}
      <div className="p-4 border-t bg-white text-black flex gap-2">
        <input
          className="flex-1 border rounded px-4 py-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          disabled={loading}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={sendMessage}
          disabled={loading}
        >
          Send
          
        </button>
      </div>
    </main>
  );
}
