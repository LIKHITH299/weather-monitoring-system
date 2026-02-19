import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import CurrentWeather from './components/CurrentWeather'
import PopularCities from './components/PopularCities'
import Forecast from './components/Forecast'
import Summary from './components/Summary'
import MapCard from './components/MapCard'
import './App.css'

function App() {
  const [weatherData, setWeatherData] = useState(null)
  const [forecastData, setForecastData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [currentCity, setCurrentCity] = useState('Hyderabad')
  const [coordinates, setCoordinates] = useState([17.3850, 78.4867]) // Default: Hyderabad

  // Fetch current weather
  const fetchWeather = async (city) => {
    setLoading(true)
    setError(null)

    try {
      const API_KEY = import.meta.env.VITE_WEATHER_API_KEY
      
      // Debug: Log API key status (first 4 chars only for security)
      console.log('API Key loaded:', API_KEY ? `${API_KEY.substring(0, 4)}...` : 'NOT FOUND')
      
      if (!API_KEY || API_KEY === 'your_api_key_here') {
        throw new Error('API key is not configured. Please add VITE_WEATHER_API_KEY to your .env file and restart the dev server.')
      }

      // Fetch current weather with timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

      let weatherResponse
      try {
        weatherResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`,
          { signal: controller.signal }
        )
        clearTimeout(timeoutId)
      } catch (fetchError) {
        clearTimeout(timeoutId)
        if (fetchError.name === 'AbortError') {
          throw new Error('Request timeout. Please check your internet connection and try again.')
        }
        throw new Error('Network error. Please check your internet connection.')
      }

      if (!weatherResponse.ok) {
        const errorData = await weatherResponse.json().catch(() => ({}))
        if (weatherResponse.status === 404) {
          throw new Error('City not found. Please check the city name and try again.')
        }
        if (weatherResponse.status === 401) {
          throw new Error('Invalid API key. Please check your API key in .env file and restart the dev server.')
        }
        if (weatherResponse.status === 429) {
          throw new Error('API rate limit exceeded. Please try again later.')
        }
        throw new Error(errorData.message || 'Failed to fetch weather data. Please try again later.')
      }

      const weather = await weatherResponse.json()
      setWeatherData(weather)
      
      // Update coordinates for map
      if (weather.coord) {
        setCoordinates([weather.coord.lat, weather.coord.lon])
      }

      // Fetch forecast data
      try {
        const forecastController = new AbortController()
        const forecastTimeoutId = setTimeout(() => forecastController.abort(), 10000)
        
        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`,
          { signal: forecastController.signal }
        )
        clearTimeout(forecastTimeoutId)
        
        if (forecastResponse.ok) {
          const forecast = await forecastResponse.json()
          setForecastData(forecast)
        }
      } catch (err) {
        console.warn('Forecast data not available:', err)
        // Don't show error for forecast, it's optional
      }

    } catch (err) {
      setError(err.message || 'An error occurred while fetching weather data.')
      console.error('Weather fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  // Load default city on mount
  useEffect(() => {
    fetchWeather(currentCity)
  }, [])

  const handleSearch = (city) => {
    setCurrentCity(city)
    fetchWeather(city)
  }

  return (
    <div className="app">
      <div className="cloud-background"></div>
      <Sidebar />
      <div className="main-content">
        <Header onSearch={handleSearch} loading={loading} />
        
        {error && (
          <div className="error-banner">
            <span>⚠️ {error}</span>
          </div>
        )}

        <div className="dashboard-grid">
          <div className="grid-item current-weather-section">
            {weatherData && <CurrentWeather data={weatherData} />}
          </div>
          
          <div className="grid-item map-section">
            <MapCard city={currentCity} coordinates={coordinates} />
          </div>
          
          <div className="grid-item popular-cities-section">
            <PopularCities onCitySelect={handleSearch} />
          </div>
          
          <div className="grid-item forecast-section">
            <Forecast data={forecastData} />
          </div>
          
          <div className="grid-item summary-section">
            <Summary data={forecastData} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
