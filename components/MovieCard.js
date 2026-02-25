'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export default function MovieCard({ movie }) {
  const [imgError, setImgError] = useState(false)
  // Skip placeholder URLs that are unreliable
  const posterUrl = (movie.poster_path && !movie.poster_path.includes('via.placeholder.com'))
    ? movie.poster_path
    : null

  return (
    <Link href={`/movie/${movie.id}`}>
      <div className="movie-card">
        <div className="relative aspect-[2/3]">
          {posterUrl && !imgError ? (
            <Image
              src={posterUrl}
              alt={movie.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              onError={() => setImgError(true)}
              unoptimized={posterUrl.includes('via.placeholder.com')}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
              <div className="text-center p-4">
                <span className="text-4xl mb-2 block">🎬</span>
                <span className="text-gray-300 text-sm font-medium">{movie.title}</span>
              </div>
            </div>
          )}

          {/* Rating badge */}
          <div className="absolute top-2 right-2">
            <span className="rating-badge">
              ⭐ {movie.vote_average.toFixed(1)}
            </span>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-bold text-lg mb-2 line-clamp-2">{movie.title}</h3>
          <p className="text-gray-400 text-sm">
            {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
          </p>
        </div>
      </div>
    </Link>
  )
}
