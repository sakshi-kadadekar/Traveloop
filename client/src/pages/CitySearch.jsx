import { useState, useEffect } from 'react'
import API from '../api/axios'
import Navbar from '../components/Navbar'

export default function CitySearch() {
  const [cities, setCities] = useState([])
  const [query, setQuery] = useState('')
  const [country, setCountry] = useState('')
  const [region, setRegion] = useState('')
  const [trips, setTrips] = useState([])
  const [selectedCity, setSelectedCity] = useState(null)

  useEffect(() => {
    searchCities()
    API.get('/trips').then(res => setTrips(res.data))
  }, [])

  const searchCities = async () => {
    const res = await API.get('/cities', { params: { q: query, country, region } })
    setCities(res.data)
  }

  const addToTrip = async (tripId) => {
    if (!selectedCity) return
    await API.post('/stops', {
      tripId,
      cityId: selectedCity.id,
      cityName: selectedCity.name,
      country: selectedCity.country,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 86400000).toISOString(),
      orderIndex: 0
    })
    setSelectedCity(null)
    alert('City added to trip!')
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="mx-auto max-w-6xl p-6">
        <h1 className="mb-6 text-3xl font-bold">Discover Cities</h1>

        <div className="mb-6 flex flex-wrap gap-4">
          <input
            className="flex-1 rounded-lg bg-gray-900 p-3 text-white outline-none"
            placeholder="Search by name"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <input
            className="w-48 rounded-lg bg-gray-900 p-3 text-white outline-none"
            placeholder="Country"
            value={country}
            onChange={e => setCountry(e.target.value)}
          />
          <input
            className="w-48 rounded-lg bg-gray-900 p-3 text-white outline-none"
            placeholder="Region"
            value={region}
            onChange={e => setRegion(e.target.value)}
          />
          <button onClick={searchCities} className="rounded-lg bg-amber-400 px-6 py-3 font-bold text-black">
            Search
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {cities.map(city => (
            <div key={city.id} className="overflow-hidden rounded-xl bg-gray-900 transition-transform hover:scale-105">
              <img src={city.image || 'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=800'} alt={city.name} className="h-48 w-full object-cover" />
              <div className="p-5">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-xl font-bold">{city.name}</h3>
                  <span className="rounded bg-amber-400/20 px-2 py-1 text-xs font-bold text-amber-400">
                    ★ {city.popularity}
                  </span>
                </div>
                <p className="mb-4 text-gray-400">{city.country} {city.region ? `• ${city.region}` : ''}</p>
                <div className="mb-4 flex items-center gap-2 text-sm text-gray-300">
                  <span className="rounded bg-gray-800 px-2 py-1">Cost Index: {city.costIndex}</span>
                </div>
                <button
                  onClick={() => setSelectedCity(city)}
                  className="w-full rounded-lg bg-amber-400 py-2 font-bold text-black transition-colors hover:bg-amber-500"
                >
                  Add to Trip
                </button>
              </div>
            </div>
          ))}
        </div>

        {selectedCity && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
            <div className="w-full max-w-md rounded-xl bg-gray-900 p-6">
              <h2 className="mb-4 text-2xl font-bold">Add {selectedCity.name} to Trip</h2>
              <div className="max-h-60 space-y-2 overflow-y-auto">
                {trips.length === 0 && <p className="text-gray-400">No upcoming trips found.</p>}
                {trips.map(trip => (
                  <button
                    key={trip.id}
                    onClick={() => addToTrip(trip.id)}
                    className="block w-full rounded-lg bg-gray-800 p-3 text-left hover:bg-gray-700"
                  >
                    {trip.name}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setSelectedCity(null)}
                className="mt-6 w-full rounded-lg bg-gray-800 py-2 font-bold hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
