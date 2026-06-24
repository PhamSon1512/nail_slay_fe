/** Đếm ký tự SEO: không tính khoảng trắng, tính ký tự hiển thị (VD: "Hôm" = 3). */
export function countSeoCharacters(text: string): number {
  const noSpace = text.replace(/\s+/g, '');
  return [...noSpace.normalize('NFC')].length;
}
