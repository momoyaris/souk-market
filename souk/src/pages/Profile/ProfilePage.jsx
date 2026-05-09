import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, Plus, Settings, LogOut, Trash2 } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { supabase } from '@/services/supabase'
import ListingCard from '@/components/cards/ListingCard'
import { CardSkeleton } from '@/components/ui/Skeleton'
import Button from '@/components/ui/Button'
import { useToast } from '@/hooks/useToast'

const TABS = ['Mes annonces', 'Favoris', 'Messages']

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState(0)
  const [myListings, setMyListings] = useState([])
  const [favListings, setFavListings] = useState([])
  const [loadingListings, setLoadingListings] = useState(true)
  const [loadingFavs, setLoadingFavs] = useState(false)
  const { user, logout } = useAuthStore()
  const { success, error } = useToast()
  const navigate = useNavigate()

  // Charger mes annonces
  useEffect(() => {
    async function fetchMyListings() {
      if (!user) return
      setLoadingListings(true)
      const { data, error: err } = await supabase
        .from('listings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (err) error(err.message)
      else setMyListings(data || [])
      setLoadingListings(false)
    }
    fetchMyListings()
  }, [user])

  // Charger les favoris quand on clique sur l'onglet
  useEffect(() => {
    async function fetchFavs() {
      if (!user || activeTab !== 1) return
      setLoadingFavs(true)
      const { data, error: err } = await supabase
        .from('favorites')
        .select('listing:listings(*)')
        .eq('user_id', user.id)

      if (err) error(err.message)
      else setFavListings(data?.map(f => f.listing) || [])
      setLoadingFavs(false)
    }
    fetchFavs()
  }, [user, activeTab])

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  async function handleDeleteListing(e, listingId) {
    e.preventDefault()
    e.stopPropagation()
    if (!confirm('Supprimer cette annonce ?')) return

    const { error: err } = await supabase
      .from('listings')
      .delete()
      .eq('id', listingId)

    if (err) {
      error('Erreur lors de la suppression')
    } else {
      setMyListings(l => l.filter(x => x.id !== listingId))
      success('✅ Annonce supprimée')
    }
  }

  // Nom depuis les metadata Supabase
  const userName = user?.user_metadata?.name || user?.email || 'Utilisateur'
  const userAvatar = userName[0]?.toUpperCase() || 'U'
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
    : ''

  return (
    <div className="page-transition max-w-4xl mx-auto px-4 md:px-6 py-8">
      {/* Profile header */}
      <motion.div
        className="bg-white rounded-3xl p-6 md:p-8 border border-sand-200 shadow-card flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-8"
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      >
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-2xl shrink-0">
          {userAvatar}
        </div>

        <div className="flex-1">
          <h1 className="font-serif text-2xl text-sand-900">{userName}</h1>
          <div className="flex items-center gap-1.5 text-sm text-sand-400 mt-0.5">
            <Star size={13} className="fill-yellow-400 stroke-yellow-400" />
            <span>Membre depuis {memberSince}</span>
          </div>
          <div className="flex gap-6 mt-3">
            {[
              [myListings.length, 'Annonces'],
              [myListings.filter(l => !l.is_active).length, 'Inactives'],
              [favListings.length, 'Favoris'],
            ].map(([n, l]) => (
              <div key={l} className="text-center">
                <p className="font-bold text-sand-900 text-lg leading-none">{n}</p>
                <p className="text-xs text-sand-400 mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </div>

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
            {tab === 'Mes annonces' && myListings.length > 0 && (
              <span className="ml-1.5 bg-brand-100 text-brand-600 text-xs px-1.5 py-0.5 rounded-full">
                {myListings.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab — Mes annonces */}
      {activeTab === 0 && (
        loadingListings ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : myListings.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {myListings.map((l, i) => (
              <div key={l.id} className="relative">
                <ListingCard listing={l} index={i} />
                {/* Bouton supprimer */}
                <button
                  onClick={(e) => handleDeleteListing(e, l.id)}
                  className="absolute bottom-16 right-2 w-7 h-7 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white shadow transition-colors z-10"
                  title="Supprimer"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <Empty icon="📦" msg="Tu n'as pas encore d'annonces"
            action={() => navigate('/publish')} actionLabel="Publier ma première annonce" />
        )
      )}

      {/* Tab — Favoris */}
      {activeTab === 1 && (
        loadingFavs ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : favListings.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {favListings.map((l, i) => <ListingCard key={l.id} listing={l} index={i} />)}
          </div>
        ) : (
          <Empty icon="❤️" msg="Aucun favori pour l'instant"
            action={() => navigate('/')} actionLabel="Explorer les annonces" />
        )
      )}

      {/* Tab — Messages */}
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