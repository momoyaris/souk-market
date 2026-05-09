import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useFavoritesStore = create(
  persist(
    (set, get) => ({
      ids: [],

      toggle: (listing) => {
        const { ids } = get()
        if (ids.includes(listing.id)) {
          set({ ids: ids.filter((i) => i !== listing.id) })
          return false
        } else {
          set({ ids: [...ids, listing.id] })
          return true
        }
      },

      isFav: (id) => get().ids.includes(id),

      clear: () => set({ ids: [] }),
    }),
    { name: 'souk-favorites' }
  )
)
