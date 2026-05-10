import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import API from '../api/axios'
import Navbar from '../components/Navbar'

export default function ActivitySearch() {
  const { id } = useParams() // Trip ID
  const [trip, setTrip] = useState(null)
  const [globalActivities, setGlobalActivities] = useState([])
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [maxCost, setMaxCost] = useState('')
  const [selectedStopId, setSelectedStopId] = useState('')

  useEffect(() => {
    API.get(`/trips/${id}`).then(res => {
      setTrip(res.data)
      if (res.data.stops?.length > 0) {
        setSelectedStopId(res.data.stops[0].id)
      }
    })
  }, [id])

  useEffect(() => {
    if (selectedStopId) {
      searchGlobalActivities()
    }
  }, [selectedStopId, query, typeFilter, maxCost])

  const searchGlobalActivities = async () => {
    const stop = trip?.stops?.find(s => s.id === selectedStopId)
    const cityId = stop?.cityId
    const res = await API.get('/activities/global', { params: { cityId, type: typeFilter, maxCost } })
    let filtered = res.data
    if (query) {
      filtered = filtered.filter(a => a.name.toLowerCase().includes(query.toLowerCase()))
    }
    setGlobalActivities(filtered)
  }

  const addToItinerary = async (act) => {
    if (!selectedStopId) return
    await API.post('/activities', {
      stopId: selectedStopId,
      name: act.name,
      type: act.type,
      cost: act.cost,
      duration: act.duration,
      description: act.description
    })
    const res = await API.get(`/trips/${id}`)
    setTrip(res.data)
    alert('Activity added!')
  }

  const removeActivity = async (actId) => {
    await API.delete(`/activities/${actId}`)
    const res = await API.get(`/trips/${id}`)
    setTrip(res.data)
  }

  const currentStopActivities = trip?.stops?.find(s => s.id === selectedStopId)?.activities || []

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="mx-auto max-w-6xl p-6">
        <h1 className="mb-6 text-3xl font-bold">Activity Search</h1>

        <div className="mb-6 rounded-xl bg-gray-900 p-4">
          <label className="mb-2 block font-bold text-amber-400">Select Stop/City</label>
          <select
            className="w-full rounded-lg bg-gray-800 p-3 text-white outline-none"
            value={selectedStopId}
            onChange={e => setSelectedStopId(e.target.value)}
          >
            {trip?.stops?.map(stop => (
              <option key={stop.id} value={stop.id}>
                {stop.cityName || stop.city?.name || 'Unknown City'} ({stop.startDate?.slice(0,10)})
              </option>
            ))}
          </select>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <input
            className="rounded-lg bg-gray-900 p-3 text-white outline-none"
            placeholder="Search activities..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <select
            className="rounded-lg bg-gray-900 p-3 text-white outline-none"
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="food">Food & Drink</option>
            <option value="sightseeing">Sightseeing</option>
            <option value="adventure">Adventure</option>
            <option value="cultural">Cultural</option>
          </select>
          <input
            type="number"
            className="rounded-lg bg-gray-900 p-3 text-white outline-none"
            placeholder="Max Cost"
            value={maxCost}
            onChange={e => setMaxCost(e.target.value)}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="mb-4 text-xl font-bold text-gray-300">Available Activities</h2>
            <div className="space-y-4">
              {globalActivities.length === 0 && <p className="text-gray-500">No activities found for this city/filters.</p>}
              {globalActivities.map(act => (
                <div key={act.id} className="flex gap-4 rounded-xl bg-gray-900 p-4">
                  <img src={act.image || 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=300'} alt={act.name} className="h-24 w-24 rounded-lg object-cover" />
                  <div className="flex-1">
                    <h3 className="font-bold">{act.name}</h3>
                    <p className="mb-2 text-sm text-gray-400">{act.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">⏱ {act.duration}</span>
                      <span className="font-bold text-amber-400">₹{act.cost}</span>
                    </div>
                  </div>
                  <button onClick={() => addToItinerary(act)} className="self-center rounded-full bg-amber-400 p-2 font-bold text-black">+</button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-xl font-bold text-amber-400">In Your Itinerary</h2>
            <div className="space-y-4">
              {currentStopActivities.length === 0 && <p className="text-gray-500">No activities added yet.</p>}
              {currentStopActivities.map(act => (
                <div key={act.id} className="flex items-center justify-between rounded-xl bg-gray-800 p-4 border border-amber-400/20">
                  <div>
                    <h3 className="font-bold">{act.name}</h3>
                    <p className="text-sm text-gray-400">{act.duration} • ₹{act.cost}</p>
                  </div>
                  <button onClick={() => removeActivity(act.id)} className="text-red-400 hover:text-red-300">Remove</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
