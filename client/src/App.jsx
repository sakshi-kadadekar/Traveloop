import { useMemo, useState } from 'react'

const COLORS = {
  bg: '#0a0e1a',
  card: '#111827',
  panel: '#0f1624',
  input: '#1a2332',
  border: '#1e2a3a',
  accent: '#f59e0b',
  purple: '#7c3aed',
  text: '#f1f5f9',
  muted: '#64748b',
  green: '#10b981',
  red: '#ef4444',
  blue: '#3b82f6',
}

const MOCK_TRIPS = [
  { id: 1, name: 'Europe Adventure', dates: 'May 28 - Jun 09, 2025', cities: 4, status: 'completed', emoji: '🗼', budget: 20000, spent: 22000 },
  { id: 2, name: 'Paris & Rome Adventure', dates: 'Jun 14 - Jun 28, 2025', cities: 2, status: 'upcoming', emoji: '🍕', budget: 15000, spent: 8000 },
  { id: 3, name: 'Tokyo Discovery', dates: 'Jul 10 - Jul 20, 2025', cities: 1, status: 'ongoing', emoji: '🗾', budget: 18000, spent: 6000 },
]

const ACTIVITIES = [
  { name: 'Eiffel Tower Visit', city: 'Paris', cost: 1200, type: 'Sightseeing', duration: '3h' },
  { name: 'Louvre Museum', city: 'Paris', cost: 800, type: 'Culture', duration: '4h' },
  { name: 'Colosseum Tour', city: 'Rome', cost: 1500, type: 'Sightseeing', duration: '2h' },
  { name: 'Vatican Museums', city: 'Rome', cost: 1200, type: 'Culture', duration: '3h' },
  { name: 'Sushi Making Class', city: 'Tokyo', cost: 2500, type: 'Food', duration: '2h' },
  { name: 'Sagrada Familia', city: 'Barcelona', cost: 1800, type: 'Sightseeing', duration: '2h' },
]

const PACKING_CATEGORIES = [
  { name: 'Documents', items: ['Passport', 'Flight Tickets (printed)', 'Travel Insurance', 'Hotel booking confirmation'], checked: [0, 2] },
  { name: 'Clothing', items: ['Casual Shirts', 'Trousers / jeans', 'Comfortable walking shoes', 'Light jacket / windbreaker'], checked: [0] },
  { name: 'Electronics', items: ['Phone charger', 'Universal power adapter', 'Earphones / headphones'], checked: [0] },
]

const MOCK_NOTES = [
  { id: 1, title: 'Hotel check-in details - Rome stop', body: 'Check in after 2pm, room 302, breakfast included (7-10am)', day: 'Day 3: June 14 2025' },
  { id: 2, title: 'Flight reminder - Paris layover', body: 'Terminal 2E, gate closes 45 min before departure', day: 'Day 1: June 14 2025' },
  { id: 3, title: 'Local SIM card', body: 'Buy at airport kiosk - Orange or Free Mobile', day: 'Day 1: June 14 2025' },
]

const COMMUNITY_POSTS = [
  { user: 'Alex M.', avatar: '🧳', trip: 'Southeast Asia in 30 Days', likes: 142, desc: 'Budget tips, hidden beaches and street food gems across Thailand, Vietnam & Cambodia.' },
  { user: 'Sara K.', avatar: '✈️', trip: 'Eurotrip on €50/day', likes: 98, desc: "Yes it's possible. Here's my full itinerary hitting 8 countries in 3 weeks." },
  { user: 'Rohan D.', avatar: '🏔️', trip: 'Himalayan Trek Diary', likes: 211, desc: "Manali to Spiti Valley - the most breathtaking roads I've ever driven." },
  { user: 'Priya N.', avatar: '🏖️', trip: 'Maldives Honeymoon', likes: 87, desc: 'Overwater bungalows, snorkelling, and the best sunsets of my life.' },
]

const screens = [
  ['home', 'Home'],
  ['create-trip', 'Create Trip'],
  ['trips', 'My Trips'],
  ['itinerary-builder', 'Builder'],
  ['itinerary-view', 'Itinerary'],
  ['activity-search', 'Search'],
  ['profile', 'Profile'],
  ['packing', 'Packing'],
  ['community', 'Community'],
  ['notes', 'Notes'],
  ['budget', 'Budget'],
  ['admin', 'Admin'],
]

