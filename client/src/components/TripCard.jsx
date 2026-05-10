export default function TripCard({ trip }) {
  return (
    <div className="bg-gray-900 rounded-xl p-5">
      <h3 className="text-lg font-bold">{trip.name}</h3>
      <p className="text-gray-400 text-sm">{trip.status}</p>
    </div>
  )
}