import express from 'express';
import cors from 'cors';
import routes from './routes';
import { initDB } from './db';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(routes);

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to init DB:', err);
  process.exit(1);
});
