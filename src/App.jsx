import { useState, useEffect, useRef } from 'react'
import { fetchWeatherForCity } from './services/weatherService'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import CurrentWeather from './components/CurrentWeather'
import PopularCities from './components/PopularCities'
import Forecast from './components/Forecast'
import Summary from './components/Summary'
import MapCard from './components/MapCard'
import './App.css'

const DEFAULT_CITY = 'Bangalore'

function App() {
    const [weatherData, setWeatherData] = useState(null)
    const [forecastData, setForecastData] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [currentCity, setCurrentCity] = useState(DEFAULT_CITY)
    const [coordinates, setCoordinates] = useState([12.9716, 77.5946]) // Default: Bangalore

    // Prevent duplicate in-flight requests
    const abortRef = useRef(null)

    const fetchWeather = async (city) => {
        if (!city?.trim()) return

        // Cancel any pending request
        if (abortRef.current) abortRef.current.abort()
        abortRef.current = new AbortController()

        setLoading(true)
        setError(null)

        try {
            const data = await fetchWeatherForCity(city)

            setWeatherData(data.weather)
            setForecastData(data.forecast)

            if (data.weather?.coord) {
                setCoordinates([data.weather.coord.lat, data.weather.coord.lon])
            }
        } catch (err) {
            if (err.name !== 'AbortError') {
                setError(err.message || 'An error occurred while fetching weather data.')
            }
        } finally {
            setLoading(false)
        }
    }

    // Load default city on mount
    useEffect(() => {
        fetchWeather(DEFAULT_CITY)
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

                {loading && !weatherData && (
                    <div className="loading-state">
                        <div className="loading-spinner"></div>
                        <p>Fetching weather data…</p>
                    </div>
                )}

                <div className={`dashboard-grid${loading ? ' dashboard-loading' : ''}`}>
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
