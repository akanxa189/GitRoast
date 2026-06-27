import { useState } from 'react';
import html2canvas from 'html2canvas';

interface ShareButtonProps {
  cardRef: React.RefObject<HTMLDivElement | null>;
  username: string;
}

export function ShareButton({ cardRef, username }: ShareButtonProps) {
  const [sharing, setSharing] = useState(false);

  const handleShare = async () => {
    if (!cardRef.current || sharing) return;
    setSharing(true);

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#111111',
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const link = document.createElement('a');
      link.download = `github-roast-${username}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch {
      alert('Failed to capture image. Try again.');
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
