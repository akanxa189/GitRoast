import { motion, AnimatePresence } from 'framer-motion';

interface ToastContainerProps {
  toasts: { id: number; message: string }[];
  onDismiss: (id: number) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="pointer-events-auto px-4 py-3 rounded-lg bg-gray-900 border border-orange-500/40 shadow-lg shadow-orange-500/10 font-mono text-sm text-gray-100 max-w-sm text-center"
            onClick={() => onDismiss(toast.id)}
          >
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
