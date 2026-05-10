import { useEffect, useState } from 'react'
import API from '../api/axios'
import Navbar from '../components/Navbar'

export default function Profile() {
  const [form, setForm] = useState({})
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    API.get('/auth/me').then(res => setForm(res.data))
  }, [])

  const save = async () => {
    const res = await API.put('/auth/me', form)
    localStorage.setItem('user', JSON.stringify(res.data))
    setForm(res.data)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Profile</h1>
        <div className="bg-gray-900 rounded-xl p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-sm">First Name</label>
              <input className="w-full bg-gray-800 text-white p-3 rounded-lg mt-1"
                value={form.firstName || ''} onChange={e => setForm({...form, firstName: e.target.value})} />
            </div>
            <div>
              <label className="text-gray-400 text-sm">Last Name</label>
              <input className="w-full bg-gray-800 text-white p-3 rounded-lg mt-1"
                value={form.lastName || ''} onChange={e => setForm({...form, lastName: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="text-gray-400 text-sm">Username</label>
            <input className="w-full bg-gray-800 text-white p-3 rounded-lg mt-1"
              value={form.username || ''} onChange={e => setForm({...form, username: e.target.value})} />
          </div>
          <div>
            <label className="text-gray-400 text-sm">Email</label>
            <input className="w-full bg-gray-800 text-white p-3 rounded-lg mt-1"
              value={form.email || ''} onChange={e => setForm({...form, email: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-sm">City</label>
              <input className="w-full bg-gray-800 text-white p-3 rounded-lg mt-1"
                value={form.city || ''} onChange={e => setForm({...form, city: e.target.value})} />
            </div>
            <div>
              <label className="text-gray-400 text-sm">Country</label>
              <input className="w-full bg-gray-800 text-white p-3 rounded-lg mt-1"
                value={form.country || ''} onChange={e => setForm({...form, country: e.target.value})} />
            </div>
          </div>
          <button onClick={save} className="w-full bg-amber-400 text-black font-bold py-3 rounded-lg hover:bg-amber-300">
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
