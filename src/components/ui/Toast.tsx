import { motion, AnimatePresence } from 'motion/react';
import { useAudio } from '../../context/AudioContext';

export function ToastContainer() {
  const { toasts } = useAudio();

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none w-full max-w-[90%] px-4">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="bg-neutral-800 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg pointer-events-auto shadow-black/10 border border-neutral-700/50 text-center"
          >
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
