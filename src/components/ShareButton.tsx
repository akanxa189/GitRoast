import { useState } from 'react';
import confetti from 'canvas-confetti';
import { captureCardAsImage } from '../utils/captureCard';

interface ShareButtonProps {
  cardRef: React.RefObject<HTMLDivElement | null>;
  username: string;
  onShareSuccess?: () => void;
}

export function ShareButton({
  cardRef,
  username,
  onShareSuccess,
}: ShareButtonProps) {
  const [sharing, setSharing] = useState(false);

  const handleShare = async () => {
    const element = cardRef.current;
    if (!element || sharing) return;

    setSharing(true);

    try {
      await captureCardAsImage(element, `github-roast-${username}.png`);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f97316', '#ef4444', '#fbbf24', '#4ade80'],
      });

      onShareSuccess?.();
    } catch (err) {
      console.error('Share as image failed:', err);
      alert(
        'Failed to capture image. Try again — make sure your avatar has finished loading.',
      );
    } finally {
      setSharing(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      disabled={sharing}
      className="flex-1 min-w-[120px] py-2.5 px-4 rounded-lg font-mono text-sm border border-gray-700 text-gray-300 hover:border-orange-500/50 hover:text-orange-400 transition-all disabled:opacity-50"
    >
      {sharing ? 'Capturing...' : '📸 Share as Image'}
    </button>
  );
}
