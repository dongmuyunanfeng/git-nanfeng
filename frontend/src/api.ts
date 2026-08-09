export interface Message {
  id: number;
  author: string;
  content: string;
  created_at: string;
}

const BASE = import.meta.env.VITE_API_URL || '/api';

export async function fetchMessages(): Promise<Message[]> {
  const res = await fetch(`${BASE}/messages`);
  if (!res.ok) throw new Error('Failed to fetch messages');
  return res.json();
}

export async function postMessage(author: string, content: string): Promise<Message> {
  const res = await fetch(`${BASE}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ author, content }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Failed to post message');
  }
  return res.json();
}
