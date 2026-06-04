import { useEffect, useState } from "react";

export function WeatherInfo({ location }) {
  const [address, setAddress] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const [lat, lon] = location;
    const AWS_API_BASE = 'https://1j07jh7bwi.execute-api.ap-south-1.amazonaws.com';

    setLoading(true);

    async function fetchData() {
      try {
        const [weatherRes, addressRes] = await Promise.all([
          fetch(`${AWS_API_BASE}/weather?lat=${lat}&lon=${lon}`),
          fetch(`${AWS_API_BASE}/reverseGeocode?lat=${lat}&lon=${lon}`)
        ]);
        const weatherData = await weatherRes.json();
        const addressData = await addressRes.json();

        setWeather(weatherData);
        setAddress(addressData);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [location]);

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
  const timeStr = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Loading skeleton
  if (loading || !weather || !address) {
    return (
      <>
        <div className="weather-header">
          <div className="skeleton skeleton-header"></div>
          <div className="skeleton skeleton-subheader"></div>
          <div className="skeleton skeleton-date"></div>
        </div>

        <div className="skeleton-hero">
          <div className="skeleton skeleton-icon"></div>
          <div className="skeleton-temp-group">
            <div className="skeleton skeleton-temp"></div>
            <div className="skeleton skeleton-desc"></div>
          </div>
        </div>

        <div className="skeleton-grid">
          <div className="skeleton skeleton-card"></div>
          <div className="skeleton skeleton-card"></div>
          <div className="skeleton skeleton-card"></div>
          <div className="skeleton skeleton-card"></div>
        </div>

        <div className="skeleton skeleton-coords"></div>
      </>
    );
  }

  const iconCode = weather.weather?.icon || '01d';
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

  const cityName = address.address?.city
    || address.address?.town
    || address.address?.village
    || address.address?.county
    || 'Unknown';

  const stateName = address.address?.state || '';

  const stats = [
    {
      icon: '🌡️',
      label: 'Feels Like',
      value: weather.temperature?.feelsLike ?? '--',
      unit: '°C',
    },
    {
      icon: '💧',
      label: 'Humidity',
      value: weather.atmosphere?.humidity ?? '--',
      unit: '%',
    },
    {
      icon: '💨',
      label: 'Wind',
      value: weather.wind?.speed ?? '--',
      unit: 'm/s',
    },
    {
      icon: '🔽',
      label: 'Pressure',
      value: weather.atmosphere?.pressure ?? '--',
      unit: 'hPa',
    },
  ];

  return (
    <>
      {/* Location Header */}
      <div className="weather-header">
        <div className="weather-location">{cityName}</div>
        {stateName && (
          <div className="weather-sublocation">{stateName}</div>
        )}
        <div className="weather-date">{dateStr} · {timeStr}</div>
      </div>

      {/* Hero — Temperature + Icon */}
      <div className="weather-hero">
        <div className="weather-icon-wrapper">
          <img
            className="weather-icon"
            src={iconUrl}
            alt={weather.weather?.description || 'Weather icon'}
          />
        </div>
        <div className="weather-temp-group">
          <div className="weather-temp">
            {Math.round(weather.temperature?.current ?? 0)}
            <span className="weather-temp-unit">°C</span>
          </div>
          <div className="weather-description">
            {weather.weather?.description || ''}
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="stat-grid">
        {stats.map((stat) => (
          <div className="stat-card glass-card" key={stat.label}>
            <div className="stat-card-header">
              <span className="stat-icon">{stat.icon}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
            <div className="stat-value">
              {stat.value}
              <span className="stat-unit">{stat.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Coordinates Badge */}
      <div className="coords-badge glass-card">
        <span className="coords-badge-dot"></span>
        <span className="coords-label">LAT</span> {location[0].toFixed(4)}
        <span style={{ margin: '0 4px', color: 'var(--text-tertiary)' }}>·</span>
        <span className="coords-label">LON</span> {location[1].toFixed(4)}
      </div>
    </>
  );
}  