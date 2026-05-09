import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X } from 'lucide-react'
import { useListings } from '@/hooks/useListings'
import { CATEGORIES } from '@/utils/mockData'
import ListingCard from '@/components/cards/ListingCard'
import { CardSkeleton } from '@/components/ui/Skeleton'
import SearchBar from '@/components/ui/SearchBar'
import Button from '@/components/ui/Button'

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    query: searchParams.get('q') || '',
    category: 'all',
    maxPrice: 10000000,
    sort: 'recent',
  })

  useEffect(() => {
    setFilters(f => ({ ...f, query: searchParams.get('q') || '' }))
  }, [searchParams])

  const { listings, loading } = useListings(filters)

  function set(key, value) {
    setFilters(f => ({ ...f, [key]: value }))
  }

  return (
    <div className="page-transition max-w-7xl mx-auto px-4 md:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center mb-6">
        <div className="flex-1 w-full">
          <SearchBar className="w-full max-w-xl" />
        </div>
        <Button
          variant="ghost"
          size="md"
          onClick={() => setShowFilters(f => !f)}
          className="shrink-0"
        >
          <SlidersHorizontal size={15} />
          Filtres
          {showFilters && <X size={13} />}
        </Button>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="bg-white border border-sand-200 rounded-2xl p-5 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-sand-500 uppercase tracking-wide mb-2">
              Catégorie
            </label>
            <select
              value={filters.category}
              onChange={e => set('category', e.target.value)}
              className="w-full border border-sand-300 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-brand-500"
            >
              {CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-xs font-semibold text-sand-500 uppercase tracking-wide mb-2">
              Prix max : {new Intl.NumberFormat('fr-FR').format(filters.maxPrice)} FCFA
            </label>
            <input
              type="range" min={0} max={10000000} step={10000}
              value={filters.maxPrice}
              onChange={e => set('maxPrice', Number(e.target.value))}
              className="w-full accent-brand-500"
            />
          </div>

          {/* Sort */}
          <div>
            <label className="block text-xs font-semibold text-sand-500 uppercase tracking-wide mb-2">
              Trier par
            </label>
            <select
              value={filters.sort}
              onChange={e => set('sort', e.target.value)}
              className="w-full border border-sand-300 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-brand-500"
            >
              <option value="recent">Plus récent</option>
              <option value="price_asc">Prix croissant</option>
              <option value="price_desc">Prix décroissant</option>
            </select>
          </div>
        </div>
      )}

      {/* Results title */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-serif text-xl text-sand-900">
          {filters.query
            ? `Résultats pour « ${filters.query} »`
            : 'Toutes les annonces'}
        </h1>
        {!loading && (
          <span className="text-sm text-sand-400">
            {listings.length} annonce{listings.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : listings.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {listings.map((l, i) => <ListingCard key={l.id} listing={l} index={i} />)}
        </div>
      ) : (
        <div className="text-center py-24 text-sand-400">
          <p className="text-5xl mb-4">🔍</p>
          <p className="font-semibold text-sand-600 text-lg mb-1">Aucune annonce trouvée</p>
          <p className="text-sm">Essaie un autre mot-clé ou modifie les filtres</p>
        </div>
      )}
    </div>
  )
}