const page = {
  minHeight: '100vh',
  background: COLORS.bg,
  color: COLORS.text,
  fontFamily: "'Sora', 'Segoe UI', sans-serif",
}

const card = {
  background: COLORS.card,
  border: `1px solid ${COLORS.border}`,
  borderRadius: 14,
  padding: '1.35rem',
}

const input = {
  width: '100%',
  padding: '0.72rem 0.9rem',
  borderRadius: 10,
  border: `1px solid ${COLORS.border}`,
  background: COLORS.input,
  color: COLORS.text,
  outline: 'none',
}

const button = (variant = 'primary') => ({
  padding: '0.65rem 1rem',
  borderRadius: 10,
  border: variant === 'ghost' ? `1px solid ${COLORS.border}` : 0,
  background: variant === 'primary' ? COLORS.accent : variant === 'danger' ? COLORS.red : 'transparent',
  color: variant === 'primary' ? '#000' : variant === 'danger' ? '#fff' : COLORS.muted,
  fontWeight: 800,
  fontSize: '0.85rem',
  cursor: 'pointer',
})

const title = {
  fontSize: '1.55rem',
  fontWeight: 900,
  margin: '0 0 0.25rem',
}

const subtitle = {
  color: COLORS.muted,
  margin: '0 0 1.5rem',
  fontSize: '0.9rem',
}

const grid = (min = 260) => ({
  display: 'grid',
  gridTemplateColumns: `repeat(auto-fit, minmax(${min}px, 1fr))`,
  gap: '1rem',
})

const badge = (color) => ({
  display: 'inline-flex',
  padding: '0.22rem 0.62rem',
  borderRadius: 999,
  border: `1px solid ${color}44`,
  background: `${color}22`,
  color,
  fontSize: '0.72rem',
  fontWeight: 800,
  textTransform: 'capitalize',
})

function Screen({ children, kicker, heading }) {
  return (
    <>
      <h1 style={title}>{heading}</h1>
      {kicker && <p style={subtitle}>{kicker}</p>}
      {children}
    </>
  )
}

function SearchRow({ placeholder, extra = ['Group by', 'Filter', 'Sort by'] }) {
  return (
    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
      <input style={{ ...input, flex: '1 1 260px' }} placeholder={placeholder} />
      {extra.map((label) => <button key={label} style={button('ghost')}>{label}</button>)}
    </div>
  )
}

function TripThumb({ trip, onClick }) {
  const statusColor = { ongoing: COLORS.green, upcoming: COLORS.blue, completed: COLORS.muted }[trip.status]
  return (
    <div onClick={onClick} style={{ ...card, padding: 0, overflow: 'hidden', cursor: 'pointer' }}>
      <div style={{ height: 125, background: `linear-gradient(135deg, #1e3a5f, ${COLORS.purple})`, display: 'grid', placeItems: 'center', fontSize: '2.4rem' }}>{trip.emoji}</div>
      <div style={{ padding: '0.9rem' }}>
        <div style={{ fontWeight: 800, marginBottom: '0.25rem' }}>{trip.name}</div>
        <div style={{ color: COLORS.muted, fontSize: '0.78rem', marginBottom: '0.55rem' }}>{trip.dates}</div>
        <span style={badge(statusColor)}>{trip.status}</span>
      </div>
    </div>
  )
}

