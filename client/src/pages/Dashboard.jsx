import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/axios'
import Navbar from '../components/Navbar'

export default function Dashboard() {
  const [trips, setTrips] = useState([])
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  useEffect(() => {
    API.get('/trips').then(res => setTrips(res.data))
  }, [])

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-1">Hey, {user.firstName} 👋</h1>
        <p className="text-gray-400 mb-8">Ready to plan your next adventure?</p>
        <button onClick={() => navigate('/trips/new')} className="bg-amber-400 text-black font-bold px-6 py-3 rounded-xl mb-8">+ Plan New Trip</button>
        <h2 className="text-xl font-semibold mb-4">Recent Trips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {trips.slice(0,4).map(trip => (
            <div key={trip.id} onClick={() => navigate(`/trips/${trip.id}/view`)} className="bg-gray-900 rounded-xl p-5 cursor-pointer hover:bg-gray-800 transition">
              <h3 className="text-lg font-bold">{trip.name}</h3>
              <p className="text-gray-400 text-sm">{trip.status}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}