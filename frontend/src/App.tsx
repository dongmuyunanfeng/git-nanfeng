import { useState, useEffect, useCallback } from 'react';
import { fetchMessages, postMessage, Message } from './api';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadMessages = useCallback(async () => {
    try {
      const data = await fetchMessages();
      setMessages(data);
    } catch {
      setError('加载留言失败，请确认后端已启动');
    }
  }, []);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!author.trim()) {
      setError('请输入昵称');
      return;
    }
    if (!content.trim()) {
      setError('请输入留言内容');
      return;
    }

    setLoading(true);
    try {
      await postMessage(author, content);
      setAuthor('');
      setContent('');
      await loadMessages();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : '提交失败');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr + 'Z');
    return d.toLocaleString('zh-CN');
  };

  return (
    <div className="container">
      <header>
        <h1>留言板</h1>
        <p className="subtitle">留下你想说的话</p>
      </header>

      <form className="message-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="你的昵称"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          maxLength={30}
          className="input-author"
        />
        <textarea
          placeholder="说点什么吧..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={500}
          rows={3}
          className="input-content"
        />
        <div className="form-footer">
          <span className="char-count">{content.length}/500</span>
          <button type="submit" disabled={loading} className="btn-submit">
            {loading ? '提交中...' : '发布留言'}
          </button>
        </div>
        {error && <p className="error-msg">{error}</p>}
      </form>

      <div className="message-list">
        {messages.length === 0 ? (
          <p className="empty-hint">暂无留言，来抢沙发吧！</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="message-card">
              <div className="card-header">
                <span className="card-author">{msg.author}</span>
                <span className="card-time">{formatTime(msg.created_at)}</span>
              </div>
              <p className="card-content">{msg.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
