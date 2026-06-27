import { motion } from 'framer-motion';
import { Avatar } from './Avatar';
import type { RoastResult, VoteChoice } from '../types';

interface RoastComparisonProps {
  selfResult: RoastResult;
  friendResult: RoastResult;
  voteChoice: VoteChoice;
  onVote: (choice: VoteChoice) => void;
}

const WINNER_MESSAGES = {
  self: [
    'Your friend codes better, but YOU got roasted harder. Congrats? 🏆',
    'You took the L. Your roast was spicier than theirs. 🔥',
    'Victory through humiliation! You win the roast-off. 😈',
  ],
  friend: [
    'Your friend got absolutely destroyed. You\'re safe... for now. 😎',
    'Friend took the heat. You\'re the roast champion by default! 👑',
    'They got roasted harder. Send them this screenshot immediately. 📸',
  ],
};

function getWinnerMessage(choice: VoteChoice): string {
  if (!choice) return '';
  const messages = WINNER_MESSAGES[choice];
  return messages[Math.floor(Math.random() * messages.length)];
}

function MiniRoastCard({
  result,
  label,
}: {
  result: RoastResult;
  label: string;
}) {
  return (
    <div className="flex-1 min-w-0 bg-[#0a0a0a] border border-gray-800 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-3">
        <Avatar
          src={result.githubData.avatar_url}
          alt={result.githubData.username}
          className="w-8 h-8"
        />
        <div>
          <p className="font-mono text-xs text-gray-500">{label}</p>
          <p className="font-mono text-sm text-white font-semibold">
            @{result.githubData.username}
          </p>
        </div>
        <span className="ml-auto font-mono text-lg font-bold text-orange-400">
          {result.scores.overallRoastScore}🔥
        </span>
      </div>
      <p className="font-mono text-xs sm:text-sm text-gray-300 leading-relaxed">
        "{result.roast}"
      </p>
    </div>
  );
}

export function RoastComparison({
  selfResult,
  friendResult,
  voteChoice,
  onVote,
}: RoastComparisonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 gradient-border p-5 sm:p-6"
    >
      <h3 className="font-mono text-sm text-gray-400 uppercase tracking-wider mb-4 text-center">
        Roast-Off Comparison
      </h3>

      <div className="flex flex-col sm:flex-row gap-4">
        <MiniRoastCard result={selfResult} label="You" />
        <div className="hidden sm:flex items-center justify-center text-2xl text-gray-600">
          VS
        </div>
        <MiniRoastCard result={friendResult} label="Friend" />
      </div>

      <div className="mt-6 text-center">
        <p className="font-mono text-sm text-gray-300 mb-3">
          Who got roasted harder?
        </p>
        <div className="flex gap-3 justify-center">
          <button
            type="button"
            onClick={() => onVote('self')}
            className={`py-2 px-4 rounded-lg font-mono text-sm border transition-all ${
              voteChoice === 'self'
                ? 'border-orange-500 bg-orange-500/20 text-orange-400'
                : 'border-gray-700 text-gray-300 hover:border-orange-500/50'
            }`}
          >
            😭 Me
          </button>
          <button
            type="button"
            onClick={() => onVote('friend')}
            className={`py-2 px-4 rounded-lg font-mono text-sm border transition-all ${
              voteChoice === 'friend'
                ? 'border-orange-500 bg-orange-500/20 text-orange-400'
                : 'border-gray-700 text-gray-300 hover:border-orange-500/50'
            }`}
          >
            😂 My Friend
          </button>
        </div>

        {voteChoice && (
          <motion.p
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 font-mono text-sm text-orange-400"
          >
            {getWinnerMessage(voteChoice)}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}

interface FriendRoastInputProps {
  friendUsername: string;
  onFriendUsernameChange: (value: string) => void;
  onRoastFriend: () => void;
  loading: boolean;
  error: string | null;
}

export function FriendRoastInput({
  friendUsername,
  onFriendUsernameChange,
  onRoastFriend,
  loading,
  error,
}: FriendRoastInputProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mt-6 gradient-border p-5 sm:p-6"
    >
      <p className="font-mono text-sm text-gray-300 text-center mb-4">
        Think your friend codes better?
        <br />
        <span className="text-orange-400">Prove it 👇</span>
      </p>

      <div className="flex gap-2">
        <input
          type="text"
          value={friendUsername}
          onChange={(e) => onFriendUsernameChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onRoastFriend()}
          placeholder="friend's GitHub username"
          disabled={loading}
          className="flex-1 px-4 py-2.5 rounded-lg bg-[#0a0a0a] border border-gray-700 font-mono text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-orange-500/50 disabled:opacity-50"
        />
        <button
          type="button"
          onClick={onRoastFriend}
          disabled={loading || !friendUsername.trim()}
          className="py-2.5 px-4 rounded-lg font-mono text-sm fire-btn text-white disabled:opacity-50 shrink-0"
        >
          {loading ? '...' : 'Roast Them'}
        </button>
      </div>

      {error && (
        <p className="mt-2 font-mono text-xs text-red-400 text-center">
          {error}
        </p>
      )}
    </motion.div>
  );
}
