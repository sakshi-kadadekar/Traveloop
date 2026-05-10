import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/axios'
import Navbar from '../components/Navbar'

export default function Community() {
  const [trips, setTrips] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    API.get('/trips/all/public').then(res => setTrips(res.data)).catch(() => {})
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-2">Community</h1>
        <p className="text-gray-400 mb-8">Discover trips shared by other travelers</p>
        {trips.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-5xl mb-4">🌍</p>
            <p>No public trips yet. Be the first to share!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trips.map(trip => (
              <div key={trip.id} className="bg-gray-900 rounded-xl p-5 border border-gray-800 hover:border-amber-400 transition cursor-pointer"
                onClick={() => navigate(`/share/${trip.id}`)}>
                <h3 className="text-lg font-bold">{trip.name}</h3>
                <p className="text-gray-400 text-sm mt-1">by {trip.user?.firstName} {trip.user?.lastName}</p>
                <p className="text-gray-500 text-sm mt-2">{trip.stops?.length || 0} stops</p>
                <p className="text-gray-400 text-sm mt-2">{trip.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
