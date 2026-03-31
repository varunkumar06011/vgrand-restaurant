import React, { useState, useEffect } from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { optimizeImage } from '@/utils/image';

interface OptimizedImageProps extends Omit<HTMLMotionProps<'img'>, 'src'> {
  src: string | null | undefined;
}

/**
 * A standardized image component that handles:
 * 1. Unsplash URL optimization (WebP, width, height)
 * 2. Robust 404 error handling with a premium fallback
 * 3. Lazy loading for better performance
 * 4. Resilient loading with single-retry logic
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({ 
  src, 
  alt, 
  className, 
  onError, 
  ...props 
}) => {
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  // Reset error state if src changes
  useEffect(() => {
    setHasError(false);
    setRetryCount(0);
  }, [src]);

  // Use fallback if explicitly not provided or if an error occurred twice
  const displaySrc = (hasError && retryCount >= 1) || !src 
    ? "/fallback.webp" 
    : optimizeImage(src);

  return (
    <motion.img
      src={displaySrc}
      alt={alt || "V Grand Restaurant Delight"}
      loading="lazy"
      onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        if (retryCount < 1) {
          // Single retry: Sometimes Unsplash links hit a transient blink
          setRetryCount(prev => prev + 1);
          // Force a slight re-load by appending a tiny timestamp if it's the first error
          const target = e.target as HTMLImageElement;
          if (src && src.startsWith('http')) {
            target.src = `${optimizeImage(src)}${src.includes('?') ? '&' : '?'}t=${Date.now()}`;
          }
        } else {
          setHasError(true);
          if (onError) onError(e as any);
        }
      }}
      className={className}
      {...props}
    />
  );
};
