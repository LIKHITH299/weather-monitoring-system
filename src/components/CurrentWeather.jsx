import './CurrentWeather.css'

function CurrentWeather({ data }) {
  const {
    name,
    main: { 
      temp, 
      feels_like, 
      temp_min, 
      temp_max, 
      humidity, 
      pressure,
      sea_level,
      grnd_level
    },
    weather,
    wind: { speed, deg, gust },
    visibility,
    clouds: { all: cloudiness } = {},
    sys: { sunrise, sunset } = {},
    dt,
    timezone
  } = data

  const weatherCondition = weather[0].main
  const weatherDescription = weather[0].description
  const weatherIcon = weather[0].icon
  
  // Calculate UV index (approximate based on time and conditions)
  const currentHour = new Date((dt + timezone) * 1000).getHours()
  const uvIndex = weatherCondition === 'Clear' 
    ? Math.max(0.5, Math.min(11, (12 - Math.abs(12 - currentHour)) * 0.9))
    : Math.max(0.5, Math.min(5, (12 - Math.abs(12 - currentHour)) * 0.4))
  
  // Calculate rain chance (if available in weather condition)
  const rainChance = weatherCondition === 'Rain' || weatherCondition === 'Drizzle' || weatherCondition === 'Thunderstorm'
    ? Math.min(95, humidity + 20)
    : humidity > 80 ? humidity - 10 : Math.max(10, humidity - 30)

  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  })

  const getWeatherEmoji = (condition) => {
    const emojiMap = {
      Clear: '☀️',
      Clouds: '☁️',
      Rain: '🌧️',
      Drizzle: '🌦️',
      Thunderstorm: '⛈️',
      Snow: '❄️',
      Mist: '🌫️',
      Fog: '🌫️',
    }
    return emojiMap[condition] || '🌤️'
  }

  return (
    <div className="current-weather-card glass-card">
      <div className="current-weather-header">
        <h3 className="card-title">Current Weather</h3>
        <span className="current-time">{currentTime}</span>
      </div>
      
      <div className="weather-icon-large">
        <img
          src={`https://openweathermap.org/img/wn/${weatherIcon}@2x.png`}
          alt={weatherDescription}
          className="weather-icon-img"
        />
        <span className="weather-emoji-large">{getWeatherEmoji(weatherCondition)}</span>
      </div>

      <div className="temperature-display">
        <span className="temp-large">{Math.round(temp)}</span>
        <span className="temp-unit-large">°C</span>
      </div>
      
      <p className="weather-description">{weatherDescription}</p>
      
      {feels_like && (
        <p className="feels-like">Feels like {Math.round(feels_like)}°C</p>
      )}

      <div className="weather-stats">
        <div className="stat-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2.69L5 12L12 21.31L19 12L12 2.69Z" fill="currentColor"/>
            <path d="M12 6L8 12H16L12 6Z" fill="white"/>
          </svg>
          <span className="stat-label">Humidity</span>
          <span className="stat-value">{humidity}%</span>
        </div>
        
        <div className="stat-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" fill="currentColor"/>
            <path d="M12 6V12L16 14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="stat-label">Wind</span>
          <span className="stat-value">{Math.round(speed * 3.6)} Km/h</span>
        </div>
        
        <div className="stat-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="stat-label">UV Index</span>
          <span className="stat-value">{uvIndex.toFixed(1)}</span>
        </div>
      </div>
      
      <div className="additional-stats">
        {pressure && (
          <div className="additional-stat">
            <span className="additional-label">Pressure:</span>
            <span className="additional-value">{pressure} hPa</span>
          </div>
        )}
        {visibility && (
          <div className="additional-stat">
            <span className="additional-label">Visibility:</span>
            <span className="additional-value">{(visibility / 1000).toFixed(1)} km</span>
          </div>
        )}
        {cloudiness !== undefined && (
          <div className="additional-stat">
            <span className="additional-label">Cloudiness:</span>
            <span className="additional-value">{cloudiness}%</span>
          </div>
        )}
        {rainChance && (
          <div className="additional-stat">
            <span className="additional-label">Rain Chance:</span>
            <span className="additional-value">{Math.round(rainChance)}%</span>
          </div>
        )}
      </div>

      <div className="view-more">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  )
}

export default CurrentWeather
