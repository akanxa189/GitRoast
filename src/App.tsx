import { motion, AnimatePresence } from 'framer-motion';
import { Header } from './components/Header';
import { UsernameInput } from './components/UsernameInput';
import { IntensitySelector } from './components/IntensitySelector';
import { LoadingState } from './components/LoadingState';
import { RoastCard } from './components/RoastCard';
import { useRoast } from './hooks/useRoast';

function App() {
  const {
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
  } = useRoast();

  const showInput = !result && !loading;

  return (
    <div className="min-h-svh relative">
      <div className="scanline fixed inset-0 z-50" />

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
                data={result.githubData}
                roast={result.roast}
                onRoastAgain={roastAgain}
                onRoastFriend={reset}
                loading={loading}
              />
            </motion.div>
          )}
        </AnimatePresence>

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
