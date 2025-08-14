import React, { useMemo, useState } from 'react'

export default function SearchBar({ onQueryChange }) {
  const [value, setValue] = useState('')

  // simple debounce without extra deps
  const debounce = (fn, delay = 500) => {
    let t
    return (...args) => {
      clearTimeout(t)
      t = setTimeout(() => fn(...args), delay)
    }
  }

  const debounced = useMemo(() => debounce(onQueryChange, 500), [onQueryChange])

  const onChange = (e) => {
    const v = e.target.value
    setValue(v)
    debounced(v.trim())
  }

  return (
    <div className="searchbar">
      <input
        value={value}
        onChange={onChange}
        placeholder="Search movies (e.g., Interstellar)"
        aria-label="Search movies"
      />
    </div>
  )
}