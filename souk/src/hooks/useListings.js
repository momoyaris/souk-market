import { useState, useEffect } from 'react'
import { supabase } from '@/services/supabase'

export function useListings(filters = {}) {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchListings() {
      setLoading(true)

      let query = supabase
        .from('listings')
        .select(`
          *,
          user:profiles(id, name, avatar)
        `)
        .eq('is_active', true)
        .eq('is_flagged', false)

      // Filtres
      if (filters.category && filters.category !== 'all')
        query = query.eq('category', filters.category)

      if (filters.query)
        query = query.or(
          `title.ilike.%${filters.query}%,city.ilike.%${filters.query}%`
        )

      if (filters.maxPrice)
        query = query.lte('price', filters.maxPrice)

      // Tri
      if (filters.sort === 'price_asc')
        query = query.order('price', { ascending: true })
      else if (filters.sort === 'price_desc')
        query = query.order('price', { ascending: false })
      else
        query = query.order('created_at', { ascending: false })

      const { data, error } = await query

      if (error) {
        console.error('Erreur chargement annonces:', error.message)
        setListings([])
      } else {
        setListings(data || [])
      }

      setLoading(false)
    }

    fetchListings()
  }, [filters.category, filters.query, filters.maxPrice, filters.sort])

  return { listings, loading }
}

export function useListing(id) {
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchListing() {
      setLoading(true)

      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          user:profiles(id, name, avatar)
        `)
        .eq('id', id)
        .single()

      if (error) {
        console.error('Erreur chargement annonce:', error.message)
        setListing(null)
      } else {
        setListing(data)
      }

      setLoading(false)
    }

    if (id) fetchListing()
  }, [id])

  return { listing, loading }
}