import { uploadContentAsset } from '~/utils/api/admin';

// Hàm chuẩn hóa tên file SEO (không dấu, cách nhau bằng gạch ngang)
export function sanitizeFilename(name: string): string {
  const ext = name.split('.').pop() || '';
  const base = name.substring(0, name.lastIndexOf('.')) || name;
  const slug = base
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Gỡ dấu tiếng Việt
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-') // Đổi các ký tự đặc biệt thành dấu gạch ngang
    .replace(/^-+|-+$/g, ''); // Xóa dấu gạch đầu/cuối
  return `${slug || 'image'}.${ext}`;
}

// Hàm nén ảnh client-side bằng canvas nếu > maxKb
export function compressImage(file: File, maxKb: number = 100): Promise<File> {
  return new Promise((resolve) => {
    if (file.size <= maxKb * 1024 || !file.type.startsWith('image/')) {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        const MAX_DIM = 1600;
        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        let quality = 0.85;
        const type = file.type === 'image/png' ? 'image/jpeg' : file.type;
        
        const attemptCompression = () => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                resolve(file);
                return;
              }
              if (blob.size <= maxKb * 1024 || quality <= 0.1) {
                const ext = type.split('/').pop() || 'jpg';
                const originalName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
                const newName = `${originalName}.${ext}`;
                resolve(new File([blob], newName, { type, lastModified: Date.now() }));
              } else {
                quality -= 0.1;
                attemptCompression();
              }
            },
            type,
            quality
          );
        };

        attemptCompression();
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

// Hàm nén, đổi tên SEO và upload lên server
export async function processAndUploadImage(
  file: File,
  autoOptimize: boolean = true
): Promise<{ url: string; mimeType: string; fileName: string }> {
  let targetFile = file;
  if (autoOptimize && file.type.startsWith('image/')) {
    const seoName = sanitizeFilename(file.name);
    const renamedFile = new File([file], seoName, { type: file.type });
    targetFile = await compressImage(renamedFile, 100);
  }
  return await uploadContentAsset(targetFile);
}
