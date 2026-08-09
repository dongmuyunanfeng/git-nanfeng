import { Router, Request, Response } from 'express';
import { getMessages, createMessage } from './db';

const router = Router();

router.get('/api/messages', async (_req: Request, res: Response) => {
  try {
    const messages = await getMessages();
    res.json(messages);
  } catch (err) {
    console.error('GET /api/messages error:', err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

router.post('/api/messages', async (req: Request, res: Response) => {
  try {
    const { author, content } = req.body;

    if (!author || !author.trim()) {
      res.status(400).json({ error: '昵称不能为空' });
      return;
    }
    if (!content || !content.trim()) {
      res.status(400).json({ error: '留言内容不能为空' });
      return;
    }
    if (content.length > 500) {
      res.status(400).json({ error: '留言内容不能超过500个字符' });
      return;
    }

    const message = await createMessage(author.trim(), content.trim());
    res.status(201).json(message);
  } catch (err) {
    console.error('POST /api/messages error:', err);
    res.status(500).json({ error: 'Failed to create message' });
  }
});

export default router;
