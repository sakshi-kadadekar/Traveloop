import { useState, useEffect } from 'react'
import API from '../api/axios'
import Navbar from '../components/Navbar'

export default function AdminPanel() {
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])

  useEffect(() => {
    API.get('/admin/stats').then(res => setStats(res.data))
    API.get('/admin/users').then(res => setUsers(res.data))
  }, [])

  const deleteUser = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    await API.delete(`/admin/users/${id}`)
    setUsers(users.filter(u => u.id !== id))
  }

  if (!stats) return <div className="p-10 text-white text-center">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        {/* Analytics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900 p-5 rounded-xl border border-gray-800 text-center">
            <h3 className="text-gray-400 mb-1">Total Users</h3>
            <p className="text-4xl font-bold text-amber-400">{stats.totalUsers}</p>
          </div>
          <div className="bg-gray-900 p-5 rounded-xl border border-gray-800 text-center">
            <h3 className="text-gray-400 mb-1">Total Trips</h3>
            <p className="text-4xl font-bold text-amber-400">{stats.totalTrips}</p>
          </div>
          <div className="bg-gray-900 p-5 rounded-xl border border-gray-800 text-center">
            <h3 className="text-gray-400 mb-1">Top City</h3>
            <p className="text-2xl font-bold text-white truncate">
              {stats.topCities?.[0]?.cityName || 'N/A'}
            </p>
          </div>
          <div className="bg-gray-900 p-5 rounded-xl border border-gray-800 text-center">
            <h3 className="text-gray-400 mb-1">Top Activity</h3>
            <p className="text-2xl font-bold text-white capitalize truncate">
              {stats.topActivities?.[0]?.type || 'N/A'}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Charts */}
          <div className="bg-gray-900 p-5 rounded-xl">
            <h2 className="text-xl font-bold mb-4">Popular Cities</h2>
            <div className="space-y-4">
              {stats.topCities?.map(city => (
                <div key={city.cityName}>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>{city.cityName || 'Unknown'}</span>
                    <span>{city._count.cityName} visits</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div className="bg-amber-400 h-2 rounded-full" style={{ width: `${Math.min((city._count.cityName / Math.max(1, stats.totalTrips)) * 100, 100)}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 p-5 rounded-xl">
            <h2 className="text-xl font-bold mb-4">Popular Activities</h2>
            <div className="space-y-4">
              {stats.topActivities?.map(act => (
                <div key={act.type}>
                  <div className="flex justify-between mb-1 text-sm capitalize">
                    <span>{act.type || 'general'}</span>
                    <span>{act._count.type} booked</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div className="bg-blue-400 h-2 rounded-full" style={{ width: `${Math.min((act._count.type / Math.max(1, 10)) * 100, 100)}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* User Management Table */}
        <div className="bg-gray-900 rounded-xl overflow-hidden">
          <div className="p-5 border-b border-gray-800">
            <h2 className="text-xl font-bold">User Management</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-800 text-gray-400">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Trips</th>
                  <th className="p-4">Joined</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold">{user.firstName} {user.lastName}</div>
                      <div className="text-sm text-gray-400">@{user.username}</div>
                    </td>
                    <td className="p-4 text-gray-300">{user.email}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${user.role === 'admin' ? 'bg-red-500/20 text-red-400' : 'bg-gray-700 text-gray-300'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4">{user.trips?.length || 0}</td>
                    <td className="p-4 text-sm text-gray-400">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      {user.role !== 'admin' && (
                        <button onClick={() => deleteUser(user.id)} className="text-red-400 hover:text-red-300 font-bold text-sm">
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}