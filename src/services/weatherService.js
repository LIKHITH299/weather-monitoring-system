/**
 * weatherService.js
 * Centralised API calls for the weather app.
 * All calls go through the secure /api/* backend – the OpenWeather key
 * is never exposed to the browser.
 */

/**
 * Fetch current weather + forecast for a city.
 * @param {string} city
 * @returns {{ weather: object, forecast: object|null }}
 */
export async function fetchWeatherForCity(city) {
    if (!city || !city.trim()) {
        throw new Error('Please enter a city name.')
    }

    const response = await fetch(`/api/weather?city=${encodeURIComponent(city.trim())}`)
    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch weather data.')
    }

    return data
}

/**
 * Fetch city autocomplete suggestions.
 * Falls back to an empty array on error so the UI is never broken.
 * @param {string} query
 * @returns {Array<{ name: string, country: string, state?: string }>}
 */
export async function fetchCitySuggestions(query) {
    if (!query || query.trim().length < 2) return []

    try {
        const response = await fetch(`/api/geo?q=${encodeURIComponent(query.trim())}`)
        if (response.ok) {
            return await response.json()
        }
    } catch (_) {
        // silently fall through to empty array
    }

    return []
}
