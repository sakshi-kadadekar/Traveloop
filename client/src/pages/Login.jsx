import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API from '../api/axios'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    try {
      const res = await API.post('/auth/login', form)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      navigate('/')
    } catch (err) {
      if (!err.response) {
        setError('Backend is not running on 127.0.0.1:5050. Start the backend, then try again.')
        return
      }

      setError(err.response.data?.message || 'Wrong email or password')
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-amber-400 mb-2">Traveloop</h1>
        <p className="text-gray-400 mb-6">Welcome back</p>
        <input type="email" className="w-full bg-gray-800 text-white p-3 rounded-lg mb-3 outline-none" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
        <input type="password" className="w-full bg-gray-800 text-white p-3 rounded-lg mb-3 outline-none" placeholder="Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
        {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
        <button type="submit" className="w-full bg-amber-400 text-black font-bold py-3 rounded-lg">Login</button>
        <p className="text-gray-400 text-center mt-4">No account? <Link to="/register" className="text-amber-400">Sign up</Link></p>
      </form>
    </div>
  )
}
