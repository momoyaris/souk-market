import { AnimatePresence, motion } from 'framer-motion'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { useUIStore } from '@/store/uiStore'

const icons = {
  success: <CheckCircle size={16} className="text-green-500" />,
  error:   <AlertCircle size={16} className="text-red-500" />,
  info:    <Info size={16} className="text-blue-500" />,
  default: null,
}

export default function ToastContainer() {
  const { toasts, removeToast } = useUIStore()

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center pointer-events-none"
      aria-live="polite"
    >
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.22 }}
            className="pointer-events-auto flex items-center gap-3 bg-sand-900 text-white px-5 py-3 rounded-full shadow-soft text-sm font-semibold max-w-sm"
          >
            {icons[t.type]}
            <span>{t.message}</span>
            <button
              onClick={() => removeToast(t.id)}
              className="ml-1 text-white/60 hover:text-white transition-colors"
              aria-label="Fermer"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
