import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Đọc .env.local
const envPath = path.join(rootDir, '.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) {
      process.env[m[1].trim()] = m[2].trim();
    }
  });
}

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://maihuylong102_db_user:3fWcjUoAEb21uJs4@cluster0.cstps1v.mongodb.net/mlbb_shop?retryWrites=true&w=majority";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "daksfvybx",
  api_key: process.env.CLOUDINARY_API_KEY || "473819711181877",
  api_secret: process.env.CLOUDINARY_API_SECRET || "GS_PcZrzSubqAqQ8G-k2HsMof5o",
  secure: true,
});

function getPublicIdFromUrl(url) {
  if (!url || typeof url !== "string") return null;
  if (!url.includes("cloudinary.com")) {
    if (!url.startsWith("http://") && !url.startsWith("https://")) return url;
    return null;
  }
  try {
    const uploadIndex = url.indexOf("/upload/");
    if (uploadIndex === -1) return null;
    let pathAfterUpload = url.substring(uploadIndex + "/upload/".length);
    const segments = pathAfterUpload.split("/");
    const cleanSegments = [];
    let isPastVersion = false;
    for (const segment of segments) {
      if (!isPastVersion) {
        if (/^v\d+$/.test(segment)) {
          isPastVersion = true;
          continue;
        }
        if (/^(?:[a-z]{1,2}_[a-zA-Z0-9]+,?)+$/.test(segment)) continue;
      }
      cleanSegments.push(segment);
    }
    const fullPath = cleanSegments.join("/");
    const lastDotIndex = fullPath.lastIndexOf(".");
    return lastDotIndex !== -1 ? fullPath.substring(0, lastDotIndex) : fullPath;
  } catch (err) {
    return null;
  }
}

