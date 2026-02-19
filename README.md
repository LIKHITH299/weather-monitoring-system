# Weather Application

A modern, responsive React-based weather application that fetches and displays real-time weather information using the OpenWeatherMap API.

## Features

- 🔍 **Search Weather by City** - Enter any city name to get current weather information
- 🌡️ **Current Weather Display** - Shows temperature, humidity, wind speed, and weather conditions
- 🎨 **Beautiful UI** - Clean, modern, and responsive design that works on mobile and desktop
- ⚡ **Fast Performance** - Built with Vite for optimal loading times
- 🛡️ **Error Handling** - Comprehensive error handling for invalid cities and API errors
- 📱 **Responsive Design** - Works seamlessly on all device sizes

## Technology Stack

- **React.js** - Frontend framework
- **Vite** - Build tool and development server
- **OpenWeatherMap API** - Weather data provider
- **CSS3** - Styling with modern CSS features

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenWeatherMap API key ([Get one here](https://openweathermap.org/api))

## Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd weather-app
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Open `.env` and replace `your_api_key_here` with your OpenWeatherMap API key:
     ```
     VITE_WEATHER_API_KEY=your_actual_api_key_here
     ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   - Navigate to `http://localhost:5173` (or the URL shown in the terminal)

## Project Structure

```
weather-app/
├── src/
│   ├── components/
│   │   ├── Search.jsx          # Search input component
│   │   ├── Search.css
│   │   ├── WeatherCard.jsx     # Weather display component
│   │   └── WeatherCard.css
│   ├── App.jsx                  # Main application component
│   ├── App.css                  # App styles
│   ├── main.jsx                 # Application entry point
│   └── index.css                # Global styles
├── .env                         # Environment variables (not in git)
├── .env.example                 # Example environment file
├── index.html                   # HTML template
├── vite.config.js               # Vite configuration
└── package.json                 # Project dependencies
```

## Usage

1. **Enter a city name** in the search input field
2. **Click "Search"** or press Enter
3. **View the weather information** including:
   - City name
   - Current temperature (°C)
   - Weather condition and description
   - Humidity percentage
   - Wind speed (m/s)
   - Weather icon

## API Integration

The application uses the OpenWeatherMap API:

- **Endpoint:** `https://api.openweathermap.org/data/2.5/weather`
- **Parameters:**
  - `q`: City name
  - `appid`: Your API key
  - `units`: metric (for Celsius)

Example API call:
```
https://api.openweathermap.org/data/2.5/weather?q=London&appid=YOUR_API_KEY&units=metric
```

## Building for Production

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Preview the production build:**
   ```bash
   npm run preview
   ```

The build output will be in the `dist` directory.

## Deployment

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI** (optional):
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```
   Or connect your GitHub repository to [Vercel](https://vercel.com) for automatic deployments.

3. **Set environment variables:**
   - In Vercel dashboard, go to your project settings
   - Add `VITE_WEATHER_API_KEY` with your API key value
   - Redeploy the application

### Deploy to Netlify

1. **Install Netlify CLI:**
   ```bash
   npm i -g netlify-cli
   ```

2. **Build and deploy:**
   ```bash
   npm run build
   netlify deploy --prod --dir=dist
   ```

3. **Set environment variables:**
   - In Netlify dashboard, go to Site settings > Environment variables
   - Add `VITE_WEATHER_API_KEY` with your API key value
   - Redeploy the application

### Deploy to GitHub Pages

1. **Install gh-pages:**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add deploy script to package.json:**
   ```json
   "scripts": {
     "deploy": "npm run build && gh-pages -d dist"
   }
   ```

3. **Deploy:**
   ```bash
   npm run deploy
   ```

**Note:** For GitHub Pages, you'll need to configure the base path in `vite.config.js`:
```js
export default defineConfig({
  base: '/your-repo-name/',
  plugins: [react()],
})
```

## Environment Variables

The application requires the following environment variable:

- `VITE_WEATHER_API_KEY` - Your OpenWeatherMap API key

**Important:** 
- Environment variables prefixed with `VITE_` are exposed to the client-side code
- Never commit your `.env` file to version control
- Always use `.env.example` as a template

## Error Handling

The application handles various error scenarios:

- **Invalid city name** - Shows "City not found" message
- **API errors** - Displays appropriate error messages
- **Network errors** - Shows network error notification
- **Missing API key** - Prompts user to configure API key

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

Potential features for future versions:

- 🌤️ 7-day weather forecast
- 📍 Weather by GPS location
- 🌓 Dark/Light mode toggle
- 📊 Weather charts and graphs
- ⭐ Save favorite cities
- 🌍 Multi-language support

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

For issues and questions:
- Check the [OpenWeatherMap API documentation](https://openweathermap.org/api)
- Review the error messages in the application
- Ensure your API key is correctly configured

## Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) for providing the weather API
- [Vite](https://vitejs.dev/) for the excellent build tool
- [React](https://react.dev/) for the powerful UI library

---

**Happy Weather Tracking! 🌤️**
