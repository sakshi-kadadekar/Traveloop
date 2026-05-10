import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/axios'
import Navbar from '../components/Navbar'

export default function CreateTrip() {
  const [form, setForm] = useState({ name: '', description: '', isPublic: false })
  const navigate = useNavigate()

  const handleSubmit = async () => {
    const res = await API.post('/trips', form)
    navigate(`/trips/${res.data.id}/build`)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Create New Trip</h1>
        <input className="w-full bg-gray-900 text-white p-3 rounded-lg mb-4 outline-none" placeholder="Trip Name" onChange={e => setForm({...form, name: e.target.value})} />
        <textarea className="w-full bg-gray-900 text-white p-3 rounded-lg mb-4 outline-none h-28" placeholder="Description" onChange={e => setForm({...form, description: e.target.value})} />
        <label className="flex items-center gap-3 text-gray-300 mb-6">
          <input type="checkbox" onChange={e => setForm({...form, isPublic: e.target.checked})} />
          Make this trip public (shareable)
        </label>
        <button onClick={handleSubmit} className="w-full bg-amber-400 text-black font-bold py-3 rounded-xl">Create & Build Itinerary →</button>
      </div>
    </div>
  )
}