import { useState } from 'react'
import './Summary.css'

function Summary({ data }) {
  const [activeTab, setActiveTab] = useState('summary')

  // Generate mock hourly data
  const generateHourlyData = () => {
    const hours = []
    const now = new Date()
    for (let i = 0; i < 12; i++) {
      const hour = new Date(now)
      hour.setHours(now.getHours() + i)
      hours.push({
        time: hour.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
        humidity: Math.floor(Math.random() * 15) + 75,
        temp: Math.floor(Math.random() * 5) + 22,
      })
    }
    return hours
  }

  const hourlyData = data?.list
    ? data.list.slice(0, 12).map((item) => {
        const date = new Date(item.dt * 1000)
        return {
          time: date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
          humidity: item.main.humidity,
          temp: Math.round(item.main.temp),
        }
      })
    : generateHourlyData()

  const today = new Date()
  const todayStr = today.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })

  return (
    <div className="summary-card glass-card">
      <div className="card-header">
        <h3 className="card-title">Summary.</h3>
        <div className="summary-tabs">
          <button
            className={`tab-button ${activeTab === 'summary' ? 'active' : ''}`}
            onClick={() => setActiveTab('summary')}
          >
            Summary
          </button>
          <button
            className={`tab-button ${activeTab === 'hourly' ? 'active' : ''}`}
            onClick={() => setActiveTab('hourly')}
          >
            Hourly
          </button>
          <button
            className={`tab-button ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            More details
          </button>
        </div>
      </div>

      {activeTab === 'summary' && (
        <div className="summary-content">
          <div className="summary-date">Today / {todayStr}</div>
          
          <div className="temperature-chart">
            <svg width="100%" height="60" viewBox="0 0 300 60" className="chart-svg">
              <polyline
                points={hourlyData.map((item, i) => `${(i * 300) / hourlyData.length},${60 - item.temp * 2}`).join(' ')}
                fill="none"
                stroke="rgba(255, 255, 255, 0.8)"
                strokeWidth="2"
              />
            </svg>
          </div>

          <div className="hourly-icons">
            {hourlyData.slice(0, 8).map((item, index) => (
              <div key={index} className="hour-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="rgba(255, 255, 255, 0.6)"/>
                  <path d="M2 17L12 22L22 17" fill="rgba(255, 255, 255, 0.6)"/>
                  <path d="M2 12L12 17L22 12" fill="rgba(255, 255, 255, 0.6)"/>
                </svg>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'hourly' && (
        <div className="hourly-content">
          {hourlyData.map((item, index) => (
            <div key={index} className="hourly-item">
              <span className="hourly-time">{item.time}</span>
              <div className="hourly-details">
                <span className="hourly-temp">{item.temp}°</span>
                <span className="hourly-humidity">{item.humidity}%</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'details' && data && (
        <div className="details-content">
          {data.list && data.list[0] && (
            <div className="details-grid">
              <div className="detail-row">
                <span className="detail-label">Feels Like:</span>
                <span className="detail-value">{Math.round(data.list[0].main.feels_like)}°C</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Pressure:</span>
                <span className="detail-value">{data.list[0].main.pressure} hPa</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Humidity:</span>
                <span className="detail-value">{data.list[0].main.humidity}%</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Wind Speed:</span>
                <span className="detail-value">{data.list[0].wind?.speed || 'N/A'} m/s</span>
              </div>
              {data.list[0].wind?.deg && (
                <div className="detail-row">
                  <span className="detail-label">Wind Direction:</span>
                  <span className="detail-value">{data.list[0].wind.deg}°</span>
                </div>
              )}
              {data.list[0].visibility && (
                <div className="detail-row">
                  <span className="detail-label">Visibility:</span>
                  <span className="detail-value">{(data.list[0].visibility / 1000).toFixed(1)} km</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Summary
