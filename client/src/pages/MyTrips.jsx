import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/axios'
import Navbar from '../components/Navbar'

export default function MyTrips() {
  const [trips, setTrips] = useState([])
  const [filter, setFilter] = useState('all')
  const navigate = useNavigate()

  useEffect(() => {
    API.get('/trips').then(res => setTrips(res.data))
  }, [])

  const filtered = filter === 'all' ? trips : trips.filter(t => t.status === filter)

  const deleteTrip = async (id) => {
    await API.delete(`/trips/${id}`)
    setTrips(trips.filter(t => t.id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Trips</h1>
          <button onClick={() => navigate('/trips/new')} className="bg-amber-400 text-black font-bold px-5 py-2 rounded-xl">+ New Trip</button>
        </div>
        <div className="flex gap-3 mb-6">
          {['all','upcoming','ongoing','completed'].map(s => (
            <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-lg capitalize text-sm font-medium ${filter===s ? 'bg-amber-400 text-black' : 'bg-gray-800 text-gray-300'}`}>{s}</button>
          ))}
        </div>
        <div className="space-y-4">
          {filtered.map(trip => (
            <div key={trip.id} className="bg-gray-900 rounded-xl p-5 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold">{trip.name}</h3>
                <p className="text-gray-400 text-sm">{trip.stops?.length || 0} stops • {trip.status}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => navigate(`/trips/${trip.id}/view`)} className="bg-gray-700 px-4 py-2 rounded-lg text-sm">View</button>
                <button onClick={() => navigate(`/trips/${trip.id}/build`)} className="bg-gray-700 px-4 py-2 rounded-lg text-sm">Edit</button>
                <button onClick={() => deleteTrip(trip.id)} className="bg-red-900 px-4 py-2 rounded-lg text-sm">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}