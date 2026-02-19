import { useState } from 'react'
import './Search.css'

function Search({ onSearch, loading }) {
  const [city, setCity] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (city.trim()) {
      onSearch(city.trim())
    }
  }

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="search-input"
        placeholder="Enter city name..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        disabled={loading}
      />
      <button 
        type="submit" 
        className="search-button"
        disabled={loading || !city.trim()}
      >
        {loading ? 'Searching...' : 'Search'}
      </button>
    </form>
  )
}

export default Search
