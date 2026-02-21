export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const { q } = req.query

    if (!q || !q.trim() || q.trim().length < 2) {
        return res.status(400).json({ error: 'Query must be at least 2 characters' })
    }

    const API_KEY = process.env.WEATHER_API_KEY

    if (!API_KEY) {
        return res.status(500).json({ error: 'Server configuration error' })
    }

    try {
        const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(q.trim())}&limit=5&appid=${API_KEY}`
        const response = await fetch(geoUrl)

        if (!response.ok) {
            return res.status(response.status).json({ error: 'Geocoding request failed' })
        }

        const data = await response.json()
        return res.status(200).json(data)
    } catch (err) {
        console.error('Geo API error:', err)
        return res.status(500).json({ error: 'An unexpected error occurred' })
    }
}
