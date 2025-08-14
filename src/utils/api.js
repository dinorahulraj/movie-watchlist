const API = 'https://www.omdbapi.com/'
const KEY = import.meta.env.VITE_OMDB_API_KEY

export async function searchMovies(query, page = 1) {
  if (!KEY) throw new Error('Missing OMDb API key. Add VITE_OMDB_API_KEY to your .env')
  const url = `${API}?apikey=${KEY}&s=${encodeURIComponent(query)}&page=${page}`
  const res = await fetch(url)
  const data = await res.json()
  if (data.Response === 'False') throw new Error(data.Error || 'OMDb error')
  return data
}

export async function getMovieById(imdbID) {
  if (!KEY) throw new Error('Missing OMDb API key. Add VITE_OMDB_API_KEY to your .env')
  const url = `${API}?apikey=${KEY}&i=${encodeURIComponent(imdbID)}&plot=short` 
  const res = await fetch(url)
  const data = await res.json()
  if (data.Response === 'False') throw new Error(data.Error || 'OMDb error')
  return data
}