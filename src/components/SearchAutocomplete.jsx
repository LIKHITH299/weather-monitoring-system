import { useState, useEffect, useRef } from 'react'
import './SearchAutocomplete.css'

const POPULAR_CITIES = [
  'Delhi', 'Mumbai', 'Hyderabad', 'Bangalore', 'Kolkata',
  'Chennai', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat',
  'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane',
  'Bhopal', 'Visakhapatnam', 'Patna', 'Vadodara', 'Ghaziabad'
]

function SearchAutocomplete({ onSearch, loading }) {
  const [searchValue, setSearchValue] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const searchRef = useRef(null)
  const suggestionsRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchCitySuggestions = async (query) => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([])
      return
    }

    try {
      const API_KEY = import.meta.env.VITE_WEATHER_API_KEY
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
      )

      if (response.ok) {
        const data = await response.json()
        setSuggestions(data)
      } else {
        // Fallback to local suggestions
        const filtered = POPULAR_CITIES.filter(city =>
          city.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5)
        setSuggestions(filtered.map(city => ({ name: city, country: 'IN' })))
      }
    } catch (error) {
      // Fallback to local suggestions
      const filtered = POPULAR_CITIES.filter(city =>
        city.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
      setSuggestions(filtered.map(city => ({ name: city, country: 'IN' })))
    }
  }

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchValue.trim()) {
        fetchCitySuggestions(searchValue)
        setShowSuggestions(true)
      } else {
        setSuggestions([])
        setShowSuggestions(false)
      }
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchValue])

  const handleInputChange = (e) => {
    setSearchValue(e.target.value)
    setSelectedIndex(-1)
  }

  const handleSelectCity = (city) => {
    const cityName = typeof city === 'string' ? city : city.name
    setSearchValue(cityName)
    setShowSuggestions(false)
    onSearch(cityName)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (searchValue.trim()) {
      handleSelectCity(searchValue.trim())
    }
  }

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault()
      handleSelectCity(suggestions[selectedIndex])
    }
  }

  const displaySuggestions = searchValue.trim().length >= 2 
    ? suggestions 
    : POPULAR_CITIES.slice(0, 5).map(city => ({ name: city, country: 'IN' }))

  return (
    <div className="search-autocomplete" ref={searchRef}>
      <form className="header-search" onSubmit={handleSubmit}>
        <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
          <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <input
          type="text"
          placeholder="Search for location"
          value={searchValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (searchValue.trim().length >= 2 || suggestions.length > 0) {
              setShowSuggestions(true)
            }
          }}
          disabled={loading}
        />
      </form>

      {showSuggestions && displaySuggestions.length > 0 && (
        <div className="suggestions-dropdown" ref={suggestionsRef}>
          {displaySuggestions.map((suggestion, index) => {
            const cityName = typeof suggestion === 'string' ? suggestion : suggestion.name
            const country = suggestion.country || ''
            const state = suggestion.state || ''
            
            return (
              <div
                key={`${cityName}-${index}`}
                className={`suggestion-item ${selectedIndex === index ? 'selected' : ''}`}
                onClick={() => handleSelectCity(suggestion)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <svg className="suggestion-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="2"/>
                </svg>
                <div className="suggestion-text">
                  <span className="suggestion-city">{cityName}</span>
                  {(state || country) && (
                    <span className="suggestion-location">{state ? `${state}, ` : ''}{country}</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default SearchAutocomplete