function LoginScreen({ go }) {
  const [tab, setTab] = useState('login')

  return (
    <div style={{ minHeight: 'calc(100vh - 61px)', display: 'grid', placeItems: 'center', padding: '2rem' }}>
      <div style={{ ...card, width: 'min(420px, 100%)', textAlign: 'center' }}>
        <div style={{ fontSize: '2.7rem' }}>✈️</div>
        <div style={{ color: COLORS.accent, fontSize: '1.7rem', fontWeight: 900 }}>Traveloop</div>
        <p style={{ ...subtitle, marginTop: '0.3rem' }}>Plan your journey, loop the world.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: COLORS.panel, borderRadius: 10, padding: 3, marginBottom: '1.3rem' }}>
          {['login', 'signup'].map((item) => (
            <button key={item} onClick={() => setTab(item)} style={{ ...button(tab === item ? 'primary' : 'ghost'), border: 0 }}>
              {item === 'login' ? 'Login' : 'Sign Up'}
            </button>
          ))}
        </div>
        {tab === 'signup' && <div style={grid(150)}><input style={input} placeholder="First Name" /><input style={input} placeholder="Last Name" /></div>}
        <div style={{ display: 'grid', gap: '0.75rem', marginTop: '0.75rem' }}>
          <input style={input} placeholder="Email Address" type="email" />
          {tab === 'signup' && <input style={input} placeholder="Phone Number" />}
          <input style={input} placeholder="Password" type="password" />
          {tab === 'signup' && <><input style={input} placeholder="City" /><input style={input} placeholder="Country" /><textarea style={{ ...input, minHeight: 82, resize: 'vertical' }} placeholder="Additional Information..." /></>}
          <button style={{ ...button('primary'), width: '100%', padding: '0.85rem' }} onClick={() => go('home')}>{tab === 'login' ? 'Login' : 'Register'}</button>
        </div>
      </div>
    </div>
  )
}

