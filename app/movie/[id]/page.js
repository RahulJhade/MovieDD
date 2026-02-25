import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getMovieDetails, getMovieCredits } from '@/lib/api'

export default async function MoviePage({ params }) {
  const { id: movieId } = await params

  if (!movieId) {
    notFound()
  }

  const [movie, credits] = await Promise.all([
    getMovieDetails(movieId),
    getMovieCredits(movieId),
  ])

  if (!movie) {
    notFound()
  }

  const cast = credits?.cast?.slice(0, 10) || []

  return (
    <div>
      {/* Backdrop */}
      {movie.backdrop_path && (
        <div className="relative h-96 w-full">
          <Image
            src={movie.backdrop_path}
            alt={movie.title}
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary to-transparent" />
        </div>
      )}

      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          {movie.poster_path && (
            <div className="flex-shrink-0">
              <Image
                src={movie.poster_path}
                alt={movie.title}
                width={300}
                height={450}
                className="rounded-lg shadow-2xl"
                priority
              />
            </div>
          )}

          {/* Details */}
          <div className="flex-1">
            <h1 className="text-5xl font-bold mb-4">{movie.title}</h1>

            {movie.tagline && (
              <p className="text-xl text-gray-400 italic mb-4">{movie.tagline}</p>
            )}

            <div className="flex items-center gap-4 mb-6">
              <span className="rating-badge">
                ⭐ {movie.vote_average.toFixed(1)}
              </span>
              <span className="text-gray-400">{movie.release_date?.split('-')[0]}</span>
              <span className="text-gray-400">{movie.runtime} min</span>
            </div>

            {/* Genres */}
            {movie.genres && movie.genres.length > 0 && (
              <div className="mb-6">
                {movie.genres.map((genre) => (
                  <span key={genre.id} className="genre-badge">
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {/* Overview */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-3">Overview</h2>
              <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
            </div>

            {/* Cast */}
            {cast.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Top Cast</h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {cast.map((actor) => (
                    <div key={actor.id} className="text-center">
                      {actor.profile_path && (
                        <Image
                          src={actor.profile_path}
                          alt={actor.name}
                          width={100}
                          height={150}
                          className="rounded-lg mx-auto mb-2"
                        />
                      )}
                      <p className="font-semibold text-sm">{actor.name}</p>
                      <p className="text-gray-400 text-xs">{actor.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Generate static params for popular movies
export async function generateStaticParams() {
  return []
}

export const revalidate = 86400
