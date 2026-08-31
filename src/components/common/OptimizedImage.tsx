import React, { useState, useRef, useEffect } from 'react';
import { getOptimizedImageUrl, getResponsiveImageSizes } from '../../utils/imageOptimization';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  quality?: number;
  lazy?: boolean;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  quality = 80,
  lazy = true,
  placeholder,
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!lazy || isInView) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observerRef.current?.disconnect();
          }
        });
      },
      {
        rootMargin: '50px'
      }
    );

    if (containerRef.current) {
      observerRef.current.observe(containerRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [lazy, isInView]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const responsiveImages = getResponsiveImageSizes(src);
  const optimizedSrc = getOptimizedImageUrl(src, width, height, quality);

  const fallbackSrc = placeholder || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+';

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      ref={containerRef}
      style={width && height ? { aspectRatio: `${width} / ${height}` } : undefined}
    >
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-dark-800 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-accent-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 bg-dark-800 flex items-center justify-center">
          <div className="text-dark-400 text-center">
            <div className="text-2xl mb-2">&#128247;</div>
            <div className="text-sm">Image unavailable</div>
          </div>
        </div>
      )}

      {isInView && (
        <img
          src={hasError ? fallbackSrc : optimizedSrc}
          srcSet={!hasError ? `
            ${responsiveImages.mobile} 480w,
            ${responsiveImages.tablet} 768w,
            ${responsiveImages.desktop} 1200w,
            ${responsiveImages.large} 1920w
          ` : undefined}
          sizes="(max-width: 480px) 480px, (max-width: 768px) 768px, (max-width: 1200px) 1200px, 1920px"
          alt={alt}
          width={width}
          height={height}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          onLoad={handleLoad}
          onError={handleError}
          loading={lazy ? 'lazy' : 'eager'}
          decoding="async"
          fetchPriority={lazy ? 'auto' : 'high'}
        />
      )}
    </div>
  );
};

export default OptimizedImage;
