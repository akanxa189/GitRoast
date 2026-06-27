import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar } from './Avatar';
import type { RoastHistory } from '../types';

interface RoastHistoryProps {
  history: RoastHistory[];
  onClear: () => void;
}

export function RoastHistorySection({ history, onClear }: RoastHistoryProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  if (history.length === 0) return null;

  const toggleExpand = (key: string) => {
    setExpanded((prev) => (prev === key ? null : key));
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mt-8"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-mono text-sm text-gray-400 uppercase tracking-wider">
          Roast History
        </h3>
        <button
          type="button"
          onClick={onClear}
          className="font-mono text-xs text-gray-500 hover:text-red-400 transition-colors"
        >
          Clear History
        </button>
      </div>

      <div className="space-y-2">
        {history.map((item) => {
          const key = `${item.username}-${item.date}`;
          const isExpanded = expanded === key;
          const preview =
            item.roast.length > 100
              ? `${item.roast.slice(0, 100)}...`
              : item.roast;
          const date = new Date(item.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <button
              key={key}
              type="button"
              onClick={() => toggleExpand(key)}
              className="w-full text-left gradient-border p-3 sm:p-4 hover:border-orange-500/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Avatar
                  src={item.avatar}
                  alt={item.username}
                  className="w-10 h-10"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-sm text-white font-semibold truncate">
                      @{item.username}
                    </span>
                    <span className="font-mono text-[10px] text-gray-500 shrink-0">
                      {date}
                    </span>
                  </div>
                  <AnimatePresence mode="wait">
                    {isExpanded ? (
                      <motion.p
                        key="full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="font-mono text-xs text-gray-300 mt-2 leading-relaxed"
                      >
                        "{item.roast}"
                      </motion.p>
                    ) : (
                      <motion.p
                        key="preview"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="font-mono text-xs text-gray-400 mt-1 truncate"
                      >
                        {preview}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </motion.section>
  );
}
