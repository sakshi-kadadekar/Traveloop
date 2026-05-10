import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import API from '../api/axios'

export default function Register() {
  const [form, setForm] = useState({})
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    try {
      const res = await API.post('/auth/register', form)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      navigate('/')
    } catch (err) {
      if (!err.response) {
        setError('Backend is not running on 127.0.0.1:5050. Start the backend, then try again.')
        return
      }

      setError(err.response.data?.message || 'Account already exists. Please login instead.')
    }
  }

  const field = (placeholder, key, type='text') => (
    <input type={type} className="w-full bg-gray-800 text-white p-3 rounded-lg mb-3 outline-none" placeholder={placeholder} value={form[key] || ''} onChange={e => setForm({...form, [key]: e.target.value})} />
  )

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-amber-400 mb-6">Create Account</h1>
        <div className="flex gap-3">
          {field('First Name', 'firstName')}
          {field('Last Name', 'lastName')}
        </div>
        {field('Username', 'username')}
        {field('Email', 'email', 'email')}
        {field('Phone', 'phone')}
        {field('Password', 'password', 'password')}
        {field('City', 'city')}
        {field('Country', 'country')}
        {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
        <button type="submit" className="w-full bg-amber-400 text-black font-bold py-3 rounded-lg">Register</button>
        <p className="text-gray-400 text-center mt-4">Already have account? <Link to="/login" className="text-amber-400">Login</Link></p>
      </form>
    </div>
  )
}
