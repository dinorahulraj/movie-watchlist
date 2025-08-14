import React, { useEffect, useMemo, useState } from 'react'
import SearchBar from './components/SearchBar.jsx'
import MovieList from './components/MovieList.jsx'
import ThemeToggle from './components/ThemeToggle.jsx'
import DetailModal from './components/DetailModal.jsx'
import useLocalStorage from './hooks/useLocalStorage.js'
import { searchMovies, getMovieById } from './utils/api.js'

export default function App() {
  const [theme, setTheme] = useLocalStorage('mw_theme', 'dark')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [results, setResults] = useState([])
  const [totalResults, setTotalResults] = useState(0)

  const [watchlist, setWatchlist] = useLocalStorage('mw_watchlist', []) // array of imdbIDs
  const [watched, setWatched] = useLocalStorage('mw_watched', []) // array of imdbIDs

  const [selectedId, setSelectedId] = useState(null)
  const [selectedDetail, setSelectedDetail] = useState(null)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    const fetch = async () => {
      if (!query) {
        setResults([])
        setTotalResults(0)
        return
      }
      try {
        setLoading(true)
        setError('')
        const { Search = [], totalResults = '0' } = await searchMovies(query, page)
        setResults(prev => page === 1 ? Search : [...prev, ...Search])
        setTotalResults(Number(totalResults) || 0)
      } catch (e) {
        setError(e?.message || 'Failed to fetch movies')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [query, page])

  const hasMore = useMemo(() => results.length < totalResults, [results.length, totalResults])

  const onAddToWatchlist = (id) => {
    if (!watchlist.includes(id)) setWatchlist([id, ...watchlist])
  }

  const onRemoveFromWatchlist = (id) => {
    setWatchlist(watchlist.filter(x => x !== id))
  }

  const onMarkWatched = (id) => {
    if (!watched.includes(id)) setWatched([id, ...watched])
    onRemoveFromWatchlist(id)
  }

  const openDetail = async (id) => {
    setSelectedId(id)
    try {
      const data = await getMovieById(id)
      setSelectedDetail(data)
    } catch (e) {
      setSelectedDetail({ error: e?.message || 'Failed to load details' })
    }
  }

  const closeDetail = () => {
    setSelectedId(null)
    setSelectedDetail(null)
  }

  return (
    <div className="container">
      <header className="header">
        <h1 className="logo"> Movie Watchlist</h1>
        <div className="header-actions">
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>
      </header>

      <SearchBar onQueryChange={(q) => { setPage(1); setQuery(q) }} />

      {error && <div className="error">{error}</div>}

      <section className="section">
        <div className="section-header">
          <h2>Search Results {query && `for "${query}"`}</h2>
          {loading && <span className="badge">Loading…</span>}
        </div>
        <MovieList
          movies={results}
          onAdd={onAddToWatchlist}
          onOpen={openDetail}
          watchlist={watchlist}
          watched={watched}
        />
        {hasMore && (
          <button className="btn" onClick={() => setPage(p => p + 1)} disabled={loading}>
            {loading ? 'Loading…' : 'Load More'}
          </button>
        )}
      </section>

      <section className="section">
        <div className="section-header"><h2>Watchlist</h2></div>
        {watchlist.length === 0 ? (
          <p className="muted">Your watchlist is empty. Add some movies from the results above.</p>
        ) : (
          <MovieList
            movies={watchlist.map(id => ({ imdbID: id }))}
            onRemove={onRemoveFromWatchlist}
            onMarkWatched={onMarkWatched}
            onOpen={openDetail}
            watchlist={watchlist}
            watched={watched}
            hydrate
          />
        )}
      </section>

      <section className="section">
        <div className="section-header"><h2>Watched</h2></div>
        {watched.length === 0 ? (
          <p className="muted">No movies watched yet.</p>
        ) : (
          <MovieList
            movies={watched.map(id => ({ imdbID: id }))}
            onOpen={openDetail}
            watchlist={watchlist}
            watched={watched}
            hydrate
          />
        )}
      </section>

      <DetailModal open={!!selectedId} onClose={closeDetail} data={selectedDetail} />

      <footer className="footer">
        <p>Powered by <a href="https://www.omdbapi.com/" target="_blank" rel="noreferrer">OMDb API</a>.</p>
      </footer>
    </div>
  )
}