import React from 'react'

export default function MovieCard({ movie, onAdd, onRemove, onMarkWatched, onOpen, inWatchlist, isWatched }) {
  const { Title, Year, Poster, imdbID } = movie
  const poster = Poster && Poster !== 'N/A' ? Poster : 'https://via.placeholder.com/300x445?text=No+Image'

  return (
    <div className="card">
      <button className="poster" onClick={() => onOpen?.(imdbID)}>
        <img src={poster} alt={`${Title} poster`} loading="lazy" />
      </button>
      <div className="card-body">
        <div className="card-title" title={Title}>{Title || 'Unknown'}</div>
        <div className="card-meta">{Year || '—'}</div>
        <div className="card-actions">
          {onAdd && !inWatchlist && !isWatched && (
            <button className="btn" onClick={() => onAdd(imdbID)}>+ Watchlist</button>
          )}
          {onRemove && (
            <button className="btn btn-outline" onClick={() => onRemove(imdbID)}>Remove</button>
          )}
          {onMarkWatched && !isWatched && (
            <button className="btn success" onClick={() => onMarkWatched(imdbID)}>Mark Watched</button>
          )}
          {isWatched && <span className="badge">Watched</span>}
        </div>
      </div>
    </div>
  )
}