// Image optimization utilities
export const getOptimizedImageUrl = (
  originalUrl: string,
  width?: number,
  height?: number,
  quality: number = 80
): string => {
  if (!originalUrl) return originalUrl;
  if (originalUrl.startsWith('https://images.pexels.com') || originalUrl.includes('auto=compress')) {
    return originalUrl;
  }

  if (originalUrl.includes('supabase.co')) {
    const url = new URL(originalUrl);
    const params = url.searchParams;

    params.set('quality', quality.toString());
    if (width) params.set('width', width.toString());
    if (height) params.set('height', height.toString());

    return url.toString();
  }

  return originalUrl;
};

export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

export const getResponsiveImageSizes = (baseUrl: string) => {
  return {
    mobile: getOptimizedImageUrl(baseUrl, 480, undefined, 75),
    tablet: getOptimizedImageUrl(baseUrl, 768, undefined, 80),
    desktop: getOptimizedImageUrl(baseUrl, 1200, undefined, 85),
    large: getOptimizedImageUrl(baseUrl, 1920, undefined, 90),
  };
};

export const createImageLoader = () => {
  const loadedImages = new Set<string>();

  return {
    isLoaded: (src: string) => loadedImages.has(src),
    markAsLoaded: (src: string) => loadedImages.add(src),
    preloadImages: async (urls: string[]) => {
      const promises = urls.map((url) => preloadImage(url));
      await Promise.allSettled(promises);
      urls.forEach((url) => loadedImages.add(url));
    },
  };
};
