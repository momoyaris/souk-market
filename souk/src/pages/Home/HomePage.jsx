import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useListings } from '@/hooks/useListings'
import { CATEGORIES } from '@/utils/mockData'
import ListingCard from '@/components/cards/ListingCard'
import { CardSkeleton } from '@/components/ui/Skeleton'
import SearchBar from '@/components/ui/SearchBar'
import Button from '@/components/ui/Button'

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const { listings, loading } = useListings({ category: activeCategory })
  const navigate = useNavigate()

  return (
    <div className="page-transition">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sand-200 to-sand-100 py-20 px-4 text-center">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, #1a1814 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="relative max-w-2xl mx-auto">
          <motion.h1
            className="font-serif text-4xl md:text-6xl text-sand-900 leading-tight mb-4"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          >
            Achète & vends{' '}
            <em className="text-brand-500 not-italic">proche</em>
            <br />de chez toi
          </motion.h1>
          <motion.p
            className="text-sand-500 text-lg mb-8"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          >
            Des milliers d'annonces autour de vous. Simple, rapide, sécurisé.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          >
            <SearchBar size="lg" className="max-w-xl mx-auto mb-6" />
          </motion.div>

          {/* Stats */}
          <motion.div
            className="flex justify-center gap-8 text-sm text-sand-500"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
          >
            <span><strong className="text-sand-800 font-semibold">+12 000</strong> annonces</span>
            <span><strong className="text-sand-800 font-semibold">+3 500</strong> vendeurs</span>
            <span><strong className="text-sand-800 font-semibold">Gratuit</strong> pour tous</span>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="sticky top-16 z-30 bg-sand-100/90 backdrop-blur border-b border-sand-300 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <nav
            className="flex gap-2 overflow-x-auto no-scrollbar pb-0.5"
            aria-label="Filtrer par catégorie"
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                aria-pressed={activeCategory === cat.id}
                className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-150 border focus:outline-none focus:ring-2 focus:ring-brand-400 ${
                  activeCategory === cat.id
                    ? 'bg-sand-900 text-white border-sand-900'
                    : 'bg-white text-sand-500 border-sand-300 hover:border-sand-500 hover:text-sand-900'
                }`}
              >
                <span aria-hidden="true">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </nav>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl text-sand-900">
            {activeCategory === 'all' ? 'Annonces récentes' : CATEGORIES.find(c => c.id === activeCategory)?.label}
          </h2>
          <Button variant="ghost" size="sm" onClick={() => navigate('/search')}>
            Tout voir →
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {Array.from({ length: 8 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : listings.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {listings.map((l, i) => <ListingCard key={l.id} listing={l} index={i} />)}
          </div>
        ) : (
          <div className="text-center py-20 text-sand-400">
            <p className="text-5xl mb-3">🔍</p>
            <p className="font-semibold">Aucune annonce dans cette catégorie</p>
          </div>
        )}
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 pb-12">
        <div className="bg-sand-900 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-serif text-white text-2xl md:text-3xl mb-2">
              Tu veux vendre quelque chose ?
            </h3>
            <p className="text-sand-400 text-sm">Publie en moins de 2 minutes, c'est gratuit.</p>
          </div>
          <Button size="lg" onClick={() => navigate('/publish')} className="shrink-0">
            Publier une annonce
          </Button>
        </div>
      </section>
    </div>
  )
}
