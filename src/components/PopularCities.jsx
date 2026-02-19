import { useState } from 'react'
import './PopularCities.css'

const popularCities = [
  { name: 'Delhi', condition: 'Sunny', description: 'Clear Sky', icon: '01d' },
  { name: 'Mumbai', condition: 'Cloudy', description: 'Drizzle Rain', icon: '09d' },
  { name: 'Hyderabad', condition: 'Cloudy', description: 'Heavy Rain', icon: '09d' },
  { name: 'Bangalore', condition: 'Sunny', description: 'Light Thunder', icon: '11d' },
  { name: 'Kolkata', condition: 'Cloudy', description: 'Mostly Sunny', icon: '02d' },
]

function PopularCities({ onCitySelect }) {
  const [hoveredCity, setHoveredCity] = useState(null)

  return (
    <div className="popular-cities-card glass-card">
      <div className="card-header">
        <h3 className="card-title">Popular Cities</h3>
        <a href="#" className="view-more-link">View more</a>
      </div>
      
      <div className="cities-list">
        {popularCities.map((city, index) => (
          <div
            key={index}
            className={`city-item ${hoveredCity === index ? 'hovered' : ''}`}
            onClick={() => onCitySelect(city.name)}
            onMouseEnter={() => setHoveredCity(index)}
            onMouseLeave={() => setHoveredCity(null)}
          >
            <div className="city-weather-icon">
              <img
                src={`https://openweathermap.org/img/wn/${city.icon}.png`}
                alt={city.condition}
              />
            </div>
            <div className="city-info">
              <span className="city-name">{city.name}</span>
              <span className="city-weather">{city.condition}, {city.description}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PopularCities
