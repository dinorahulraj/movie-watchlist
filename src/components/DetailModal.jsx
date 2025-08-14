import React from 'react'

export default function DetailModal({ open, onClose, data }) {
  if (!open) return null

  if (!data) {
    return (
      <div className="modal">
        <div className="modal-content">
          <button className="modal-close" onClick={onClose}>×</button>
          <div>Loading…</div>
        </div>
      </div>
    )
  }

  if (data?.error) {
    return (
      <div className="modal">
        <div className="modal-content">
          <button className="modal-close" onClick={onClose}>×</button>
          <div className="error">{data.error}</div>
        </div>
      </div>
    )
  }

  const poster = data.Poster && data.Poster !== 'N/A' ? data.Poster : 'https://via.placeholder.com/300x445?text=No+Image'

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="modal-body">
          <img className="modal-poster" src={poster} alt={`${data.Title} poster`} />
          <div className="modal-info">
            <h3>{data.Title} <span className="muted">({data.Year})</span></h3>
            <p className="muted">{data.Rated} • {data.Runtime} • {data.Genre}</p>
            <p><strong>Plot:</strong> {data.Plot}</p>
            <p><strong>Director:</strong> {data.Director}</p>
            <p><strong>Actors:</strong> {data.Actors}</p>
            {data.imdbRating && <p><strong>IMDb:</strong> {data.imdbRating}/10</p>}
          </div>
        </div>
      </div>
    </div>
  )
}