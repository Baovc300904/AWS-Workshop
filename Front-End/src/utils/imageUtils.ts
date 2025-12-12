/**
 * Convert image URL to full S3 URL if it's a relative path
 */
export function getFullImageUrl(imageUrl: string | undefined): string {
  if (!imageUrl) {
    return 'https://placehold.co/300x400/1a2332/4facfe?text=No+Image';
  }

  // If URL already starts with http/https or is a data URL, return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://') || imageUrl.startsWith('data:')) {
    return imageUrl;
  }

  // If it's a relative path starting with /, remove the leading /
  const cleanPath = imageUrl.startsWith('/') ? imageUrl.substring(1) : imageUrl;

  // Build S3 URL
  const s3Bucket = 'game-store-images-2025-vietnam';
  const s3Region = 'ap-southeast-1';
  return `https://${s3Bucket}.s3.${s3Region}.amazonaws.com/${cleanPath}`;
}

/**
 * Get game image with fallback
 */
export function getGameImage(game: { image?: string; cover?: string; name?: string }): string {
  const imageUrl = game.image || game.cover;
  return getFullImageUrl(imageUrl);
}
