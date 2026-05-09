import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useFavoritesStore } from '@/store/favoritesStore'
import { LISTINGS } from '@/utils/mockData'
import ListingCard from '@/components/cards/ListingCard'
import Button from '@/components/ui/Button'

export default function FavoritesPage() {
  const { ids } = useFavoritesStore()
  const navigate = useNavigate()
  const favorites = LISTINGS.filter(l => ids.includes(l.id))

  return (
    <div className="page-transition max-w-7xl mx-auto px-4 md:px-6 py-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-serif text-3xl text-sand-900">Mes favoris</h1>
            <p className="text-sand-400 text-sm mt-0.5">
              {favorites.length} annonce{favorites.length !== 1 ? 's' : ''} sauvegardée{favorites.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {favorites.map((l, i) => <ListingCard key={l.id} listing={l} index={i} />)}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-6xl mb-4">❤️</p>
            <h2 className="font-semibold text-sand-700 text-lg mb-2">Aucun favori pour l'instant</h2>
            <p className="text-sand-400 text-sm mb-6">Clique sur ❤️ sur n'importe quelle annonce pour la retrouver ici</p>
            <Button onClick={() => navigate('/')}>Explorer les annonces</Button>
          </div>
        )}
      </motion.div>
    </div>
  )
}
