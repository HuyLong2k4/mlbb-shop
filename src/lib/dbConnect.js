import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://maihuylong102_db_user:3fWcjUoAEb21uJs4@cluster0.cstps1v.mongodb.net/mlbb_shop?retryWrites=true&w=majority";

if (!process.env.MONGODB_URI) {
  process.env.MONGODB_URI = MONGODB_URI;
}

/**
 * Cache kết nối Mongoose trên đối tượng `global` của NodeJS.
 * Trong môi trường Development, Next.js hot-reload các file server liên tục.
 * Nếu không cache kết nối, mỗi lần reload sẽ mở thêm 1 kết nối mới làm tràn pool kết nối của MongoDB.
 */
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
      maxPoolSize: 10, // Giới hạn tối đa 10 kết nối cho mỗi Serverless container để chống tràn 500 connections của MongoDB Atlas
      serverSelectionTimeoutMS: 5000, // Timeout 5s nếu server MongoDB không phản hồi, tránh treo request
      socketTimeoutMS: 45000, // Timeout socket nếu kết nối nhàn rỗi quá lâu
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
