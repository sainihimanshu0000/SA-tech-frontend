import React, { useEffect, useState } from 'react';
import API from '../api/axios';

export default function IoTDashboard() {
  const [forecast, setForecast] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        // default sample coordinates
        const lat = 26.9124, lon = 75.7873;
        const r = await API.get('/weather/forecast', { params: { lat, lon } });
        setForecast(r.data.data);
      } catch (err) { console.error(err); }
    }
    load();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-[#1B5E20] mb-4">IoT & Weather Advisory</h2>
      {forecast ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] text-white p-4 rounded-lg">
            <div className="text-sm">Sensor Zone</div>
            <div className="text-3xl font-bold mt-2">{forecast.list?.[0]?.main?.temp}°C</div>
            <div className="text-xs mt-1 text-[#FBC02D]">{forecast.list?.[0]?.weather?.[0]?.description}</div>
          </div>
          <div className="bg-white p-4 rounded-lg"> 
            <h4 className="font-semibold">5-Day Forecast</h4>
            <div className="mt-2 text-xs text-gray-600">{forecast.city?.name} - Data pulled from OpenWeatherMap</div>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-semibold">Sowing Advisory</h4>
            <p className="text-xs text-gray-600 mt-1">Use the advisory panel to get recommended products matched to forecast.</p>
            <button className="mt-3 px-3 py-1 bg-[#2E7D32] text-white rounded text-xs" onClick={async () => {
              const r = await API.get('/weather/advisory/recommendations', { params: { lat: 26.9124, lon: 75.7873 } });
              alert(`Found ${r.data.recommendations.length} recommendations`);
            }}>Get Recommendations</button>
          </div>
        </div>
      ) : (
        <div>Loading forecast...</div>
      )}
    </div>
  );
}
