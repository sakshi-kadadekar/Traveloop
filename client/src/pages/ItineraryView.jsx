import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CircleDollarSign, Edit3, Landmark, Link as LinkIcon, Map, MapPin, Mountain, Utensils } from 'lucide-react'
import API from '../api/axios'
import Navbar from '../components/Navbar'

const statusClass = {
  ongoing: 'bg-green-900 text-green-400',
  completed: 'bg-gray-700 text-gray-300',
  upcoming: 'bg-amber-900 text-amber-400',
}

const activityIcon = {
  food: Utensils,
  adventure: Mountain,
  sightseeing: Landmark,
}

export default function ItineraryView() {
  const { id } = useParams()
  const [trip, setTrip] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    API.get(`/trips/${id}`).then(res => setTrip(res.data))
  }, [id])

  if (!trip) return <div className="bg-gray-950 p-10 text-white">Loading...</div>

  const activities = trip.stops?.flatMap(stop => stop.activities || []) || []
  const totalCost = activities.reduce((sum, activity) => sum + (activity.cost || 0), 0)
  const shareUrl = `${window.location.origin}/share/${trip.id}`

  const copyShareLink = async () => {
    await navigator.clipboard.writeText(shareUrl)
    alert('Copied!')
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="mx-auto max-w-4xl p-6">
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{trip.name}</h1>
            <p className="mt-1 text-gray-400">{trip.description}</p>
            <span className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-bold uppercase ${statusClass[trip.status] || statusClass.upcoming}`}>
              {trip.status}
            </span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => navigate(`/trips/${id}/build`)}
              className="inline-flex items-center gap-2 rounded-lg bg-gray-800 px-4 py-2 text-sm hover:bg-gray-700">
              <Edit3 size={16} />
              Edit
            </button>
            <button onClick={() => navigate(`/trips/${id}/budget`)}
              className="inline-flex items-center gap-2 rounded-lg bg-amber-400 px-4 py-2 text-sm font-bold text-black">
              <CircleDollarSign size={16} />
              Budget
            </button>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-3 gap-4">
          <StatCard label="Stops" value={trip.stops?.length || 0} />
          <StatCard label="Activities" value={activities.length} />
          <StatCard label="Total Cost" value={`₹${totalCost}`} />
        </div>

        {trip.stops?.length === 0 && (
          <div className="py-16 text-center text-gray-500">
            <Map className="mx-auto mb-3" size={40} />
            <p>No stops yet. <button className="text-amber-400" onClick={() => navigate(`/trips/${id}/build`)}>Add some!</button></p>
          </div>
        )}

        <div className="space-y-6">
          {trip.stops?.map((stop, index) => (
            <div key={stop.id} className="relative">
              {index < trip.stops.length - 1 && (
                <div className="absolute bottom-0 left-6 top-16 z-0 w-0.5 bg-gray-700" />
              )}
              <div className="relative z-10 rounded-xl border border-gray-800 bg-gray-900 p-5">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-amber-400 text-sm font-bold text-black">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{stop.city}{stop.country ? `, ${stop.country}` : ''}</h3>
                    <p className="text-sm text-gray-400">
                      {stop.startDate?.slice(0, 10)} to {stop.endDate?.slice(0, 10)}
                    </p>
                  </div>
                </div>

                {stop.activities?.length > 0 ? (
                  <div className="ml-[52px] mt-4 space-y-2">
                    {stop.activities.map(activity => (
                      <ActivityRow key={activity.id} activity={activity} />
                    ))}
                    <div className="mt-2 flex justify-end">
                      <p className="text-sm text-gray-400">
                        Stop total: <span className="font-bold text-amber-400">
                          ₹{stop.activities.reduce((sum, activity) => sum + (activity.cost || 0), 0)}
                        </span>
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="ml-[52px] mt-2 text-sm text-gray-600">No activities added</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {trip.isPublic && (
          <div className="mt-8 flex items-center justify-between gap-4 rounded-xl bg-gray-900 p-4">
            <div>
              <p className="flex items-center gap-2 font-medium"><LinkIcon size={16} /> Public Share Link</p>
              <p className="text-sm text-gray-400">{shareUrl}</p>
            </div>
            <button onClick={copyShareLink}
              className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-bold text-black">
              Copy Link
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-xl bg-gray-900 p-4 text-center">
      <p className="text-2xl font-bold text-amber-400">{value}</p>
      <p className="mt-1 text-sm text-gray-400">{label}</p>
    </div>
  )
}

function ActivityRow({ activity }) {
  const Icon = activityIcon[activity.type] || MapPin

  return (
    <div className="flex items-center justify-between rounded-lg bg-gray-800 px-4 py-3">
      <div className="flex items-center gap-2">
        <Icon className="text-gray-400" size={18} />
        <div>
          <p className="font-medium">{activity.name}</p>
          {activity.type && <p className="text-xs capitalize text-gray-500">{activity.type}</p>}
        </div>
      </div>
      <span className="font-bold text-amber-400">₹{activity.cost || 0}</span>
    </div>
  )
}
