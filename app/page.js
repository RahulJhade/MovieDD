'use client'

import { useState, useEffect } from 'react'
import MovieGrid from '@/components/MovieGrid'
import { searchMovies } from '@/lib/api'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const searchDebounce = setTimeout(async () => {
      if (query.length > 2) {
        setLoading(true)
        const results = await searchMovies(query)
        setMovies(results)
        setLoading(false)
      } else {
        setMovies([])
      }
    }, 500)

    return () => clearTimeout(searchDebounce)
  }, [query])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Search Movies</h1>

      <div className="mb-8">
        <input
          type="text"
          placeholder="Search for movies... (try 'matrix', 'inception', 'dark')"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full max-w-2xl px-6 py-4 rounded-lg bg-secondary text-white text-lg focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      {loading && <p className="text-gray-400">Searching...</p>}

      {query.length > 2 && !loading && movies.length === 0 && (
        <p className="text-gray-400">No movies found for &quot;{query}&quot;</p>
      )}

      {movies.length > 0 && <MovieGrid movies={movies} />}
    </div>
  )
}
