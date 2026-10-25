import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  // Cảnh báo nếu chưa thiết lập biến môi trường MONGODB_URI trong .env.local
  // (Không throw lỗi ngay lúc build để tránh crash khi preview UI)
  console.warn("⚠️ Cảnh báo: Biến môi trường MONGODB_URI chưa được định nghĩa trong .env.local");
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
