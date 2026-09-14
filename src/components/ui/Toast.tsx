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
            className="bg-[#051c13] text-amber-200 text-xs font-semibold px-4 py-2.5 rounded-full shadow-2xl pointer-events-auto border border-amber-500/30 text-center"
          >
            {toast.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
