import { useState, useCallback } from 'react';
import { fetchGitHubData } from '../services/github';
import { generateRoast } from '../services/groq';
import { useRoastHistory } from './useRoastHistory';
import type {
  RoastResult,
  RoastError,
  RoastIntensity,
  RoastHistory,
  VoteChoice,
} from '../types';

interface UseRoastReturn {
  result: RoastResult | null;
  friendResult: RoastResult | null;
  error: RoastError | null;
  friendError: RoastError | null;
  loading: boolean;
  friendLoading: boolean;
  username: string;
  friendUsername: string;
  intensity: RoastIntensity;
  voteChoice: VoteChoice;
  history: RoastHistory[];
  setUsername: (username: string) => void;
  setFriendUsername: (username: string) => void;
  setIntensity: (intensity: RoastIntensity) => void;
  roast: () => Promise<void>;
  roastFriend: () => Promise<void>;
  reset: () => void;
  roastAgain: () => Promise<void>;
  setVoteChoice: (choice: VoteChoice) => void;
  clearFriend: () => void;
  clearHistory: () => void;
}

export function useRoast(): UseRoastReturn {
  const [result, setResult] = useState<RoastResult | null>(null);
  const [friendResult, setFriendResult] = useState<RoastResult | null>(null);
  const [error, setError] = useState<RoastError | null>(null);
  const [friendError, setFriendError] = useState<RoastError | null>(null);
  const [loading, setLoading] = useState(false);
  const [friendLoading, setFriendLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [friendUsername, setFriendUsername] = useState('');
  const [intensity, setIntensity] = useState<RoastIntensity>(2);
  const [voteChoice, setVoteChoice] = useState<VoteChoice>(null);
  const { history, addToHistory, clearHistory } = useRoastHistory();

  const runRoast = useCallback(
    async (
      targetUsername: string,
      targetIntensity: RoastIntensity,
      mode: 'self' | 'friend' = 'self',
    ) => {
      const setLoadingState = mode === 'self' ? setLoading : setFriendLoading;
      const setErrorState = mode === 'self' ? setError : setFriendError;
      const setResultState = mode === 'self' ? setResult : setFriendResult;

      if (mode === 'self') {
        setResult(null);
        setFriendResult(null);
        setVoteChoice(null);
      }

      setLoadingState(true);
      setErrorState(null);

      try {
        const githubData = await fetchGitHubData(targetUsername);
        const response = await generateRoast(githubData, targetIntensity);
        const roastResult: RoastResult = {
          githubData,
          roast: response.roast,
          scores: response.scores,
          verdict: response.verdict,
        };
        setResultState(roastResult);

        if (mode === 'self') {
          addToHistory(roastResult, targetIntensity);
        }
      } catch (err) {
        setErrorState(err as RoastError);
      } finally {
        setLoadingState(false);
      }
    },
    [addToHistory],
  );

  const roast = useCallback(async () => {
    await runRoast(username, intensity, 'self');
  }, [username, intensity, runRoast]);

  const roastFriend = useCallback(async () => {
    if (!friendUsername.trim()) return;
    await runRoast(friendUsername, intensity, 'friend');
  }, [friendUsername, intensity, runRoast]);

  const roastAgain = useCallback(async () => {
    if (!result) return;
    await runRoast(result.githubData.username, intensity, 'self');
  }, [result, intensity, runRoast]);

  const reset = useCallback(() => {
    setResult(null);
    setFriendResult(null);
    setError(null);
    setFriendError(null);
    setUsername('');
    setFriendUsername('');
    setIntensity(2);
    setVoteChoice(null);
  }, []);

  const clearFriend = useCallback(() => {
    setFriendResult(null);
    setFriendError(null);
    setFriendUsername('');
    setVoteChoice(null);
  }, []);

  return {
    result,
    friendResult,
    error,
    friendError,
    loading,
    friendLoading,
    username,
    friendUsername,
    intensity,
    voteChoice,
    history,
    setUsername,
    setFriendUsername,
    setIntensity,
    roast,
    roastFriend,
    reset,
    roastAgain,
    setVoteChoice,
    clearFriend,
    clearHistory,
  };
}
