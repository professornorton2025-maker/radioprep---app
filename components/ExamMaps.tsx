
import React, { useState, useEffect } from 'react';
import { findStudyCenters } from '../services/geminiService';

const ExamMaps: React.FC = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [data, setData] = useState<{ text: string; places: any[] } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setLocation({ lat: -3.8833, lng: -38.4500 }) // Default Eusébio
    );
  }, []);

  const searchPlaces = async () => {
    if (!location) return;
    setLoading(true);
    try {
      const res = await findStudyCenters(location.lat, location.lng);
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <h3 className="text-lg font-bold mb-4">Centros de Estudo e Locais Próximos</h3>
        <button
          onClick={searchPlaces}
          disabled={loading}
          className="bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-location-dot mr-2"></i>}
          Buscar Locais de Estudo no Eusébio
        </button>

        {data && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-gray-50 rounded-xl text-sm italic">
              {data.text}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.places.map((place, i) => (
                <a
                  key={i}
                  href={place.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 border rounded-xl hover:bg-indigo-50 transition-all flex justify-between items-center group"
                >
                  <div className="flex items-center gap-3">
                    <i className="fas fa-map-pin text-red-500"></i>
                    <span className="font-medium text-gray-800">{place.title}</span>
                  </div>
                  <i className="fas fa-chevron-right text-gray-300 group-hover:text-indigo-500"></i>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="aspect-video bg-gray-200 rounded-2xl overflow-hidden relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-500 font-medium">Mapa Interativo (Simulado)</p>
        </div>
        <img src={`https://picsum.photos/seed/map/1200/600`} className="w-full h-full object-cover opacity-50" alt="Map Placeholder" />
      </div>
    </div>
  );
};

export default ExamMaps;
