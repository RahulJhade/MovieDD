// OMDB API Integration
const API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY
const BASE_URL = 'https://www.omdbapi.com/'

if (!API_KEY) {
  console.warn('OMDB API key is not set. Please add NEXT_PUBLIC_OMDB_API_KEY to your .env.local file')
}

// Helper to convert OMDB data to our app's format
function convertOmdbToAppFormat(omdbMovie) {
  // Parse IMDB rating to 0-10 scale
  const rating = omdbMovie.imdbRating && omdbMovie.imdbRating !== 'N/A'
    ? parseFloat(omdbMovie.imdbRating)
    : 0

  // Parse genres
  const genreString = omdbMovie.Genre || ''
  const genres = genreString.split(', ').map((name, index) => ({
    id: index + 1,
    name: name
  }))

  return {
    id: omdbMovie.imdbID,
    title: omdbMovie.Title,
    poster_path: omdbMovie.Poster !== 'N/A' ? omdbMovie.Poster : null,
    backdrop_path: omdbMovie.Poster !== 'N/A' ? omdbMovie.Poster : null,
    overview: omdbMovie.Plot || 'No overview available.',
    release_date: omdbMovie.Released || omdbMovie.Year || '',
    vote_average: rating,
    genre_ids: genres.map(g => g.id),
    runtime: omdbMovie.Runtime ? parseInt(omdbMovie.Runtime) : 0,
    tagline: omdbMovie.Plot || '',
    genres: genres
  }
}

// Fetch with timeout
async function fetchWithTimeout(url, timeout = 5000) {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      next: { revalidate: 3600 } // Cache for 1 hour
    })
    clearTimeout(id)
    return response
  } catch (error) {
    clearTimeout(id)
    throw error
  }
}

// Pre-defined movie IDs (OMDB doesn't have a "popular" or "all" endpoint)
const allMovieIds = [
  'tt0111161', // The Shawshank Redemption
  'tt0068646', // The Godfather
  'tt0468569', // The Dark Knight
  'tt0110912', // Pulp Fiction
  'tt0109830', // Forrest Gump
  'tt0137523', // Fight Club
  'tt0167260', // LOTR: Return of the King
  'tt0120737', // LOTR: Fellowship
  'tt0080684', // Star Wars: Empire Strikes Back
  'tt0816692', // Interstellar
  'tt1375666', // Inception
  'tt0133093', // The Matrix
  'tt0099685', // Goodfellas
  'tt0073486', // One Flew Over the Cuckoo's Nest
  'tt0047478', // Seven Samurai
  'tt0317248', // City of God
  'tt0076759', // Star Wars: A New Hope
  'tt0114369', // Se7en
  'tt0102926', // Silence of the Lambs
  'tt0038650', // It's a Wonderful Life
  'tt0361748', // Inglourious Basterds
  'tt0482571', // The Prestige
  'tt0407887', // The Departed
  'tt0172495', // Gladiator
  'tt4154796', // Avengers: Endgame
  'tt6751668', // Parasite
  'tt4633694', // Spider-Man: Into the Spider-Verse
  'tt2380307', // Coco
  'tt0993846', // The Wolf of Wall Street
  'tt0088763', // Back to the Future
  'tt0108052', // Schindler's List
  'tt0095327', // Grave of the Fireflies
  'tt0103064', // Terminator 2
  'tt0054215', // Psycho
  'tt0120689', // The Green Mile
  'tt0245429', // Spirited Away
  'tt0120815', // Saving Private Ryan
  'tt3896198', // Guardians of the Galaxy Vol. 2
  'tt4154756', // Avengers: Infinity War
]

// Helper to fetch multiple movies by their IMDB IDs
async function fetchMoviesByIds(ids) {
  try {
    if (!API_KEY) {
      console.error('OMDB API key is missing')
      return []
    }

    const moviePromises = ids.map(async (imdbId) => {
      try {
        const response = await fetchWithTimeout(`${BASE_URL}?apikey=${API_KEY}&i=${imdbId}&plot=full`)
        if (!response.ok) return null
        const data = await response.json()
        if (data.Response === 'True') {
          return convertOmdbToAppFormat(data)
        }
        return null
      } catch (error) {
        console.error(`Error fetching movie ${imdbId}:`, error)
        return null
      }
    })

    const movies = await Promise.all(moviePromises)
    return movies.filter(movie => movie !== null)
  } catch (error) {
    console.error('Error fetching movies:', error)
    return []
  }
}

export async function getAllMovies() {
  return fetchMoviesByIds(allMovieIds)
}

export async function getPopularMovies() {
  return fetchMoviesByIds(allMovieIds.slice(0, 12))
}

