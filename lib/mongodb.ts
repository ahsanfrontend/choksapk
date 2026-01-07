import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.warn('MONGODB_URI not found in env, using local MongoDB fallback for development.');
}
const finalURI = MONGODB_URI || (global as any).MONGODB_URI_FALLBACK || "mongodb://127.0.0.1:27017/choksapk_demo";

if (!finalURI) {
  throw new Error('MongoDB connection string is missing. Ensure a valid URI is set in .env or the fallback is defined.');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(finalURI!, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log('MongoDB connected successfully');
  } catch (e) {
    cached.promise = null;
    console.error('MongoDB connection error:', e);
    throw new Error('Failed to connect to database. Please check your MONGODB_URI environment variable.');
  }

  return cached.conn;
}

export default dbConnect;
