import { useUIStore } from '@/store/uiStore'

export function useToast() {
  const toast = useUIStore((s) => s.toast)

  return {
    toast,
    success: (msg) => toast(msg, 'success'),
    error: (msg) => toast(msg, 'error'),
    info: (msg) => toast(msg, 'info'),
  }
}