export async function searchMovies(query) {
  if (!query || query.trim().length === 0) {
    return []
  }

  try {
    if (!API_KEY) {
      console.error('OMDB API key is missing')
      return []
    }

    const response = await fetchWithTimeout(`${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&type=movie`)

    if (!response.ok) {
      throw new Error(`OMDB API error: ${response.status}`)
    }

    const data = await response.json()

    if (data.Response === 'False') {
      return []
    }

    // OMDB search returns minimal data, fetch full details for first 10 results
    const searchResults = data.Search.slice(0, 10)
    const detailedMovies = await Promise.all(
      searchResults.map(async (movie) => {
        try {
          const detailResponse = await fetchWithTimeout(`${BASE_URL}?apikey=${API_KEY}&i=${movie.imdbID}&plot=full`)
          const detailData = await detailResponse.json()
          if (detailData.Response === 'True') {
            return convertOmdbToAppFormat(detailData)
          }
          return null
        } catch (error) {
          return null
        }
      })
    )

    return detailedMovies.filter(movie => movie !== null)
  } catch (error) {
    console.error('Error searching movies:', error)
    return []
  }
}

export async function getMovieDetails(movieId) {
  try {
    if (!API_KEY) {
      console.error('OMDB API key is missing')
      return null
    }

    const response = await fetchWithTimeout(`${BASE_URL}?apikey=${API_KEY}&i=${movieId}&plot=full`)

    if (!response.ok) {
      throw new Error(`OMDB API error: ${response.status}`)
    }

    const data = await response.json()

    if (data.Response === 'False') {
      return null
    }

    return convertOmdbToAppFormat(data)
  } catch (error) {
    console.error('Error fetching movie details:', error)
    return null
  }
}

export async function getMovieCredits(movieId) {
  try {
    if (!API_KEY) {
      return { cast: [] }
    }

    const response = await fetchWithTimeout(`${BASE_URL}?apikey=${API_KEY}&i=${movieId}&plot=full`)

    if (!response.ok) {
      return { cast: [] }
    }

    const data = await response.json()

    if (data.Response === 'False' || !data.Actors) {
      return { cast: [] }
    }

    // OMDB only gives actor names, not full cast details
    const actorNames = data.Actors.split(', ')
    const cast = actorNames.map((name, index) => ({
      id: index + 1,
      name: name,
      character: 'Actor', // OMDB doesn't provide character names
      profile_path: null
    }))

    return { cast }
  } catch (error) {
    console.error('Error fetching movie credits:', error)
    return { cast: [] }
  }
}

export async function getGenres() {
  // OMDB doesn't have a genre endpoint, return common genres
  return [
    { id: 1, name: "Action" },
    { id: 2, name: "Adventure" },
    { id: 3, name: "Animation" },
    { id: 4, name: "Biography" },
    { id: 5, name: "Comedy" },
    { id: 6, name: "Crime" },
    { id: 7, name: "Drama" },
    { id: 8, name: "Family" },
    { id: 9, name: "Fantasy" },
    { id: 10, name: "Horror" },
    { id: 11, name: "Mystery" },
    { id: 12, name: "Romance" },
    { id: 13, name: "Sci-Fi" },
    { id: 14, name: "Thriller" },
    { id: 15, name: "War" },
  ]
}

export async function getMoviesByGenre(genreId) {
  // OMDB doesn't support filtering by genre
  // We'll search for genre-specific terms
  const genreMap = {
    1: "action",
    2: "adventure",
    3: "animation",
    4: "biography",
    5: "comedy",
    6: "crime",
    7: "drama",
    8: "family",
    9: "fantasy",
    10: "horror",
    11: "mystery",
    12: "romance",
    13: "science fiction",
    14: "thriller",
    15: "war"
  }

  const genreName = genreMap[genreId] || "movie"

  try {
    if (!API_KEY) {
      return []
    }

    const response = await fetchWithTimeout(`${BASE_URL}?apikey=${API_KEY}&s=${genreName}&type=movie`)

    if (!response.ok) {
      return []
    }

    const data = await response.json()

    if (data.Response === 'False') {
      return []
    }

    // Fetch details for first 8 results
    const searchResults = data.Search.slice(0, 8)
    const detailedMovies = await Promise.all(
      searchResults.map(async (movie) => {
        try {
          const detailResponse = await fetchWithTimeout(`${BASE_URL}?apikey=${API_KEY}&i=${movie.imdbID}&plot=full`)
          const detailData = await detailResponse.json()
          if (detailData.Response === 'True' && detailData.Genre.toLowerCase().includes(genreName)) {
            return convertOmdbToAppFormat(detailData)
          }
          return null
        } catch (error) {
          return null
        }
      })
    )

    return detailedMovies.filter(movie => movie !== null)
  } catch (error) {
    console.error('Error fetching movies by genre:', error)
    return []
  }
}
