import fs from 'fs';
import { google } from 'googleapis';

async function run() {
  const jsonPath = './service_account.json';

  if (!fs.existsSync(jsonPath)) {
    console.error(`\x1b[31m[LỖI] Không tìm thấy file "${jsonPath}".\x1b[0m`);
    console.error('Vui lòng làm theo hướng dẫn để tải file service_account.json và lưu vào thư mục gốc dự án (nail_slay_fe).');
    process.exit(1);
  }

  console.log('🔄 Đang khởi tạo kết nối Google Indexing API...');

  let auth;
  try {
    auth = new google.auth.GoogleAuth({
      keyFile: jsonPath,
      scopes: ['https://www.googleapis.com/auth/indexing'],
    });

    // Test xác thực lấy auth client
    await auth.getClient();
    console.log('✅ Xác thực tài khoản Service Account thành công!');
  } catch (err) {
    console.error('❌ Xác thực thất bại. Vui lòng kiểm tra lại file service_account.json:', err.message);
    process.exit(1);
  }

  const sitemapUrl = 'https://nailslaystudio.com/sitemap.xml';
  console.log(`🌐 Đang tải danh sách URL từ sitemap: ${sitemapUrl}...`);

  let urls = [];
  try {
    const response = await fetch(sitemapUrl);
    if (!response.ok) {
      throw new Error(`HTTP status ${response.status}`);
    }
    const xmlText = await response.text();

    const matches = xmlText.matchAll(/<loc>(.*?)<\/loc>/g);
    for (const match of matches) {
      const url = match[1].trim();
      if (url && !url.includes('/admin') && !urls.includes(url)) {
        urls.push(url);
      }
    }
  } catch (err) {
    console.error('❌ Không tải hoặc phân tích được sitemap.xml:', err.message);
    console.log('💡 Sẽ sử dụng danh sách URL mặc định để thay thế.');
    urls = [
      'https://nailslaystudio.com/',
      'https://nailslaystudio.com/san-pham',
      'https://nailslaystudio.com/bai-viet',
      'https://nailslaystudio.com/gioi-thieu',
      'https://nailslaystudio.com/chinh-sach',
      'https://nailslaystudio.com/huong-dan',
      'https://nailslaystudio.com/danh-muc',
    ];
  }

  if (urls.length === 0) {
    console.log('⚠️ Không tìm thấy URL nào để index.');
    return;
  }

  console.log(`📋 Tìm thấy tất cả ${urls.length} URL cần lập chỉ mục.`);
  console.log('🚀 Bắt đầu gửi yêu cầu index lên Google...\n');

  const indexing = google.indexing({
    version: 'v3',
    auth: auth,
  });

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    console.log(`[${i + 1}/${urls.length}] Đang gửi yêu cầu cho: ${url}`);

    try {
      const res = await indexing.urlNotifications.publish({
        requestBody: {
          url: url,
          type: 'URL_UPDATED',
        },
      });
      console.log(`   👉 Thành công! Trạng thái Google phản hồi: ${res.statusText || 'OK'}`);
    } catch (err) {
      console.error(`   ❌ Lỗi khi index ${url}:`, err.response?.data?.error?.message || err.message);
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  console.log('\n🎉 Hoàn thành gửi tất cả yêu cầu lên Google Indexing API!');
  console.log('💡 Thường Google sẽ quét và cập nhật index trong vòng 2 - 24 giờ tới.');
}

run().catch(console.error);
