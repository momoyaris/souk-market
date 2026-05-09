import { useState, useEffect } from 'react'
import { LISTINGS } from '@/utils/mockData'

// Swappable with real API: import { listingsService } from '@/services/api/listings'

export function useListings(filters = {}) {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    // Simulate network delay
    const t = setTimeout(() => {
      let result = [...LISTINGS]
      if (filters.category && filters.category !== 'all')
        result = result.filter((l) => l.category === filters.category)
      if (filters.query)
        result = result.filter(
          (l) =>
            l.title.toLowerCase().includes(filters.query.toLowerCase()) ||
            l.city.toLowerCase().includes(filters.query.toLowerCase())
        )
      if (filters.maxPrice)
        result = result.filter((l) => l.price <= filters.maxPrice)
      if (filters.sort === 'price_asc')
        result.sort((a, b) => a.price - b.price)
      if (filters.sort === 'price_desc')
        result.sort((a, b) => b.price - a.price)
      setListings(result)
      setLoading(false)
    }, 400)
    return () => clearTimeout(t)
  }, [filters.category, filters.query, filters.maxPrice, filters.sort])

  return { listings, loading }
}

export function useListing(id) {
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => {
      setListing(LISTINGS.find((l) => l.id === Number(id)) || null)
      setLoading(false)
    }, 300)
    return () => clearTimeout(t)
  }, [id])

  return { listing, loading }
}
