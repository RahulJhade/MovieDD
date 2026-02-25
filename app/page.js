import MovieGrid from '@/components/MovieGrid'
import { getAllMovies } from '@/lib/api'

export default async function Home() {
  const movies = await getAllMovies()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Popular Movies</h1>
        <p className="text-gray-400">
          🎬 Discover top-rated movies from IMDB, powered by OMDB API.
        </p>
      </div>
      <MovieGrid movies={movies} />
    </div>
  )
}

// Enable dynamic rendering for fresh data
export const revalidate = 3600
