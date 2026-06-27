import { useState, useCallback } from 'react';
import type { RoastHistory, RoastResult, RoastIntensity } from '../types';

const STORAGE_KEY = 'github_roast_history';
const MAX_HISTORY = 5;

function loadHistory(): RoastHistory[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RoastHistory[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveHistory(items: RoastHistory[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function useRoastHistory() {
  const [history, setHistory] = useState<RoastHistory[]>(loadHistory);

  const addToHistory = useCallback(
    (result: RoastResult, intensity: RoastIntensity) => {
      const entry: RoastHistory = {
        username: result.githubData.username,
        avatar: result.githubData.avatar_url,
        roast: result.roast,
        intensity,
        date: new Date().toISOString(),
        stats: {
          repos: result.githubData.public_repos,
          stars: result.githubData.total_stars,
          followers: result.githubData.followers,
          topLanguage: result.githubData.most_used_languages[0] ?? 'None',
        },
      };

      setHistory((prev) => {
        const filtered = prev.filter((h) => h.username !== entry.username);
        const updated = [entry, ...filtered].slice(0, MAX_HISTORY);
        saveHistory(updated);
        return updated;
      });
    },
    [],
  );

  const clearHistory = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setHistory([]);
  }, []);

  return { history, addToHistory, clearHistory };
}
