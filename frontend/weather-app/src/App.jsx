import './App.css';
import "leaflet/dist/leaflet.css";
import { useState } from 'react';
import { WeatherInfo } from './WeatherInfo';
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";

function LocationMarker({ location, setLocation }) {
  useMapEvents({
    click(e) {
      setLocation([e.latlng.lat, e.latlng.lng]);
    }
  });

  return (
    <Marker position={location}>
      <Popup>Selected Location</Popup>
    </Marker>
  );
}

function App() {
  const [location, setLocation] = useState([28.6139, 77.2090]);

  return (
    <div className="app-container">
      {/* Left Panel — Weather Info */}
      <aside className="weather-panel">
        <div className="app-brand">
          <span className="app-brand-icon">🌤️</span>
          <h1>Weather</h1>
          <span className="app-brand-badge">Live</span>
        </div>

        <WeatherInfo location={location} />

        <div className="map-instruction">
          <span className="map-instruction-icon">📍</span>
          Click anywhere on the map to check weather
        </div>
      </aside>

      {/* Right Panel — Interactive Map */}
      <main className="map-panel">
        <div className="map-wrapper">
          <MapContainer
            center={location}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
            zoomControl={true}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            />

            <LocationMarker
              location={location}
              setLocation={setLocation}
            />
          </MapContainer>
        </div>
      </main>
    </div>
  );
}

export default App;
