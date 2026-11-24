import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cms_database';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  memoryServer: any | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache || {
  conn: null,
  promise: null,
  memoryServer: null
};

global.mongooseCache = cached;

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = (async () => {
      const isProduction = process.env.NODE_ENV === 'production';
      const forceInMemory = process.env.USE_IN_MEMORY_DB === 'true';

      // 1. In production OR if in-memory is not forced, connect to real MongoDB (Atlas / Cluster)
      if (isProduction || !forceInMemory) {
        try {
          const m = await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            bufferCommands: false,
          });
          console.log('[DB] Connected to MongoDB');
          return m;
        } catch (err: any) {
          if (isProduction) {
            console.error('[DB] Production MongoDB connection failed:', err.message);
            throw err;
          }
          console.warn(`[DB] Direct MongoDB connection failed (${err.message}). Trying local memory server...`);
        }
      }

      // 2. Fallback to MongoMemoryServer (Development only)
      try {
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        if (!cached.memoryServer) {
          try {
            cached.memoryServer = await MongoMemoryServer.create({
              instance: { port: 27018, ip: '127.0.0.1' }
            });
          } catch {
            cached.memoryServer = await MongoMemoryServer.create();
          }
        }
        const memoryUri = cached.memoryServer.getUri();
        const m = await mongoose.connect(memoryUri, {
          serverSelectionTimeoutMS: 3000,
          bufferCommands: false,
        });
        console.log(`[DB] In-Memory MongoDB connected at ${memoryUri}`);

        // Seed initial data in background without blocking the initial response
        import('@/scripts/seed')
          .then(({ seedInitialData }) => seedInitialData())
          .catch((e: any) => console.warn('[DB] Auto-seed background notice:', e.message));

        return m;
      } catch (memErr: any) {
        if (cached.memoryServer) {
          try {
            await cached.memoryServer.stop();
          } catch {}
          cached.memoryServer = null;
        }
        console.error('[DB] Failed to connect to MongoDB:', memErr.message);
        throw memErr;
      }
    })();
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export async function disconnectDB(): Promise<void> {
  if (cached.conn) {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
  }
  if (cached.memoryServer) {
    await cached.memoryServer.stop();
    cached.memoryServer = null;
  }
}
