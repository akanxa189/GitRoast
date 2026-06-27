import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const loadingMessages = [
  '> Cloning your repos...',
  '> Reading your commit messages...',
  '> Judging your variable names...',
  '> Counting TODO comments...',
  '> Measuring impostor syndrome...',
  '> Calculating spaghetti code ratio...',
  '> Almost done roasting you...',
];

function TerminalLine({ message }: { message: string }) {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    setDisplayed('');
    let i = 0;
    const interval = setInterval(() => {
      if (i < message.length) {
        setDisplayed(message.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [message]);

  return (
    <span className="text-[#4ade80] font-mono text-sm sm:text-base">
      {displayed}
      <span className="terminal-cursor-green" />
    </span>
  );
}

export function LoadingState() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % loadingMessages.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="gradient-border overflow-hidden"
    >
      <div className="bg-black rounded-lg">
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-900/80 border-b border-gray-800">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
          <span className="ml-2 font-mono text-[10px] text-gray-500">
            gitroast — bash
          </span>
        </div>
        <div className="p-6 sm:p-8 min-h-[120px] flex items-center">
          <TerminalLine key={index} message={loadingMessages[index]} />
        </div>
      </div>
    </motion.div>
  );
}
