export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { city } = req.query

  // Validate city parameter
  if (!city || !city.trim()) {
    return res.status(400).json({ error: 'City parameter is required' })
  }

  const API_KEY = process.env.WEATHER_API_KEY

  if (!API_KEY) {
    console.error('WEATHER_API_KEY environment variable is not set')
    return res.status(500).json({ error: 'Server configuration error' })
  }

  try {
    // Fetch current weather
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city.trim())}&appid=${API_KEY}&units=metric`
    const weatherResponse = await fetch(weatherUrl)

    if (!weatherResponse.ok) {
      const errorData = await weatherResponse.json().catch(() => ({}))

      if (weatherResponse.status === 404) {
        return res.status(404).json({
          error: 'City not found. Please check the city name and try again.',
        })
      }
      if (weatherResponse.status === 401) {
        console.error('Invalid OpenWeather API key')
        return res.status(500).json({ error: 'Server configuration error' })
      }
      if (weatherResponse.status === 429) {
        return res.status(429).json({
          error: 'Too many requests. Please try again in a moment.',
        })
      }

      return res.status(weatherResponse.status).json({
        error: errorData.message || 'Failed to fetch weather data',
      })
    }

    const weatherData = await weatherResponse.json()

    // Fetch 5-day forecast
    let forecastData = null
    try {
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city.trim())}&appid=${API_KEY}&units=metric`
      const forecastResponse = await fetch(forecastUrl)
      if (forecastResponse.ok) {
        forecastData = await forecastResponse.json()
      }
    } catch (err) {
      // Forecast is optional, don't fail the entire request
      console.warn('Forecast fetch failed:', err.message)
    }

    return res.status(200).json({
      weather: weatherData,
      forecast: forecastData,
    })
  } catch (err) {
    console.error('Weather API error:', err)
    return res.status(500).json({
      error: 'An unexpected error occurred. Please try again.',
    })
  }
}
