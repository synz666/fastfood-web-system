import 'dotenv/config';
import { app } from './app';
import { logger } from './utils/logger';

const port = Number(process.env.PORT || 5000);

const server = app.listen(port, () => {
  logger.info(`Backend started on http://localhost:${port}`);
});

server.on('error', (err: any) => {
  if (err && err.code === 'EADDRINUSE') {
    logger.error(`Port ${port} is already in use. Another process is listening on this port.`);
    logger.error('If you are running a previous dev server, stop it or change PORT in .env.');
    process.exit(1);
  }

  logger.error('Server error:', err);
  process.exit(1);
});