import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ActivitySearch from './pages/ActivitySearch'
import AdminPanel from './pages/AdminPanel'
import Budget from './pages/Budget'
import Community from './pages/Community'
import CreateTrip from './pages/CreateTrip'
import Dashboard from './pages/Dashboard'
import CitySearch from './pages/CitySearch'
import ItineraryBuilder from './pages/ItineraryBuilder'
import ItineraryView from './pages/ItineraryView'
import Login from './pages/Login'
import MyTrips from './pages/MyTrips'
import PackingChecklist from './pages/PackingChecklist'
import Profile from './pages/Profile'
import PublicTrip from './pages/PublicTrip'
import Register from './pages/Register'
import TripNotes from './pages/TripNotes'

const PrivateRoute = ({ children }) => {
  return localStorage.getItem('token') ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/trips" element={<PrivateRoute><MyTrips /></PrivateRoute>} />
        <Route path="/cities" element={<PrivateRoute><CitySearch /></PrivateRoute>} />
        <Route path="/trips/new" element={<PrivateRoute><CreateTrip /></PrivateRoute>} />
        <Route path="/trips/:id/build" element={<PrivateRoute><ItineraryBuilder /></PrivateRoute>} />
        <Route path="/trips/:id/view" element={<PrivateRoute><ItineraryView /></PrivateRoute>} />
        <Route path="/trips/:id/activities" element={<PrivateRoute><ActivitySearch /></PrivateRoute>} />
        <Route path="/trips/:id/budget" element={<PrivateRoute><Budget /></PrivateRoute>} />
        <Route path="/trips/:id/packing" element={<PrivateRoute><PackingChecklist /></PrivateRoute>} />
        <Route path="/trips/:id/notes" element={<PrivateRoute><TripNotes /></PrivateRoute>} />
        <Route path="/community" element={<PrivateRoute><Community /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/share/:id" element={<PublicTrip />} />
        <Route path="/admin" element={<PrivateRoute><AdminPanel /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
