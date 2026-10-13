/** Şərti sinif adlarını birləşdirir. Yeni paket əlavə etməmək üçün sadə join. */
export function cn(
  ...parts: Array<string | false | null | undefined>
): string {
  return parts.filter(Boolean).join(" ");
}
