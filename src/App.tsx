import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from './components/Header';
import { UsernameInput } from './components/UsernameInput';
import { IntensitySelector } from './components/IntensitySelector';
import { LoadingState } from './components/LoadingState';
import { RoastCard } from './components/RoastCard';
import { RoastHistorySection } from './components/RoastHistory';
import { ToastContainer } from './components/ToastContainer';
import {
  FriendRoastInput,
  RoastComparison,
} from './components/FriendRoast';
import { useRoast } from './hooks/useRoast';
import { useToast } from './hooks/useToast';

function App() {
  const roastCardRef = useRef<HTMLDivElement>(null);
  const [showFriendInput, setShowFriendInput] = useState(false);
  const { toasts, showToast, dismissToast } = useToast();

  const {
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
    clearHistory,
  } = useRoast();

  const showInput = !result && !loading;

  useEffect(() => {
    if (result && !loading) {
      setTimeout(() => {
        roastCardRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    }
  }, [result, loading]);

  const handleCopySuccess = () => {
    showToast('Roast copied! Time to send this to your PM 😈');
  };

  const handleShareSuccess = () => {
    showToast('Image saved! Share the pain on social media 🔥');
  };

  return (
    <div className="min-h-svh relative">
      <div className="scanline fixed inset-0 z-50" />
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8 sm:py-12">
        <Header />

        <AnimatePresence mode="wait">
          {showInput && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="gradient-border p-5 sm:p-8 space-y-6"
            >
              <UsernameInput
                value={username}
                onChange={setUsername}
                onSubmit={roast}
                disabled={loading}
              />
              <IntensitySelector
                value={intensity}
                onChange={setIntensity}
                disabled={loading}
              />
              <button
                type="button"
                onClick={roast}
                disabled={loading || !username.trim()}
                className="w-full py-3.5 rounded-lg font-mono font-semibold text-white fire-btn disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
              >
                Roast Me
              </button>

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 rounded-lg bg-red-500/10 border border-red-500/30"
                >
                  <p className="font-mono text-sm text-red-400">
                    <span className="text-red-500">error:</span> {error.message}
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}

          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <LoadingState />
            </motion.div>
          )}

          {result && !loading && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <RoastCard
                ref={roastCardRef}
                data={result.githubData}
                roast={result.roast}
                scores={result.scores}
                verdict={result.verdict}
                onRoastAgain={roastAgain}
                onShowFriendInput={() => setShowFriendInput(true)}
                loading={loading}
                onCopySuccess={handleCopySuccess}
                onShareSuccess={handleShareSuccess}
              />

              {showFriendInput && !friendResult && (
                <FriendRoastInput
                  friendUsername={friendUsername}
                  onFriendUsernameChange={setFriendUsername}
                  onRoastFriend={roastFriend}
                  loading={friendLoading}
                  error={friendError?.message ?? null}
                />
              )}

              {friendLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6"
                >
                  <LoadingState />
                </motion.div>
              )}

              {friendResult && !friendLoading && (
                <RoastComparison
                  selfResult={result}
                  friendResult={friendResult}
                  voteChoice={voteChoice}
                  onVote={setVoteChoice}
                />
              )}

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={reset}
                  className="font-mono text-xs text-gray-500 hover:text-orange-400 transition-colors"
                >
                  ← Roast someone else
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <RoastHistorySection history={history} onClear={clearHistory} />

        <footer className="mt-12 text-center">
          <p className="font-mono text-xs text-gray-600">
            Built with 🔥 and questionable life choices
          </p>
          <p className="font-mono text-xs text-gray-700 mt-1">
            GitHub API · Groq AI · No developers were harmed*
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
