import app from './app';
import { connectDB } from './config/db';
import { seedAdminUser } from './config/seedAdmin';

const PORT = process.env.PORT || 5001;

async function attemptConnectWithRetry(retries = 5, delay = 2500): Promise<void> {
  for (let i = 1; i <= retries; i++) {
    try {
      await connectDB();
      await seedAdminUser();
      console.log('[CSDA Server] Connected to MongoDB Atlas & initialized admin user.');
      return;
    } catch (err: any) {
      console.error(`[CSDA Server] Connection attempt ${i}/${retries} failed:`, err.message || err);
      if (i < retries) {
        console.log(`[CSDA Server] Retrying in ${delay / 1000}s...`);
        await new Promise((res) => setTimeout(res, delay));
      } else {
        console.warn(
          '[CSDA Server] WARNING: Could not connect to MongoDB Atlas after multiple attempts. Please check that your current IP address is whitelisted in MongoDB Atlas Network Access (set 0.0.0.0/0).'
        );
      }
    }
  }
}

async function bootstrap() {
  const server = app.listen(PORT, () => {
    console.log(`[CSDA Server] Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    attemptConnectWithRetry();
  });

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`[CSDA Server] Port ${PORT} is already in use by another process.`);
    } else {
      console.error('[CSDA Server] Server error:', err);
    }
  });
}

bootstrap();
