import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { RoastScores } from '../types';

interface ScoreCardProps {
  scores: RoastScores;
  verdict: string;
}

function getBarColor(score: number): string {
  if (score < 40) return 'bg-red-500';
  if (score < 70) return 'bg-yellow-500';
  return 'bg-green-500';
}

function getTextColor(score: number): string {
  if (score < 40) return 'text-red-400';
  if (score < 70) return 'text-yellow-400';
  return 'text-green-400';
}

const SCORE_LABELS: { key: keyof RoastScores; label: string }[] = [
  { key: 'codeQuality', label: 'Code Quality' },
  { key: 'commitConsistency', label: 'Commit Consistency' },
  { key: 'documentationScore', label: 'Documentation' },
  { key: 'creativityScore', label: 'Creativity' },
];

export function ScoreCard({ scores, verdict }: ScoreCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mt-4 gradient-border p-5 sm:p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-mono text-sm text-gray-400 uppercase tracking-wider">
          Roast Scorecard
        </h3>
        <div className="text-center">
          <span
            className={`text-3xl sm:text-4xl font-bold font-mono ${getTextColor(scores.overallRoastScore)}`}
          >
            {scores.overallRoastScore}
          </span>
          <span className="text-xl ml-1">🔥</span>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        {SCORE_LABELS.map(({ key, label }, i) => (
          <div key={key}>
            <div className="flex justify-between mb-1">
              <span className="font-mono text-xs text-gray-400">{label}</span>
              <span
                className={`font-mono text-xs font-semibold ${getTextColor(scores[key])}`}
              >
                {scores[key]}
              </span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${getBarColor(scores[key])}`}
                initial={{ width: 0 }}
                animate={{ width: inView ? `${scores[key]}%` : 0 }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="font-mono text-sm text-orange-400 text-center italic">
        "{verdict}"
      </p>
    </motion.div>
  );
}
