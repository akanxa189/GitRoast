import { useState } from 'react';

interface AvatarProps {
  src: string;
  alt: string;
  className?: string;
}

export function Avatar({ src, alt, className = '' }: AvatarProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={`relative shrink-0 ${className}`}>
      {!loaded && !error && (
        <div className="absolute inset-0 rounded-full avatar-skeleton" />
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`w-full h-full rounded-full border-2 border-orange-500/50 object-cover transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
      {error && (
        <div className="absolute inset-0 rounded-full bg-gray-800 border-2 border-orange-500/50 flex items-center justify-center text-2xl">
          👤
        </div>
      )}
    </div>
  );
}
