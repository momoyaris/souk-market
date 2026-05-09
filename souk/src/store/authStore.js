import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoggedIn: false,

      login: (user, token) => {
        localStorage.setItem('souk_token', token)
        set({ user, token, isLoggedIn: true })
      },

      logout: () => {
        localStorage.removeItem('souk_token')
        set({ user: null, token: null, isLoggedIn: false })
      },

      updateUser: (data) => set((s) => ({ user: { ...s.user, ...data } })),
    }),
    {
      name: 'souk-auth',
      partialize: (s) => ({ user: s.user, token: s.token, isLoggedIn: s.isLoggedIn }),
    }
  )
)