async function run() {
  console.log("=== ĐANG KẾT NỐI MONGODB & CLOUDINARY ===");
  await mongoose.connect(MONGODB_URI);
  console.log("MongoDB kết nối thành công!");

  const ping = await cloudinary.api.ping();
  console.log("Cloudinary ping thành công:", ping.status);

  // 1. Quét tài khoản
  const collection = mongoose.connection.collection('accounts');
  const now = new Date();
  const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000);

  console.log("Mốc thời gian 10 ngày trước:", tenDaysAgo.toISOString());

  // Tìm các tài khoản đã bán > 10 ngày và chưa dọn dẹp ảnh
  const accountsToClean = await collection.find({
    status: "Đã bán",
    isImageCleaned: { $ne: true },
    $or: [
      { soldAt: { $ne: null, $lte: tenDaysAgo } },
      { soldAt: null, updatedAt: { $lte: tenDaysAgo } },
      { soldAt: null, createdAt: { $lte: tenDaysAgo } }
    ]
  }).toArray();

  console.log(`Tìm thấy ${accountsToClean.length} tài khoản đã bán > 10 ngày cần dọn dẹp ảnh.`);

  let totalDeletedFromExpired = 0;

  for (const acc of accountsToClean) {
    const keepUrl = acc.images?.[0] || acc.screenshots?.[0]?.imageUrl || "";
    const allUrls = new Set([
      ...(Array.isArray(acc.images) ? acc.images : []),
      ...(Array.isArray(acc.screenshots) ? acc.screenshots.map(s => s.imageUrl).filter(Boolean) : [])
    ]);

    const toDeleteUrls = Array.from(allUrls).filter(u => u && u !== keepUrl);
    const pidsToDelete = toDeleteUrls.map(u => getPublicIdFromUrl(u)).filter(Boolean);

    console.log(`Acc #${acc.id}: Cần xóa ${pidsToDelete.length} ảnh chi tiết, giữ lại 1 thumbnail (${keepUrl.slice(-25)})`);

    if (pidsToDelete.length > 0) {
      try {
        const delRes = await cloudinary.api.delete_resources(pidsToDelete, { invalidate: true });
        const count = Object.values(delRes.deleted || {}).filter(s => s === 'deleted' || s === 'not_found').length;
        totalDeletedFromExpired += count;
        console.log(` -> Đã xóa thành công ${count} ảnh trên Cloudinary cho acc #${acc.id}`);
      } catch (e) {
        console.error(` -> Lỗi xóa ảnh acc #${acc.id}:`, e.message);
      }
    }

    await collection.updateOne(
      { _id: acc._id },
      {
        $set: {
          images: keepUrl ? [keepUrl] : [],
          screenshots: keepUrl ? [{
            id: 1,
            title: "Ảnh đại diện (Đã bán)",
            caption: `Tài khoản #${acc.id} đã hoàn tất giao dịch.`,
            imageUrl: keepUrl
          }] : [],
          isImageCleaned: true,
          cleanedImagesAt: new Date(),
          soldAt: acc.soldAt || acc.updatedAt || acc.createdAt || new Date()
        }
      }
    );
  }

  // 2. Quét dọn các ảnh mồ côi (Orphaned images) trên Cloudinary
  console.log("\n=== BẮT ĐẦU QUÉT DỌN ẢNH MỒ CÔI (ORPHANED IMAGES) TRÊN CLOUDINARY ===");
  const allAccounts = await collection.find({}).toArray();
  const activePids = new Set();
  allAccounts.forEach(acc => {
    (acc.images || []).forEach(u => {
      const pid = getPublicIdFromUrl(u);
      if (pid) activePids.add(pid);
    });
    (acc.screenshots || []).forEach(s => {
      const pid = getPublicIdFromUrl(s.imageUrl);
      if (pid) activePids.add(pid);
    });
  });

  console.log(`Số ảnh đang active hợp lệ trong Database MongoDB: ${activePids.size}`);

  let nextCursor = null;
  let allCloudinaryImages = [];
  do {
    const opts = { resource_type: "image", type: "upload", max_results: 500 };
    if (nextCursor) opts.next_cursor = nextCursor;
    const res = await cloudinary.api.resources(opts);
    allCloudinaryImages.push(...res.resources);
    nextCursor = res.next_cursor;
  } while (nextCursor);

  console.log(`Tổng số ảnh thực tế trên Cloudinary trước dọn dẹp: ${allCloudinaryImages.length}`);

  const orphanedPids = allCloudinaryImages
    .map(r => r.public_id)
    .filter(pid => !activePids.has(pid) && !pid.startsWith('logo') && !pid.startsWith('banner') && !pid.startsWith('system/'));

  console.log(`Số ảnh mồ côi (không thuộc tài khoản nào) cần xóa: ${orphanedPids.length}`);

  let totalOrphansDeleted = 0;
  for (let i = 0; i < orphanedPids.length; i += 100) {
    const batch = orphanedPids.slice(i, i + 100);
    try {
      const delRes = await cloudinary.api.delete_resources(batch, { invalidate: true });
      const count = Object.values(delRes.deleted || {}).filter(s => s === 'deleted' || s === 'not_found').length;
      totalOrphansDeleted += count;
      console.log(` -> Đã xóa batch ${Math.floor(i/100) + 1}: ${count} ảnh`);
    } catch (e) {
      console.error(` -> Lỗi xóa batch ${Math.floor(i/100) + 1}:`, e.message);
    }
  }

  // 3. Đếm lại số lượng ảnh còn lại trên Cloudinary
  let verifyCursor = null;
  let remainingCount = 0;
  do {
    const opts = { resource_type: "image", type: "upload", max_results: 500 };
    if (verifyCursor) opts.next_cursor = verifyCursor;
    const res = await cloudinary.api.resources(opts);
    remainingCount += res.resources.length;
    verifyCursor = res.next_cursor;
  } while (verifyCursor);

  console.log("\n================ KẾT QUẢ CUỐI CÙNG ================");
  console.log(`- Số ảnh đã xóa từ các acc đã bán > 10 ngày: ${totalDeletedFromExpired}`);
  console.log(`- Số ảnh rác mồ côi đã dọn dẹp: ${totalOrphansDeleted}`);
  console.log(`- TỔNG CỘNG ĐÃ GIẢI PHÓNG: ${totalDeletedFromExpired + totalOrphansDeleted} ảnh`);
  console.log(`- SỐ ẢNH CÒN LẠI TRÊN CLOUDINARY: ${remainingCount} ảnh (Ban đầu là: ${allCloudinaryImages.length})`);
  console.log("====================================================");

  await mongoose.disconnect();
}

run().catch(console.error);
