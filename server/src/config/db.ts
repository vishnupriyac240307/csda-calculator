import mongoose from 'mongoose';
import dns from 'dns';

// Fix macOS DNS SRV resolution for MongoDB Atlas across local routers and mobile hotspots
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch {
  // ignore in environments where dns customization is disallowed
}

export async function connectDB(uri?: string): Promise<typeof mongoose> {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  const mongoURI = uri || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/csda_calculator';

  try {
    const conn = await mongoose.connect(mongoURI, {
      dbName: 'csda_calculator',
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000
    });
    console.log(`[Database] MongoDB Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error: any) {
    console.error('[Database] MongoDB connection error:', error.message || error);
    throw error;
  }
}

export async function disconnectDB(): Promise<void> {
  try {
    await mongoose.disconnect();
    console.log('[Database] MongoDB disconnected');
  } catch (error) {
    console.error('[Database] Disconnect error:', error);
  }
}
