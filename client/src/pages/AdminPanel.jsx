import Navbar from '../components/Navbar'

export default function AdminPanel() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
        <p>Admin controls.</p>
      </div>
    </div>
  )
}