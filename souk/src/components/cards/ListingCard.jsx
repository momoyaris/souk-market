import { Heart, MapPin, ImageOff } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useFavoritesStore } from '@/store/favoritesStore'
import { useToast } from '@/hooks/useToast'
import { formatPrice } from '@/utils/helpers'
import Badge from '@/components/ui/Badge'

export default function ListingCard({ listing, index = 0 }) {
  const { toggle, isFav } = useFavoritesStore()
  const { toast } = useToast()
  const fav = isFav(listing.id)

  // Première image ou fallback
  const firstImage = listing.images?.[0] || null

  function handleFav(e) {
    e.preventDefault()
    e.stopPropagation()
    const added = toggle(listing)
    toast(added ? '❤️ Ajouté aux favoris' : 'Retiré des favoris')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link
        to={`/listing/${listing.id}`}
        className="group block bg-white rounded-2xl overflow-hidden border border-sand-200 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-400"
        aria-label={`Voir l'annonce : ${listing.title}`}
      >
        {/* Image */}
        <div className="relative w-full aspect-[4/3] bg-sand-200 flex items-center justify-center overflow-hidden">
          {firstImage ? (
            <img
              src={firstImage}
              alt={listing.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.nextSibling.style.display = 'flex'
              }}
            />
          ) : null}

          {/* Fallback si pas d'image ou erreur */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ display: firstImage ? 'none' : 'flex' }}
          >
            <ImageOff size={32} className="text-sand-400" />
          </div>

          {/* Badge nouveau — moins de 3 jours */}
          {listing.created_at && (
            new Date() - new Date(listing.created_at) < 3 * 24 * 60 * 60 * 1000
          ) && (
            <span className="absolute top-2.5 left-2.5">
              <Badge variant="new">Nouveau</Badge>
            </span>
          )}

          {/* Favorite button */}
          <button
            onClick={handleFav}
            aria-label={fav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            aria-pressed={fav}
            className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow transition-transform hover:scale-110 active:scale-95"
          >
            <Heart
              size={15}
              className={fav ? 'fill-brand-500 stroke-brand-500' : 'stroke-sand-500'}
            />
          </button>
        </div>

        {/* Body */}
        <div className="p-4">
          <p className="text-lg font-bold text-sand-900 mb-0.5">
            {formatPrice(listing.price)}
          </p>
          <p className="text-sm text-sand-500 mb-3 line-clamp-2">{listing.title}</p>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-xs text-sand-400">
              <MapPin size={12} aria-hidden="true" />
              {listing.city}
            </span>
            <Badge>{listing.condition}</Badge>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}