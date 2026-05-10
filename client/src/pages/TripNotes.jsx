import Navbar from '../components/Navbar'

export default function TripNotes() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Trip Notes</h1>
        <p>Add notes for your trip.</p>
      </div>
    </div>
  )
}