import React from 'react';
import { X, MapPin } from 'lucide-react';

const Country = ({ country, onClose }) => {
  if (!country) return null;

  const currencies = country.currencies 
    ? Object.values(country.currencies).map(c => `${c.name} (${c.symbol})`).join(', ') 
    : 'Nothing Available';

  const languages = country.languages 
    ? Object.values(country.languages).join(', ') 
    : 'Nothing Available';

  return (
    <div className="fixed inset-0 fade-in z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white pop-in rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        

        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <span className="text-4xl">{country.flag}</span> {country.name.official}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-500 uppercase">Capital</label>
              <p className="text-lg text-gray-900">{country.capital ? country.capital[0] : 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-500 uppercase">Region</label>
              <p className="text-gray-900">{country.region} ({country.subregion})</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-500 uppercase">Currencies</label>
              <p className="text-gray-900">{currencies}</p>
            </div>
             <div>
              <label className="text-sm font-semibold text-gray-500 uppercase">Languages</label>
              <p className="text-gray-900">{languages}</p>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-6">
            <div className="text-center">
              <label className="text-sm font-semibold text-gray-500 uppercase mb-2 block">Coat of Arms</label>
              {country.coatOfArms?.png ? (
                <img src={country.coatOfArms.png} alt="Coat of Arms" className="h-32 object-contain" />
              ) : <p className="text-gray-400 italic">Nothing available</p>}
            </div>

            <a 
              href={country.maps.googleMaps} 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium bg-blue-50 px-4 py-2 rounded-lg transition"
            >
              <MapPin className="w-4 h-4" /> View on Google Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Country;