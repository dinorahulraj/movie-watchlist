import React, { useEffect, useState } from 'react'
import MovieCard from './MovieCard.jsx'
import { getMovieById } from '../utils/api.js'

export default function MovieList({ movies, onAdd, onRemove, onMarkWatched, onOpen, watchlist = [], watched = [], hydrate = false }) {
  const [hydrated, setHydrated] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const run = async () => {
      if (!hydrate) return
      try {
        setLoading(true)
        const filled = await Promise.all(
          movies.map(async m => (m.Title ? m : await getMovieById(m.imdbID)))
        )
        setHydrated(filled)
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [movies, hydrate])

  const items = hydrate ? hydrated : movies

  if (!items?.length) return null

  return (
    <div>
      {loading && <div className="muted" style={{marginBottom: '0.75rem'}}>Loading…</div>}
      <div className="grid">
        {items.map((m) => (
          <MovieCard
            key={m.imdbID}
            movie={m}
            onAdd={onAdd}
            onRemove={onRemove}
            onMarkWatched={onMarkWatched}
            onOpen={onOpen}
            inWatchlist={watchlist.includes(m.imdbID)}
            isWatched={watched.includes(m.imdbID)}
          />
        ))}
      </div>
    </div>
  )
}