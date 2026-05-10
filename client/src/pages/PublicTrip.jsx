import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '../api/axios'
import Navbar from '../components/Navbar'

export default function PublicTrip() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [trip, setTrip] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    API.get(`/trips/public/${id}`)
      .then(res => setTrip(res.data))
      .catch(() => setError('Trip not found or not public.'))
  }, [id])

  const copyTrip = async () => {
    if (!localStorage.getItem('token')) {
      alert('Please log in to copy trips.')
      navigate('/login')
      return
    }
    try {
      const res = await API.post(`/trips/${id}/copy`)
      alert('Trip copied successfully!')
      navigate(`/trips/${res.data.id}/build`)
    } catch (err) {
      alert('Failed to copy trip.')
    }
  }

  const shareTrip = () => {
    if (navigator.share) {
      navigator.share({
        title: trip?.name,
        text: `Check out this itinerary: ${trip?.name}`,
        url: window.location.href,
      }).catch(console.error)
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  if (error) return <div className="p-10 text-center text-red-500">{error}</div>
  if (!trip) return <div className="p-10 text-center text-white">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="mx-auto max-w-4xl p-6">
        {trip.coverPhoto && (
          <img src={trip.coverPhoto} alt="Cover" className="h-64 w-full rounded-xl object-cover mb-6" />
        )}
        
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold">{trip.name}</h1>
            <p className="text-gray-400 mt-2">Curated by @{trip.user?.username}</p>
            <p className="mt-4 text-lg">{trip.description}</p>
          </div>
          <div className="flex gap-3">
            <button onClick={shareTrip} className="rounded-lg bg-gray-800 px-4 py-2 font-bold hover:bg-gray-700">
              Share
            </button>
            <button onClick={copyTrip} className="rounded-lg bg-amber-400 px-4 py-2 font-bold text-black hover:bg-amber-500">
              Copy Trip
            </button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold text-amber-400">Timeline & Activities</h2>
            {trip.stops?.length === 0 && <p className="text-gray-500">No stops added to this trip yet.</p>}
            {trip.stops?.map((stop, i) => (
              <div key={stop.id} className="rounded-xl bg-gray-900 p-5">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white">
                    Day {i + 1}: {stop.cityName || stop.city?.name}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {new Date(stop.startDate).toLocaleDateString()} - {new Date(stop.endDate).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="space-y-3 pl-4 border-l-2 border-gray-700">
                  {stop.activities?.map(act => (
                    <div key={act.id} className="rounded-lg bg-gray-800 p-3">
                      <div className="flex justify-between font-bold">
                        <span>{act.name}</span>
                        <span className="text-amber-400">₹{act.cost}</span>
                      </div>
                      <p className="text-sm text-gray-400">{act.description || act.type}</p>
                    </div>
                  ))}
                  {(!stop.activities || stop.activities.length === 0) && (
                    <p className="text-gray-500 italic">No activities planned.</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div>
            <h2 className="mb-4 text-2xl font-bold text-amber-400">Budget Estimate</h2>
            <div className="rounded-xl bg-gray-900 p-5 space-y-3">
              {trip.budget ? (
                <>
                  <div className="flex justify-between"><span>Transport:</span> <span>₹{trip.budget.transport}</span></div>
                  <div className="flex justify-between"><span>Stay:</span> <span>₹{trip.budget.stay}</span></div>
                  <div className="flex justify-between"><span>Meals:</span> <span>₹{trip.budget.meals}</span></div>
                  <div className="flex justify-between"><span>Activities:</span> <span>₹{trip.budget.activities}</span></div>
                  <div className="mt-4 border-t border-gray-700 pt-4 flex justify-between font-bold text-xl text-amber-400">
                    <span>Total:</span> <span>₹{trip.budget.total}</span>
                  </div>
                </>
              ) : (
                <p className="text-gray-500">No budget data available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}