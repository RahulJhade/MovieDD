import { getGenres, getMoviesByGenre } from '@/lib/api'
import MovieGrid from '@/components/MovieGrid'

export default async function GenresPage({ searchParams }) {
  const resolvedSearchParams = await searchParams
  const genres = await getGenres()
  const selectedGenreId = resolvedSearchParams.id ? parseInt(resolvedSearchParams.id) : genres[0]?.id

  const movies = selectedGenreId ? await getMoviesByGenre(selectedGenreId) : []
  const selectedGenre = genres.find(g => g.id === selectedGenreId)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Browse by Genre</h1>

      {/* Genre selector */}
      <div className="mb-8 flex flex-wrap gap-3">
        {genres.map((genre) => (
          <a
            key={genre.id}
            href={`/genres?id=${genre.id}`}
            className={`px-4 py-2 rounded-lg transition-colors ${genre.id === selectedGenreId
                ? 'bg-accent text-white'
                : 'bg-secondary text-gray-300 hover:bg-accent/50'
              }`}
          >
            {genre.name}
          </a>
        ))}
      </div>

      {selectedGenre && (
        <>
          <h2 className="text-2xl font-bold mb-6">{selectedGenre.name} Movies</h2>
          <MovieGrid movies={movies} />
        </>
      )}
    </div>
  )
}

export const revalidate = 3600
