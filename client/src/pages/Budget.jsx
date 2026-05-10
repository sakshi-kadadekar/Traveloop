import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'
import API from '../api/axios'
import Navbar from '../components/Navbar'

const COLORS = ['#f59e0b', '#10b981', '#6366f1', '#ef4444']

export default function Budget() {
  const { id } = useParams()
  const [trip, setTrip] = useState(null)

  useEffect(() => {
    API.get(`/trips/${id}`).then(res => setTrip(res.data))
  }, [id])

  if (!trip) return <div className="text-white p-10">Loading...</div>

  const activities = trip.stops?.flatMap(s => s.activities || []) || []
  const total = activities.reduce((sum, a) => sum + (a.cost || 0), 0)

  const byType = activities.reduce((acc, a) => {
    acc[a.type || 'general'] = (acc[a.type || 'general'] || 0) + a.cost
    return acc
  }, {})

  const chartData = Object.entries(byType).map(([name, value]) => ({ name, value }))

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Budget — {trip.name}</h1>
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900 rounded-xl p-5 text-center">
            <p className="text-gray-400 text-sm">Total Spent</p>
            <p className="text-3xl font-bold text-amber-400">₹{total.toFixed(0)}</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-5 text-center">
            <p className="text-gray-400 text-sm">Activities</p>
            <p className="text-3xl font-bold">{activities.length}</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-5 text-center">
            <p className="text-gray-400 text-sm">Stops</p>
            <p className="text-3xl font-bold">{trip.stops?.length || 0}</p>
          </div>
        </div>
        {chartData.length > 0 && (
          <div className="bg-gray-900 rounded-xl p-6 flex justify-center">
            <PieChart width={400} height={300}>
              <Pie data={chartData} cx={200} cy={150} outerRadius={100} dataKey="value" label>
                {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        )}
      </div>
    </div>
  )
}