export function getDirectImageUrlError(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) {
    return 'Vui lòng nhập liên kết ảnh.';
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return 'Liên kết không hợp lệ.';
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return 'Liên kết ảnh phải bắt đầu bằng http:// hoặc https://.';
  }

  const path = parsed.pathname.toLowerCase();
  const isImagePath = /\.(png|jpe?g|webp|gif|bmp|svg)$/i.test(path);
  const hasImageHintInQuery =
    /(format|fm|ext|type)=(png|jpe?g|webp|gif|bmp|svg)/i.test(parsed.search) ||
    /image/i.test(parsed.search);

  if (!isImagePath && !hasImageHintInQuery) {
    return 'Đây là trang web, không phải link ảnh trực tiếp. Hãy dùng link kết thúc bằng .jpg, .png, .webp...';
  }

  return null;
}

export function isDirectImageUrl(url: string): boolean {
  return getDirectImageUrlError(url) == null;
}

