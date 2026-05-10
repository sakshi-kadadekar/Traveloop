import { useState } from 'react'
import { useParams } from 'react-router-dom'
import API from '../api/axios'
import Navbar from '../components/Navbar'

const types = ['general', 'food', 'transport', 'stay']

export default function ActivitySearch() {
  const { id } = useParams()
  const [results, setResults] = useState([])
  const [query, setQuery] = useState('')
  const [form, setForm] = useState({ stopId: '', name: '', type: 'general', cost: '' })

  const searchActivities = async () => {
    if (!query.trim()) return
    const res = await API.get('/activities/search', { params: { q: query, tripId: id } })
    setResults(res.data)
  }

  const saveActivity = async () => {
    if (!form.stopId || !form.name.trim()) return
    const res = await API.post('/activities', {
      ...form,
      cost: Number.parseFloat(form.cost || 0),
    })
    setResults([res.data, ...results])
    setForm({ stopId: '', name: '', type: 'general', cost: '' })
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="mx-auto max-w-4xl p-6">
        <h1 className="mb-6 text-3xl font-bold">Activity Search</h1>

        <div className="mb-6 flex gap-2">
          <input
            className="flex-1 rounded-lg bg-gray-900 p-3 text-white outline-none"
            placeholder="Search activities"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button onClick={searchActivities} className="rounded-lg bg-amber-400 px-5 py-3 font-bold text-black">
            Search
          </button>
        </div>

        <div className="mb-8 rounded-xl bg-gray-900 p-5">
          <h2 className="mb-3 font-bold text-amber-400">Add Activity</h2>
          <div className="grid gap-3 md:grid-cols-4">
            <input
              className="rounded-lg bg-gray-800 p-3 outline-none"
              placeholder="Stop ID"
              value={form.stopId}
              onChange={e => setForm({ ...form, stopId: e.target.value })}
            />
            <input
              className="rounded-lg bg-gray-800 p-3 outline-none"
              placeholder="Activity name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
            <select
              className="rounded-lg bg-gray-800 p-3 outline-none"
              value={form.type}
              onChange={e => setForm({ ...form, type: e.target.value })}
            >
              {types.map(type => <option key={type}>{type}</option>)}
            </select>
            <input
              className="rounded-lg bg-gray-800 p-3 outline-none"
              placeholder="Cost"
              value={form.cost}
              onChange={e => setForm({ ...form, cost: e.target.value })}
            />
          </div>
          <button onClick={saveActivity} className="mt-3 rounded-lg bg-amber-400 px-5 py-2 font-bold text-black">
            Save
          </button>
        </div>

        <div className="space-y-3">
          {results.map(activity => (
            <div key={activity.id || activity.name} className="rounded-xl bg-gray-900 p-4">
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-bold">{activity.name}</h3>
                <span className="text-amber-400">₹{activity.cost || 0}</span>
              </div>
              <p className="text-sm capitalize text-gray-400">{activity.type || 'general'}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
