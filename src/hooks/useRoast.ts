import { useState, useCallback } from 'react';
import { fetchGitHubData } from '../services/github';
import { generateRoast } from '../services/groq';
import type { RoastResult, RoastError, RoastIntensity } from '../types';

interface UseRoastReturn {
  result: RoastResult | null;
  error: RoastError | null;
  loading: boolean;
  username: string;
  intensity: RoastIntensity;
  setUsername: (username: string) => void;
  setIntensity: (intensity: RoastIntensity) => void;
  roast: () => Promise<void>;
  reset: () => void;
  roastAgain: () => Promise<void>;
}

export function useRoast(): UseRoastReturn {
  const [result, setResult] = useState<RoastResult | null>(null);
  const [error, setError] = useState<RoastError | null>(null);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [intensity, setIntensity] = useState<RoastIntensity>(2);

  const runRoast = useCallback(
    async (targetUsername: string, targetIntensity: RoastIntensity) => {
      setLoading(true);
      setError(null);
      setResult(null);

      try {
        const githubData = await fetchGitHubData(targetUsername);
        const roastText = await generateRoast(githubData, targetIntensity);
        setResult({ githubData, roast: roastText });
      } catch (err) {
        setError(err as RoastError);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const roast = useCallback(async () => {
    await runRoast(username, intensity);
  }, [username, intensity, runRoast]);

  const roastAgain = useCallback(async () => {
    if (!result) return;
    await runRoast(result.githubData.username, intensity);
  }, [result, intensity, runRoast]);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setUsername('');
    setIntensity(2);
  }, []);

  return {
    result,
    error,
    loading,
    username,
    intensity,
    setUsername,
    setIntensity,
    roast,
    reset,
    roastAgain,
  };
}
