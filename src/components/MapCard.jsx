import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './MapCard.css'

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

function MapUpdater({ center, zoom }) {
  const map = useMap()
  
  useEffect(() => {
    map.setView(center, zoom)
  }, [map, center, zoom])
  
  return null
}

function MapControls({ onZoomIn, onZoomOut }) {
  return (
    <div className="map-controls">
      <button 
        className="map-control-btn"
        onClick={onZoomIn}
        title="Zoom in"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2V22M2 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>
      <button 
        className="map-control-btn"
        onClick={onZoomOut}
        title="Zoom out"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2V22M2 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <path d="M12 2L2 12L12 22L22 12L12 2Z" stroke="currentColor" strokeWidth="2"/>
        </svg>
      </button>
    </div>
  )
}

function MapCard({ city, coordinates }) {
  const [mapInstance, setMapInstance] = useState(null)
  const [zoom, setZoom] = useState(coordinates ? 12 : 10)
  
  // Default coordinates (Hyderabad)
  const defaultCenter = coordinates || [17.3850, 78.4867]

  const handleZoomIn = () => {
    if (mapInstance) {
      const newZoom = mapInstance.getZoom() + 1
      mapInstance.setZoom(newZoom)
      setZoom(newZoom)
    }
  }

  const handleZoomOut = () => {
    if (mapInstance) {
      const newZoom = mapInstance.getZoom() - 1
      mapInstance.setZoom(newZoom)
      setZoom(newZoom)
    }
  }

  return (
    <div className="map-card glass-card">
      <div className="map-container">
        <MapContainer
          center={defaultCenter}
          zoom={zoom}
          scrollWheelZoom={true}
          className="leaflet-map"
          whenCreated={setMapInstance}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapUpdater center={defaultCenter} zoom={zoom} />
          <Marker position={defaultCenter}>
            <Popup>
              <strong>{city}</strong>
            </Popup>
          </Marker>
        </MapContainer>
        <MapControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />
      </div>
    </div>
  )
}

export default MapCard
