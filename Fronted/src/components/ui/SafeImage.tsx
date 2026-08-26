import { useState, type ReactNode } from 'react';

interface SafeImageProps {
  src: string;
  alt: string;
}

export function SafeImage({ src, alt }: SafeImageProps): ReactNode {
  const [failed, setFailed] = useState<boolean>(false);

  if (failed) {
    return <div className="safe-image-fallback" aria-label={alt}>🖼️</div>;
  }

  return (
    <img
      className="safe-image"
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
