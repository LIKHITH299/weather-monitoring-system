import './WeatherCard.css'

function WeatherCard({ data }) {
  const {
    name,
    main: { temp, humidity },
    weather,
    wind: { speed },
  } = data

  const weatherCondition = weather[0].main
  const weatherDescription = weather[0].description
  const weatherIcon = weather[0].icon

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
    <div className="weather-card">
      <div className="weather-header">
        <h2 className="city-name">{name}</h2>
        <div className="weather-icon-container">
          <img
            src={`https://openweathermap.org/img/wn/${weatherIcon}@2x.png`}
            alt={weatherDescription}
            className="weather-icon"
          />
          <span className="weather-emoji">{getWeatherEmoji(weatherCondition)}</span>
        </div>
      </div>

      <div className="weather-main">
        <div className="temperature">
          <span className="temp-value">{Math.round(temp)}</span>
          <span className="temp-unit">°C</span>
        </div>
        <p className="weather-condition">{weatherDescription}</p>
      </div>

      <div className="weather-details">
        <div className="detail-item">
          <span className="detail-label">Humidity</span>
          <span className="detail-value">{humidity}%</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Wind Speed</span>
          <span className="detail-value">{speed} m/s</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Condition</span>
          <span className="detail-value">{weatherCondition}</span>
        </div>
      </div>
    </div>
  )
}

export default WeatherCard
