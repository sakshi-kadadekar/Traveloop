import { useNavigate, Link } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const logout = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-amber-400 font-bold text-xl">Traveloop</Link>
      <div className="flex gap-4 text-gray-300 text-sm">
        <Link to="/" className="hover:text-white">Home</Link>
        <Link to="/trips" className="hover:text-white">My Trips</Link>
        <Link to="/community" className="hover:text-white">Community</Link>
        <Link to="/profile" className="hover:text-white">Profile</Link>
        <button onClick={logout} className="text-red-400 hover:text-red-300">Logout</button>
      </div>
    </nav>
  )
}