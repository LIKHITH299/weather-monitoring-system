import { useState } from 'react'
import './Forecast.css'

function Forecast({ data }) {
  const [activeTab, setActiveTab] = useState('7days')

  // Generate mock forecast data if API data is not available
  const generateForecastData = () => {
    const days = []
    const today = new Date()
    for (let i = 0; i < 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      days.push({
        date: date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        high: Math.floor(Math.random() * 5) + 22,
        low: Math.floor(Math.random() * 5) + 18,
        icon: i % 2 === 0 ? '02d' : '01d',
      })
    }
    return days
  }

  const forecastDays = data?.list 
    ? data.list.slice(0, 7).map((item, index) => {
        const date = new Date(item.dt * 1000)
        return {
          date: date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
          day: date.toLocaleDateString('en-US', { weekday: 'short' }),
          high: Math.round(item.main.temp_max),
          low: Math.round(item.main.temp_min),
          icon: item.weather[0].icon,
        }
      })
    : generateForecastData()

  return (
    <div className="forecast-card glass-card">
      <div className="card-header">
        <h3 className="card-title">Forecast.</h3>
        <div className="forecast-tabs">
          <button
            className={`tab-button ${activeTab === '7days' ? 'active' : ''}`}
            onClick={() => setActiveTab('7days')}
          >
            7 Days
          </button>
          <button
            className={`tab-button ${activeTab === '30days' ? 'active' : ''}`}
            onClick={() => setActiveTab('30days')}
          >
            30 Days
          </button>
        </div>
      </div>
      
      <div className="forecast-list">
        {forecastDays.map((day, index) => (
          <div key={index} className={`forecast-item ${index === 0 ? 'selected' : ''}`}>
            <div className="forecast-icon">
              <img
                src={`https://openweathermap.org/img/wn/${day.icon}.png`}
                alt="weather"
              />
            </div>
            <div className="forecast-temp">
              <span className="temp-high">{day.high}°</span>
              <span className="temp-separator">/</span>
              <span className="temp-low">{day.low}°</span>
            </div>
            <div className="forecast-date">
              <span className="date">{day.date}</span>
              <span className="day">{day.day}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Forecast
