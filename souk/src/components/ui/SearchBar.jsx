import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { cn } from '@/utils/helpers'

export default function SearchBar({ className, placeholder = "iPhone, Peugeot, canapé…", size = 'md' }) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className={cn('relative flex items-center', className)}
    >
      <Search
        size={size === 'lg' ? 20 : 16}
        className="absolute left-4 text-sand-400 pointer-events-none"
        aria-hidden="true"
      />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        aria-label="Rechercher une annonce"
        className={cn(
          'w-full bg-white border border-sand-300 rounded-full font-sans text-sand-900 placeholder-sand-400 transition-all duration-150',
          'focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100',
          size === 'lg' ? 'pl-12 pr-28 py-4 text-base' : 'pl-10 pr-4 py-2.5 text-sm'
        )}
      />
      {size === 'lg' && (
        <button
          type="submit"
          className="absolute right-2 bg-brand-500 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-brand-400 transition-colors"
        >
          Rechercher
        </button>
      )}
    </form>
  )
}
