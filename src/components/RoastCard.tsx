import { useState, useEffect, useRef, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { StatsGrid } from './StatsGrid';
import { ShareButton } from './ShareButton';
import { Avatar } from './Avatar';
import { ScoreCard } from './ScoreCard';
import {
  getEasterEggMessages,
  shouldShowLastSeenBadge,
  formatLastSeenDate,
  isLegendUsername,
} from '../utils/easterEggs';
import type { GitHubData, RoastScores } from '../types';

interface RoastCardProps {
  data: GitHubData;
  roast: string;
  scores: RoastScores;
  verdict: string;
  onRoastAgain: () => void;
  onShowFriendInput: () => void;
  loading?: boolean;
  onCopySuccess?: () => void;
  onShareSuccess?: () => void;
  showFriendButton?: boolean;
}

function TypewriterText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        setDone(true);
        clearInterval(interval);
      }
    }, 25);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <p
      className={`text-sm sm:text-base md:text-lg leading-relaxed text-gray-100 font-mono ${!done ? 'terminal-cursor' : ''}`}
    >
      "{displayed}"
    </p>
  );
}

export const RoastCard = forwardRef<HTMLDivElement, RoastCardProps>(
  function RoastCard(
    {
      data,
      roast,
      scores,
      verdict,
      onRoastAgain,
      onShowFriendInput,
      loading,
      onCopySuccess,
      onShareSuccess,
      showFriendButton = true,
    },
    ref,
  ) {
    const roastCardRef = useRef<HTMLDivElement>(null);
    const [copied, setCopied] = useState(false);

    const setRefs = (el: HTMLDivElement | null) => {
      roastCardRef.current = el;
      if (typeof ref === 'function') {
        ref(el);
      } else if (ref) {
        ref.current = el;
      }
    };

    const languages =
      data.most_used_languages.length > 0
        ? data.most_used_languages.join(', ')
        : 'None';

    const easterEggs = getEasterEggMessages(data);
    const isLegend = isLegendUsername(data.username);
    const showLastSeen = shouldShowLastSeenBadge(data);

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(roast);
        setCopied(true);
        onCopySuccess?.();
        setTimeout(() => setCopied(false), 2000);
      } catch {
        alert('Failed to copy. Select the text manually.');
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full relative"
      >
        <div className="fire-particles" aria-hidden="true" />

        <div
          ref={setRefs}
          className="gradient-border p-5 sm:p-8 relative overflow-hidden z-10"
        >
          <div className="absolute top-3 right-4 text-2xl opacity-30 select-none">
            🔥
          </div>
          <div className="absolute bottom-3 left-4 text-xl opacity-20 select-none">
            🔥
          </div>

          {showLastSeen && (
            <div className="absolute top-3 left-4 font-mono text-[10px] sm:text-xs text-gray-400 bg-gray-900/80 px-2 py-1 rounded border border-gray-700">
              ⚰️ Last Seen: {formatLastSeenDate(data.last_push_date)}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-6">
            <Avatar
              src={data.avatar_url}
              alt={`${data.username}'s avatar`}
              className="w-20 h-20 sm:w-24 sm:h-24"
            />
            <div className="text-center sm:text-left flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold font-mono text-white truncate">
                @{data.username}
              </h2>
              {data.name !== data.username && (
                <p className="text-gray-400 font-mono text-sm truncate">
                  {data.name}
                </p>
              )}
              <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-2 text-xs sm:text-sm font-mono text-gray-400">
                <span>
                  <span className="text-orange-500">{data.public_repos}</span>{' '}
                  repos
                </span>
                <span>·</span>
                <span>
                  <span className="text-orange-500">{data.total_stars}</span>{' '}
                  stars
                </span>
                <span>·</span>
                <span>
                  <span className="text-orange-500">{data.followers}</span>{' '}
                  followers
                </span>
                <span className="hidden sm:inline">·</span>
                <span className="w-full sm:w-auto text-center sm:text-left truncate">
                  <span className="text-orange-500">{languages}</span>
                </span>
              </div>
            </div>
          </div>

          {isLegend ? (
            <div className="mb-6 sm:mb-8 py-4 sm:py-6 px-3 sm:px-4 bg-[#0a0a0a] rounded-lg border border-yellow-500/30">
              <p className="text-sm sm:text-base md:text-lg leading-relaxed text-yellow-400 font-mono text-center">
                🏆 We don't roast legends. Linus would roast us back and we'd
                deserve it.
              </p>
            </div>
          ) : (
            <div className="mb-6 sm:mb-8 py-4 sm:py-6 px-3 sm:px-4 bg-[#0a0a0a] rounded-lg border border-gray-800/50">
              <TypewriterText text={roast} />
            </div>
          )}

          {easterEggs
            .filter((egg) => egg.type !== 'legend')
            .map((egg) => (
              <div
                key={egg.type}
                className="mb-4 py-3 px-4 bg-orange-500/5 rounded-lg border border-orange-500/20"
              >
                <p className="font-mono text-sm text-orange-300">{egg.text}</p>
              </div>
            ))}

          <StatsGrid data={data} />
        </div>

        {!isLegend && <ScoreCard scores={scores} verdict={verdict} />}

        <div className="flex flex-wrap gap-2 sm:gap-3 mt-4">
          <button
            type="button"
            onClick={handleCopy}
            className="flex-1 min-w-[120px] py-2.5 px-4 rounded-lg font-mono text-sm border border-gray-700 text-gray-300 hover:border-orange-500/50 hover:text-orange-400 transition-all"
          >
            {copied ? '✓ Copied!' : '📋 Copy Roast'}
          </button>
          <ShareButton
            cardRef={roastCardRef}
            username={data.username}
            onShareSuccess={onShareSuccess}
          />
          <button
            type="button"
            onClick={onRoastAgain}
            disabled={loading}
            className="flex-1 min-w-[120px] py-2.5 px-4 rounded-lg font-mono text-sm fire-btn text-white disabled:opacity-50"
          >
            🔥 Roast Again
          </button>
          {showFriendButton && (
            <button
              type="button"
              onClick={onShowFriendInput}
              className="flex-1 min-w-[120px] py-2.5 px-4 rounded-lg font-mono text-sm border border-gray-700 text-gray-300 hover:border-orange-500/50 hover:text-orange-400 transition-all"
            >
              👥 Roast a Friend
            </button>
          )}
        </div>
      </motion.div>
    );
  },
);
