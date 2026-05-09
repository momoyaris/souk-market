import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '@/services/supabase'

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      session: null,
      isLoggedIn: false,

      // Inscription
      register: async ({ name, email, phone, password }) => {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name, phone }
          }
        })
        if (error) throw error
        set({ user: data.user, session: data.session, isLoggedIn: !!data.session })
        return data
      },

      // Connexion
      login: async ({ email, password }) => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        set({ user: data.user, session: data.session, isLoggedIn: true })
        return data
      },

      // Déconnexion
      logout: async () => {
        await supabase.auth.signOut()
        set({ user: null, session: null, isLoggedIn: false })
      },

      // Initialiser la session au chargement
      init: async () => {
        const { data } = await supabase.auth.getSession()
        if (data.session) {
          set({
            user: data.session.user,
            session: data.session,
            isLoggedIn: true,
          })
        }
        // Écouter les changements de session
        supabase.auth.onAuthStateChange((_event, session) => {
          set({
            user: session?.user || null,
            session,
            isLoggedIn: !!session,
          })
        })
      },

      updateUser: (data) => set((s) => ({ user: { ...s.user, ...data } })),
    }),
    {
      name: 'souk-auth',
      partialize: (s) => ({ user: s.user, isLoggedIn: s.isLoggedIn }),
    }
  )
)