function HomeScreen({ go }) {
  return (
    <Screen heading="Welcome back, James 👋" kicker="Where are you heading next?">
      <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '-3.3rem 0 1.3rem' }}>
        <button style={button()} onClick={() => go('create-trip')}>+ Plan a Trip</button>
      </div>
      <section style={{ borderRadius: 16, padding: '2.5rem 2rem', marginBottom: '2rem', background: `linear-gradient(135deg, #1e3a5f 0%, ${COLORS.purple} 58%, ${COLORS.accent} 100%)`, position: 'relative', overflow: 'hidden' }}>
        <div style={{ opacity: 0.74, fontWeight: 800, fontSize: '0.78rem', letterSpacing: 1, textTransform: 'uppercase' }}>Featured Destination</div>
        <div style={{ fontSize: '2rem', fontWeight: 900, marginTop: '0.4rem' }}>Explore Europe 🗺️</div>
        <p style={{ color: 'rgba(255,255,255,0.75)' }}>Multi-city adventures across 6 countries</p>
        <button style={button()} onClick={() => go('activity-search')}>Discover Places</button>
        <div style={{ position: 'absolute', right: 28, top: 15, fontSize: '6.5rem', opacity: 0.16 }}>🌍</div>
      </section>
      <SearchRow placeholder="Search trips, cities, activities..." />
      <h2 style={{ fontSize: '1rem', marginBottom: '0.8rem' }}>🌐 Top Regional Selections</h2>
      <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '1.5rem' }}>
        {['🗼 Paris', '🍕 Rome', '🗾 Tokyo', '🏖️ Bali', '🏰 Prague'].map((city) => (
          <button key={city} onClick={() => go('activity-search')} style={{ ...card, minWidth: 120, height: 92, fontWeight: 800 }}>{city}</button>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
        <h2 style={{ fontSize: '1rem' }}>🧳 My Trips</h2>
        <button style={button('ghost')} onClick={() => go('trips')}>View All</button>
      </div>
      <div style={grid()}>{MOCK_TRIPS.map((trip) => <TripThumb key={trip.id} trip={trip} onClick={() => go('trips')} />)}</div>
    </Screen>
  )
}

function CreateTripScreen({ go }) {
  return (
    <Screen heading="Plan a New Trip ✈️" kicker="Fill in the details to start your adventure">
      <div style={{ ...card, maxWidth: 760 }}>
        <div style={{ display: 'grid', gap: '0.85rem' }}>
          <input style={input} placeholder="Trip Name, e.g. Europe Summer 2025" />
          <div style={grid(220)}><input style={input} type="date" /><input style={input} type="date" /></div>
          <input style={input} placeholder="Search destination city..." />
          <textarea style={{ ...input, minHeight: 105 }} placeholder="What's this trip about?" />
        </div>
        <hr style={{ borderColor: COLORS.border, margin: '1.4rem 0' }} />
        <h2 style={{ fontSize: '1rem', marginBottom: '1rem' }}>🌟 Suggested Places & Activities</h2>
        <div style={grid(170)}>{ACTIVITIES.map((activity) => <ActivityMini key={activity.name} activity={activity} />)}</div>
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.4rem', flexWrap: 'wrap' }}>
          <button style={button()} onClick={() => go('itinerary-builder')}>Save & Build Itinerary</button>
          <button style={button('ghost')} onClick={() => go('home')}>Cancel</button>
        </div>
      </div>
    </Screen>
  )
}

function ActivityMini({ activity }) {
  const icon = activity.type === 'Food' ? '🍜' : activity.type === 'Culture' ? '🏛️' : '📸'
  return (
    <div style={{ ...card, padding: '0.85rem' }}>
      <div style={{ fontSize: '1.6rem' }}>{icon}</div>
      <div style={{ fontWeight: 800, fontSize: '0.86rem', marginTop: '0.45rem' }}>{activity.name}</div>
      <div style={{ color: COLORS.muted, fontSize: '0.75rem' }}>{activity.city} · {activity.duration}</div>
      <div style={{ color: COLORS.accent, fontWeight: 800, fontSize: '0.82rem', marginTop: '0.35rem' }}>₹{activity.cost.toLocaleString()}</div>
    </div>
  )
}

function TripsScreen({ go }) {
  const statusColor = { ongoing: COLORS.green, upcoming: COLORS.blue, completed: COLORS.muted }
  return (
    <Screen heading="My Trips 🧳" kicker="Ongoing, upcoming & completed journeys">
      <SearchRow placeholder="Search trips..." />
      {['ongoing', 'upcoming', 'completed'].map((status) => (
        <section key={status} style={{ marginBottom: '1.35rem' }}>
          <h2 style={{ color: statusColor[status], textTransform: 'capitalize', fontSize: '1rem' }}>{status}</h2>
          {MOCK_TRIPS.filter((trip) => trip.status === status).map((trip) => (
            <div key={trip.id} style={{ ...card, display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{ width: 62, height: 62, borderRadius: 12, display: 'grid', placeItems: 'center', background: `linear-gradient(135deg, #1e3a5f, ${COLORS.purple})`, fontSize: '2.1rem' }}>{trip.emoji}</div>
              <div style={{ flex: '1 1 250px' }}><strong>{trip.name}</strong><div style={{ color: COLORS.muted, fontSize: '0.8rem' }}>{trip.dates} · {trip.cities} cities</div></div>
              <span style={badge(statusColor[status])}>{status}</span>
              <strong style={{ color: trip.spent > trip.budget ? COLORS.red : COLORS.green }}>₹{trip.budget.toLocaleString()}</strong>
              <button style={button('ghost')} onClick={() => go('itinerary-view')}>View</button>
              <button style={button('ghost')} onClick={() => go('itinerary-builder')}>Edit</button>
            </div>
          ))}
        </section>
      ))}
    </Screen>
  )
}

function ItineraryBuilderScreen({ go }) {
  const [sections, setSections] = useState([
    { id: 1, title: 'Section 1', desc: 'Travel section - Flight DBL to PAR', dateRange: 'May 28 - May 29', budget: 12000 },
    { id: 2, title: 'Section 2', desc: 'Hotel stay in Paris - 3 nights', dateRange: 'May 29 - Jun 01', budget: 9000 },
    { id: 3, title: 'Section 3', desc: 'Day tours & activities in Paris', dateRange: 'Jun 01 - Jun 03', budget: 3500 },
  ])

  return (
    <Screen heading="Build Itinerary 🗓️" kicker="Paris & Rome Adventure · Jun 14 - Jun 28, 2025">
      <div style={{ maxWidth: 820 }}>
        {sections.map((section, index) => (
          <div key={section.id} style={{ ...card, marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
              <strong style={{ color: COLORS.accent }}>{section.title}</strong>
              <button style={button('danger')} onClick={() => setSections(sections.filter((_, i) => i !== index))}>Remove</button>
            </div>
            <p style={{ color: COLORS.muted }}>{section.desc}</p>
            <div style={grid(220)}><input style={input} defaultValue={section.dateRange} /><input style={input} type="number" defaultValue={section.budget} /></div>
          </div>
        ))}
        <button style={{ ...button('ghost'), width: '100%', borderStyle: 'dashed', marginBottom: '1.3rem' }} onClick={() => setSections([...sections, { id: Date.now(), title: `Section ${sections.length + 1}`, desc: 'Add details for this section', dateRange: '', budget: 0 }])}>+ Add another Section</button>
        <button style={button()} onClick={() => go('itinerary-view')}>Save & View Itinerary</button>
      </div>
    </Screen>
  )
}

function ItineraryViewScreen({ go }) {
  return (
    <Screen heading="Europe Adventure 🗺️" kicker="May 28 - Jun 09, 2025 · 4 cities · James & crew">
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <button style={button('ghost')} onClick={() => go('itinerary-builder')}>Edit</button>
        <button style={button()} onClick={() => go('budget')}>View Budget</button>
      </div>
      {['Day 1 - Paris', 'Day 2 - Paris', 'Day 3 - Rome', 'Day 4 - Rome', 'Day 5 - Barcelona'].map((day, index) => (
        <div key={day} style={{ ...card, marginBottom: '1rem' }}>
          <strong style={{ color: COLORS.accent }}>{day}</strong>
          <div style={{ display: 'grid', gap: '0.65rem', marginTop: '0.8rem' }}>
            {ACTIVITIES.slice(index % 3, (index % 3) + 2).map((activity) => <ActivityLine key={activity.name} activity={activity} />)}
          </div>
        </div>
      ))}
    </Screen>
  )
}

function ActivitySearchScreen() {
  const [query, setQuery] = useState('')
  const filtered = useMemo(() => ACTIVITIES.filter((activity) => {
    const search = query.toLowerCase()
    return !query || activity.name.toLowerCase().includes(search) || activity.city.toLowerCase().includes(search)
  }), [query])

  return (
    <Screen heading="Activity & City Search 🔍" kicker="Find places and things to do on your trip">
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <input style={{ ...input, flex: '1 1 280px' }} placeholder="Search cities or activities..." value={query} onChange={(event) => setQuery(event.target.value)} />
        <button style={button('ghost')}>Filter</button>
        <button style={button('ghost')}>Sort by</button>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {['All', 'Sightseeing', 'Culture', 'Food', 'Adventure'].map((item) => <button key={item} style={button('ghost')}>{item}</button>)}
      </div>
      <div style={{ display: 'grid', gap: '0.8rem' }}>{filtered.map((activity) => <ActivityLine key={activity.name} activity={activity} action />)}</div>
    </Screen>
  )
}

function ActivityLine({ activity, action }) {
  const icon = activity.type === 'Food' ? '🍜' : activity.type === 'Culture' ? '🏛️' : '📸'
  return (
    <div style={{ ...card, display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.8rem', flexWrap: 'wrap' }}>
      <div style={{ width: 52, height: 52, borderRadius: 12, display: 'grid', placeItems: 'center', background: `linear-gradient(135deg, #1e3a5f, ${COLORS.purple})`, fontSize: '1.35rem' }}>{icon}</div>
      <div style={{ flex: '1 1 220px' }}><strong>{activity.name}</strong><div style={{ color: COLORS.muted, fontSize: '0.8rem' }}>{activity.city} · {activity.type} · {activity.duration}</div></div>
      <strong style={{ color: COLORS.accent }}>₹{activity.cost.toLocaleString()}</strong>
      {action && <button style={button()}>+ Add to Trip</button>}
    </div>
  )
}

function ProfileScreen() {
  return (
    <Screen heading="User Profile 👤" kicker="Manage your account and travel preferences">
      <div style={{ ...card, maxWidth: 820 }}>
        <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center', marginBottom: '1.4rem' }}>
          <div style={{ width: 82, height: 82, borderRadius: '50%', display: 'grid', placeItems: 'center', background: `linear-gradient(135deg, ${COLORS.purple}, ${COLORS.accent})`, fontSize: '2rem' }}>👤</div>
          <div><strong style={{ fontSize: '1.2rem' }}>James Arjun Jerry Cristina</strong><div style={{ color: COLORS.muted }}>james@traveloop.app</div></div>
        </div>
        <div style={grid(240)}>
          {['First Name', 'Last Name', 'Email', 'Phone', 'City', 'Country'].map((field) => <input key={field} style={input} defaultValue={field === 'Email' ? 'james@traveloop.app' : field === 'Phone' ? '+91 98765 43210' : field === 'Country' ? 'India' : field === 'City' ? 'Delhi' : field.replace(' Name', '')} />)}
        </div>
        <button style={{ ...button(), marginTop: '1rem' }}>Save Changes</button>
      </div>
      <div style={grid(180)}>{[['3', 'Trips Created', COLORS.accent], ['7', 'Cities Visited', COLORS.green], ['12', 'Activities Done', COLORS.blue]].map(([num, label, color]) => <div key={label} style={{ ...card, textAlign: 'center' }}><div style={{ color, fontSize: '2rem', fontWeight: 900 }}>{num}</div><div style={{ color: COLORS.muted }}>{label}</div></div>)}</div>
    </Screen>
  )
}

function PackingScreen() {
  const [categories, setCategories] = useState(PACKING_CATEGORIES.map((category) => ({ ...category, items: [...category.items], checked: [...category.checked] })))
  const [newItem, setNewItem] = useState('')
  const total = categories.reduce((sum, category) => sum + category.items.length, 0)
  const packed = categories.reduce((sum, category) => sum + category.checked.length, 0)

  const toggle = (categoryIndex, itemIndex) => {
    setCategories(categories.map((category, index) => {
      if (index !== categoryIndex) return category
      const checked = category.checked.includes(itemIndex) ? category.checked.filter((item) => item !== itemIndex) : [...category.checked, itemIndex]
      return { ...category, checked }
    }))
  }

  return (
    <Screen heading="Packing Checklist 🧳" kicker="Paris & Rome Adventure">
      <div style={{ ...card, maxWidth: 760, marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}><strong>Progress</strong><strong style={{ color: COLORS.accent }}>{packed}/{total} items packed</strong></div>
        <div style={{ height: 8, background: COLORS.input, borderRadius: 99, marginTop: '0.7rem', overflow: 'hidden' }}><div style={{ width: `${(packed / total) * 100}%`, height: '100%', background: COLORS.accent }} /></div>
      </div>
      {categories.map((category, ci) => (
        <div key={category.name} style={{ ...card, maxWidth: 760, marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><strong>{category.name}</strong><span style={badge(COLORS.accent)}>{category.checked.length}/{category.items.length}</span></div>
          {category.items.map((item, ii) => {
            const checked = category.checked.includes(ii)
            return <button key={item} onClick={() => toggle(ci, ii)} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', width: '100%', border: 0, background: 'transparent', color: checked ? COLORS.muted : COLORS.text, padding: '0.65rem 0', textAlign: 'left' }}><span style={{ width: 20, height: 20, borderRadius: 5, border: `2px solid ${checked ? COLORS.green : COLORS.muted}`, background: checked ? COLORS.green : 'transparent', color: '#000', display: 'grid', placeItems: 'center', fontWeight: 900 }}>{checked ? '✓' : ''}</span>{item}</button>
          })}
        </div>
      ))}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', maxWidth: 760 }}>
        <input style={{ ...input, flex: '1 1 260px' }} placeholder="+ Add item to checklist" value={newItem} onChange={(event) => setNewItem(event.target.value)} />
        <button style={button()} onClick={() => { if (newItem.trim()) { setCategories([...categories, { name: 'Custom', items: [newItem.trim()], checked: [] }]); setNewItem('') } }}>Add</button>
        <button style={button('ghost')} onClick={() => setCategories(PACKING_CATEGORIES.map((category) => ({ ...category, checked: [] })))}>Reset</button>
      </div>
    </Screen>
  )
}

function CommunityScreen() {
  return (
    <Screen heading="Community 🌐" kicker="Share your trips and get inspired">
      <SearchRow placeholder="Search community trips..." />
      <div style={{ display: 'grid', gap: '0.85rem' }}>
        {COMMUNITY_POSTS.map((post) => <div key={post.user} style={{ ...card, display: 'flex', gap: '1rem' }}><div style={{ width: 50, height: 50, borderRadius: '50%', display: 'grid', placeItems: 'center', background: `linear-gradient(135deg, #1e3a5f, ${COLORS.purple})`, fontSize: '1.45rem' }}>{post.avatar}</div><div><strong>{post.trip}</strong><div style={{ color: COLORS.muted, fontSize: '0.78rem' }}>by {post.user}</div><p>{post.desc}</p><button style={button('ghost')}>❤️ {post.likes}</button> <button style={button('ghost')}>Copy Trip</button></div></div>)}
      </div>
    </Screen>
  )
}

function NotesScreen() {
  const [notes, setNotes] = useState(MOCK_NOTES)
  const [note, setNote] = useState('')
  return (
    <Screen heading="Trip Notes 📓" kicker="Jot down reminders tied to your trips">
      <SearchRow placeholder="Search notes..." />
      <div style={{ display: 'grid', gap: '0.75rem', maxWidth: 820 }}>
        {notes.map((item) => <div key={item.id} style={card}><strong>{item.title}</strong><p style={{ color: COLORS.muted }}>{item.body}</p><div style={{ color: COLORS.muted, fontSize: '0.75rem' }}>{item.day}</div><button style={{ ...button('ghost'), marginTop: '0.7rem' }} onClick={() => setNotes(notes.filter((entry) => entry.id !== item.id))}>Delete</button></div>)}
        <div style={card}><strong>+ Add Note</strong><textarea style={{ ...input, minHeight: 86, marginTop: '0.8rem' }} value={note} onChange={(event) => setNote(event.target.value)} placeholder="Write your note here..." /><button style={{ ...button(), marginTop: '0.8rem' }} onClick={() => { if (note.trim()) { setNotes([{ id: Date.now(), title: 'New Note', body: note, day: 'Today' }, ...notes]); setNote('') } }}>Save Note</button></div>
      </div>
    </Screen>
  )
}

function BudgetScreen() {
  const trip = MOCK_TRIPS[0]
  const remaining = trip.budget - trip.spent
  const rows = [
    ['hotel', 'Hotel booking Paris', '3 nights', 3000, 9000],
    ['travel', 'Flight bookings (DBL to PAR)', '1', 12000, 12000],
  ]

  return (
    <Screen heading="Expense Invoice 💳" kicker="Europe Adventure · INV-NYX-30290">
      <SearchRow placeholder="Search invoices..." extra={['Filter', 'Sort']} />
      <div style={grid(320)}>
        <div style={card}><strong>Trip to Europe Adventure</strong><p style={{ color: COLORS.muted }}>May 28 - Jun 09, 2025 · 4 cities · Created by James</p><span style={badge(COLORS.red)}>Payment Status - Pending</span></div>
        <div style={card}><strong>Budget Insights</strong><div style={{ width: 105, height: 105, margin: '1rem auto', borderRadius: '50%', background: `conic-gradient(${COLORS.accent} ${(trip.spent / trip.budget) * 360}deg, ${COLORS.input} 0deg)`, display: 'grid', placeItems: 'center', color: COLORS.red, fontWeight: 900 }}>{Math.round((trip.spent / trip.budget) * 100)}%</div><div style={{ display: 'grid', gap: '0.35rem' }}><BudgetLine label="Total Budget" value={trip.budget} /><BudgetLine label="Total Spent" value={trip.spent} color={COLORS.red} /><BudgetLine label="Remaining" value={remaining} color={remaining < 0 ? COLORS.red : COLORS.green} /></div></div>
      </div>
      <div style={{ ...card, overflowX: 'auto', marginTop: '1rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
          <thead><tr>{['#', 'Category', 'Description', 'Qty/Details', 'Unit Cost', 'Amount'].map((head) => <th key={head} style={{ textAlign: 'left', color: COLORS.muted, padding: '0.7rem', background: COLORS.panel }}>{head}</th>)}</tr></thead>
          <tbody>{rows.map((row, index) => <tr key={row[1]}>{[index + 1, ...row].map((cell, i) => <td key={i} style={{ padding: '0.75rem', borderBottom: `1px solid ${COLORS.border}` }}>{typeof cell === 'number' && i > 2 ? `₹${cell.toLocaleString()}` : cell}</td>)}</tr>)}</tbody>
        </table>
      </div>
    </Screen>
  )
}

function BudgetLine({ label, value, color = COLORS.text }) {
  return <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: COLORS.muted }}>{label}</span><strong style={{ color }}>₹{value.toLocaleString()}</strong></div>
}

function AdminScreen() {
  return (
    <Screen heading="Admin Dashboard 📊" kicker="Platform analytics and user management">
      <SearchRow placeholder="Search bar..." />
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>{['Manage Users', 'Popular Cities', 'Popular Activities', 'User Trends & Analytics'].map((item) => <button key={item} style={button('ghost')}>{item}</button>)}</div>
      <div style={grid(320)}>
        <div style={{ display: 'grid', gap: '1rem' }}>{[['Total Users', '1,284', COLORS.blue, '👥'], ['Trips Created', '3,891', COLORS.accent, '🗺️'], ['Active Today', '247', COLORS.green, '✅'], ['Revenue', '₹5.2L', COLORS.purple, '💰']].map(([label, value, color, icon]) => <div key={label} style={{ ...card, display: 'flex', gap: '1rem', alignItems: 'center' }}><div style={{ width: 50, height: 50, borderRadius: 12, display: 'grid', placeItems: 'center', background: `${color}22`, fontSize: '1.35rem' }}>{icon}</div><div><div style={{ color: COLORS.muted }}>{label}</div><strong style={{ color, fontSize: '1.45rem' }}>{value}</strong></div></div>)}</div>
        <div style={card}><strong>Popular Cities</strong>{['Paris', 'Rome', 'Tokyo', 'Barcelona', 'Bangkok'].map((city, index) => <div key={city} style={{ marginTop: '0.8rem' }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><span>{city}</span><span style={{ color: COLORS.muted }}>{95 - index * 15}%</span></div><div style={{ height: 7, background: COLORS.input, borderRadius: 99 }}><div style={{ width: `${95 - index * 15}%`, height: '100%', background: COLORS.accent, borderRadius: 99 }} /></div></div>)}</div>
      </div>
    </Screen>
  )
}

export default function App() {
  const [screen, setScreen] = useState('login')
  const isAuth = screen !== 'login'

  const renderScreen = () => {
    switch (screen) {
      case 'login': return <LoginScreen go={setScreen} />
      case 'home': return <HomeScreen go={setScreen} />
      case 'create-trip': return <CreateTripScreen go={setScreen} />
      case 'trips': return <TripsScreen go={setScreen} />
      case 'itinerary-builder': return <ItineraryBuilderScreen go={setScreen} />
      case 'itinerary-view': return <ItineraryViewScreen go={setScreen} />
      case 'activity-search': return <ActivitySearchScreen />
      case 'profile': return <ProfileScreen />
      case 'packing': return <PackingScreen />
      case 'community': return <CommunityScreen />
      case 'notes': return <NotesScreen />
      case 'budget': return <BudgetScreen />
      case 'admin': return <AdminScreen />
      default: return <HomeScreen go={setScreen} />
    }
  }

  return (
    <div style={page}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&display=swap" rel="stylesheet" />
      <nav style={{ minHeight: 60, position: 'sticky', top: 0, zIndex: 5, background: 'rgba(10,14,26,0.95)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${COLORS.border}`, padding: '0.65rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <button onClick={() => setScreen('home')} style={{ border: 0, background: 'transparent', color: COLORS.accent, fontWeight: 900, fontSize: '1.35rem' }}>✈️ Traveloop</button>
        {isAuth && <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>{screens.map(([id, label]) => <button key={id} onClick={() => setScreen(id)} style={{ ...button(screen === id ? 'primary' : 'ghost'), padding: '0.42rem 0.75rem', border: 0 }}>{label}</button>)}<button style={{ ...button('ghost'), color: COLORS.red, border: 0 }} onClick={() => setScreen('login')}>Logout</button></div>}
      </nav>
      <main style={{ width: 'min(1100px, 100%)', margin: '0 auto', padding: '2rem' }}>{renderScreen()}</main>
    </div>
  )
}
