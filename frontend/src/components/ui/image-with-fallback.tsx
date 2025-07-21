'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ImageIcon } from 'lucide-react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  fallbackSrc?: string;
}

export const ImageWithFallback = ({
  src,
  alt,
  fill = false,
  width,
  height,
  className = '',
  fallbackSrc = '/placeholder.jpg',
}: ImageWithFallbackProps) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  // If both the original and fallback fail, show a placeholder component
  if (hasError && imgSrc === fallbackSrc) {
    return (
      <div className={`bg-muted flex items-center justify-center ${className}`}>
        <div className="flex flex-col items-center justify-center text-muted-foreground p-4">
          <ImageIcon className="w-8 h-8 mb-2" />
          <span className="text-xs text-center">Image not available</span>
        </div>
      </div>
    );
  }

  const imageProps = {
    src: imgSrc,
    alt,
    onError: handleError,
    className,
    ...(fill ? { fill: true } : { width, height }),
  };

  return <Image {...imageProps} />;
};
