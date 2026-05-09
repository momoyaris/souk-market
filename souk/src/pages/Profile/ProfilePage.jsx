import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, Plus, Settings, LogOut } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { LISTINGS } from '@/utils/mockData'
import { useFavoritesStore } from '@/store/favoritesStore'
import ListingCard from '@/components/cards/ListingCard'
import Button from '@/components/ui/Button'

const TABS = ['Mes annonces', 'Favoris', 'Messages']

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState(0)
  const { user, logout } = useAuthStore()
  const { ids } = useFavoritesStore()
  const navigate = useNavigate()

  const myListings = LISTINGS.slice(0, 4)
  const favListings = LISTINGS.filter(l => ids.includes(l.id))

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="page-transition max-w-4xl mx-auto px-4 md:px-6 py-8">
      {/* Profile header */}
      <motion.div
        className="bg-white rounded-3xl p-6 md:p-8 border border-sand-200 shadow-card flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-8"
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      >
        {/* Avatar */}
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-2xl shrink-0">
          {user?.avatar || 'U'}
        </div>

        <div className="flex-1">
          <h1 className="font-serif text-2xl text-sand-900">{user?.name}</h1>
          <div className="flex items-center gap-1.5 text-sm text-sand-400 mt-0.5">
            <Star size={13} className="fill-yellow-400 stroke-yellow-400" />
            <span>4.9 · Membre depuis Jan 2025</span>
          </div>
          {/* Stats */}
          <div className="flex gap-6 mt-3">
            {[['12', 'Annonces'], ['8', 'Vendus'], ['4.9', 'Note']].map(([n, l]) => (
              <div key={l} className="text-center">
                <p className="font-bold text-sand-900 text-lg leading-none">{n}</p>
                <p className="text-xs text-sand-400 mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 flex-wrap">
          <Button size="sm" onClick={() => navigate('/publish')}>
            <Plus size={14} /> Nouvelle annonce
          </Button>
          <Button variant="ghost" size="sm">
            <Settings size={14} /> Paramètres
          </Button>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut size={14} /> Déconnecter
          </Button>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex border-b border-sand-200 mb-6" role="tablist">
        {TABS.map((tab, i) => (
          <button
            key={tab} role="tab" aria-selected={activeTab === i}
            onClick={() => setActiveTab(i)}
            className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors focus:outline-none ${
              activeTab === i
                ? 'border-brand-500 text-brand-500'
                : 'border-transparent text-sand-400 hover:text-sand-700'
            }`}
          >
            {tab}
            {tab === 'Favoris' && ids.length > 0 && (
              <span className="ml-1.5 bg-brand-100 text-brand-600 text-xs px-1.5 py-0.5 rounded-full">
                {ids.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 0 && (
        myListings.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {myListings.map((l, i) => <ListingCard key={l.id} listing={l} index={i} />)}
          </div>
        ) : (
          <Empty icon="📦" msg="Tu n'as pas encore d'annonces" action={() => navigate('/publish')} actionLabel="Publier ma première annonce" />
        )
      )}

      {activeTab === 1 && (
        favListings.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {favListings.map((l, i) => <ListingCard key={l.id} listing={l} index={i} />)}
          </div>
        ) : (
          <Empty icon="❤️" msg="Aucun favori pour l'instant" action={() => navigate('/')} actionLabel="Explorer les annonces" />
        )
      )}

      {activeTab === 2 && (
        <div className="text-center py-12">
          <Button onClick={() => navigate('/messages')}>Ouvrir la messagerie</Button>
        </div>
      )}
    </div>
  )
}

function Empty({ icon, msg, action, actionLabel }) {
  return (
    <div className="text-center py-20 text-sand-400">
      <p className="text-5xl mb-3">{icon}</p>
      <p className="font-semibold text-sand-600 mb-4">{msg}</p>
      {action && <Button variant="ghost" onClick={action}>{actionLabel}</Button>}
    </div>
  )
}
