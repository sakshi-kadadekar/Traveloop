import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import API from '../api/axios'
import Navbar from '../components/Navbar'

export default function ItineraryBuilder() {
  const { id } = useParams()
  const [trip, setTrip] = useState(null)
  const [stops, setStops] = useState([])
  const [newStop, setNewStop] = useState({ city: '', country: '', startDate: '', endDate: '' })

  useEffect(() => {
    API.get(`/trips/${id}`).then(res => {
      setTrip(res.data)
      setStops(res.data.stops || [])
    })
  }, [id])

  const addStop = async () => {
    const res = await API.post('/stops', { ...newStop, tripId: id, orderIndex: stops.length })
    setStops([...stops, res.data])
    setNewStop({ city: '', country: '', startDate: '', endDate: '' })
  }

  const addActivity = async (stopId, name, cost) => {
    const res = await API.post('/activities', { stopId, name, cost: parseFloat(cost), type: 'general' })
    setStops(stops.map(s => s.id === stopId ? { ...s, activities: [...(s.activities||[]), res.data] } : s))
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">{trip?.name} — Build Itinerary</h1>

        {/* Add Stop */}
        <div className="bg-gray-900 p-5 rounded-xl mb-6">
          <h2 className="font-bold mb-3 text-amber-400">+ Add Stop</h2>
          <div className="grid grid-cols-2 gap-3">
            <input className="bg-gray-800 p-3 rounded-lg outline-none" placeholder="City" value={newStop.city} onChange={e => setNewStop({...newStop, city: e.target.value})} />
            <input className="bg-gray-800 p-3 rounded-lg outline-none" placeholder="Country" value={newStop.country} onChange={e => setNewStop({...newStop, country: e.target.value})} />
            <input type="date" className="bg-gray-800 p-3 rounded-lg outline-none" onChange={e => setNewStop({...newStop, startDate: e.target.value})} />
            <input type="date" className="bg-gray-800 p-3 rounded-lg outline-none" onChange={e => setNewStop({...newStop, endDate: e.target.value})} />
          </div>
          <button onClick={addStop} className="mt-3 bg-amber-400 text-black font-bold px-6 py-2 rounded-lg">Add Stop</button>
        </div>

        {/* Stops List */}
        {stops.map((stop, i) => (
          <StopCard key={stop.id} stop={stop} index={i} onAddActivity={addActivity} />
        ))}
      </div>
    </div>
  )
}

function StopCard({ stop, index, onAddActivity }) {
  const [actName, setActName] = useState('')
  const [actCost, setActCost] = useState('')

  return (
    <div className="bg-gray-900 rounded-xl p-5 mb-4">
      <h3 className="text-xl font-bold text-amber-400">Stop {index+1}: {stop.city}, {stop.country}</h3>
      <p className="text-gray-400 text-sm mb-4">{stop.startDate?.slice(0,10)} → {stop.endDate?.slice(0,10)}</p>
      <div className="space-y-2 mb-4">
        {(stop.activities||[]).map(a => (
          <div key={a.id} className="flex justify-between bg-gray-800 px-4 py-2 rounded-lg">
            <span>{a.name}</span>
            <span className="text-amber-400">₹{a.cost}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input className="bg-gray-800 p-2 rounded-lg outline-none flex-1" placeholder="Activity name" value={actName} onChange={e => setActName(e.target.value)} />
        <input className="bg-gray-800 p-2 rounded-lg outline-none w-24" placeholder="Cost" value={actCost} onChange={e => setActCost(e.target.value)} />
        <button onClick={() => { onAddActivity(stop.id, actName, actCost); setActName(''); setActCost('') }} className="bg-amber-400 text-black px-4 py-2 rounded-lg font-bold">Add</button>
      </div>
    </div>
  )
}