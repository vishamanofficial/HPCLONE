import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let mongoServer: any = null;

export const connectDB = async (): Promise<string> => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/hangingpanda';
  const forceInMemory = process.env.USE_IN_MEMORY_DB === 'true';

  if (!forceInMemory) {
    try {
      console.log(`[DB] Attempting connection to MongoDB at: ${uri}`);
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 3000,
      });
      console.log('[DB] MongoDB Connected successfully to URI.');
      return uri;
    } catch (err: any) {
      console.warn(`[DB] Connection to MongoDB URI failed (${err.message}). Falling back to MongoMemoryServer...`);
    }
  }

  // Fallback or explicit in-memory MongoDB
  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    mongoServer = await MongoMemoryServer.create();
    const memoryUri = mongoServer.getUri();
    await mongoose.connect(memoryUri);
    console.log(`[DB] MongoMemoryServer started and connected successfully at: ${memoryUri}`);
    return memoryUri;
  } catch (memErr: any) {
    console.error('[DB] Failed to start MongoMemoryServer:', memErr.message);
    throw memErr;
  }
};

export const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
};
