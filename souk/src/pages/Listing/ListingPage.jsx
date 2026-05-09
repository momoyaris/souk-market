import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Star, ChevronLeft, Heart, MessageCircle, Share2, Flag } from 'lucide-react'
import { useListing } from '@/hooks/useListings'
import { useFavoritesStore } from '@/store/favoritesStore'
import { useAuthStore } from '@/store/authStore'
import { useToast } from '@/hooks/useToast'
import { formatPrice, formatDate } from '@/utils/helpers'
import { CardSkeleton } from '@/components/ui/Skeleton'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

export default function ListingPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { listing, loading } = useListing(id)
  const { toggle, isFav } = useFavoritesStore()
  const { isLoggedIn } = useAuthStore()
  const { success, toast } = useToast()

  if (loading) return (
    <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      <CardSkeleton />
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => <CardSkeleton key={i} />)}
      </div>
    </div>
  )

  if (!listing) return (
    <div className="text-center py-32">
      <p className="text-5xl mb-4">😕</p>
      <p className="text-lg font-semibold text-sand-700">Annonce introuvable</p>
      <Button className="mt-6" onClick={() => navigate('/')}>Retour à l'accueil</Button>
    </div>
  )

  const fav = isFav(listing.id)

  function handleFav() {
    const added = toggle(listing)
    added ? success('❤️ Ajouté aux favoris') : toast('Retiré des favoris')
  }

  function handleContact() {
    if (!isLoggedIn) { navigate('/login'); return }
    navigate('/messages')
  }

  return (
    <div className="page-transition max-w-5xl mx-auto px-4 md:px-6 py-6">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-sand-500 hover:text-sand-900 transition-colors mb-6 focus:outline-none focus:ring-2 focus:ring-brand-400 rounded"
        aria-label="Retour"
      >
        <ChevronLeft size={16} /> Retour
      </button>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-8">
        {/* Left — gallery */}
        <div>
          <motion.div
            className="bg-sand-200 rounded-2xl aspect-[4/3] flex items-center justify-center text-8xl mb-3"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          >
            <span role="img" aria-label={listing.title}>{listing.emoji}</span>
          </motion.div>

          {/* Thumbnails */}
          <div className="flex gap-2" role="list" aria-label="Photos supplémentaires">
            {listing.images.map((img, i) => (
              <div
                key={i}
                role="listitem"
                className={`w-16 h-12 rounded-xl flex items-center justify-center cursor-pointer text-xl border-2 transition-colors ${
                  i === 0 ? 'border-brand-500 bg-sand-200' : 'border-transparent bg-sand-200 hover:border-sand-400'
                }`}
              >
                {img}
              </div>
            ))}
          </div>
        </div>

        {/* Right — info */}
        <div>
          <motion.div
            initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Title & price */}
            <div className="flex items-start justify-between gap-3 mb-2">
              <h1 className="font-serif text-2xl text-sand-900 leading-snug">{listing.title}</h1>
              <button
                onClick={() => navigator.share?.({ title: listing.title, url: window.location.href })}
                className="p-2 rounded-xl bg-sand-200 hover:bg-sand-300 text-sand-500 transition-colors shrink-0"
                aria-label="Partager"
              >
                <Share2 size={16} />
              </button>
            </div>

            <p className="text-3xl font-bold text-brand-500 mb-3">{formatPrice(listing.price)}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-5">
              <Badge>{listing.condition}</Badge>
              <span className="flex items-center gap-1 text-xs text-sand-400 bg-sand-200 px-3 py-1 rounded-full">
                <MapPin size={11} /> {listing.city}
              </span>
              <span className="text-xs text-sand-400 bg-sand-200 px-3 py-1 rounded-full">
                {formatDate(listing.createdAt)}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-sand-600 leading-relaxed mb-6">{listing.description}</p>

            {/* Seller card */}
            <div className="bg-sand-100 rounded-2xl p-4 flex items-center gap-3 mb-5 border border-sand-200">
              <div
                className="w-11 h-11 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-lg shrink-0"
                aria-hidden="true"
              >
                {listing.seller.avatar}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sand-900 text-sm">{listing.seller.name}</p>
                <div className="flex items-center gap-1 text-xs text-sand-400">
                  <Star size={11} className="fill-yellow-400 stroke-yellow-400" />
                  {listing.seller.rating} · Membre depuis {listing.seller.memberSince}
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/profile')}>
                Voir profil
              </Button>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <Button fullWidth size="lg" onClick={handleContact}>
                <MessageCircle size={18} /> Contacter le vendeur
              </Button>
              <Button
                fullWidth variant={fav ? 'subtle' : 'ghost'} size="lg"
                onClick={handleFav}
                aria-pressed={fav}
              >
                <Heart size={18} className={fav ? 'fill-brand-500 stroke-brand-500' : ''} />
                {fav ? 'Retiré des favoris' : 'Ajouter aux favoris'}
              </Button>
              <button
                onClick={() => toast('Annonce signalée. Merci !')}
                className="flex items-center justify-center gap-1.5 text-xs text-sand-400 hover:text-red-500 transition-colors py-1 focus:outline-none"
              >
                <Flag size={12} /> Signaler cette annonce
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
