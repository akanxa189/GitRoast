import {
  getDaysSinceLastCommit,
  getCommitConsistencyRating,
} from '../services/github';
import type { GitHubData } from '../types';

interface StatsGridProps {
  data: GitHubData;
}

export function StatsGrid({ data }: StatsGridProps) {
  const daysSince = getDaysSinceLastCommit(data.last_push_date);
  const consistency = getCommitConsistencyRating(daysSince);
  const topLanguage = data.most_used_languages[0] ?? 'None';

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <StatCard
        label="Top Language"
        value={topLanguage}
        badge
      />
      <StatCard
        label="Last Commit"
        value={
          daysSince !== null ? `${daysSince}d ago` : 'Never'
        }
      />
      <StatCard
        label="README Score"
        value={`${data.readme_count}/10`}
      />
      <StatCard
        label="Commit Consistency"
        value={`${consistency.emoji} ${consistency.label}`}
      />
    </div>
  );
}

function StatCard({
  label,
  value,
  badge,
}: {
  label: string;
  value: string;
  badge?: boolean;
}) {
  return (
    <div className="bg-[#0a0a0a] border border-gray-800 rounded-lg p-3 text-center">
      <p className="text-[10px] sm:text-xs font-mono text-gray-500 uppercase tracking-wider mb-1">
        {label}
      </p>
      {badge ? (
        <span className="inline-block px-2 py-0.5 rounded-full text-xs sm:text-sm font-mono bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-400 border border-orange-500/30">
          {value}
        </span>
      ) : (
        <p className="text-xs sm:text-sm font-mono text-gray-200 truncate">
          {value}
        </p>
      )}
    </div>
  );
}
