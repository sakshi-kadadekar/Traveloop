import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import API from '../api/axios'
import Navbar from '../components/Navbar'

export default function PackingChecklist() {
  const { id } = useParams()
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ name: '', category: 'documents' })

  useEffect(() => {
    API.get(`/packing/${id}`).then(res => setItems(res.data))
  }, [id])

  const addItem = async () => {
    const res = await API.post('/packing', { ...form, tripId: id })
    setItems([...items, res.data])
    setForm({ name: '', category: 'documents' })
  }

  const togglePacked = async (item) => {
    const res = await API.put(`/packing/${item.id}`, { isPacked: !item.isPacked })
    setItems(items.map(i => i.id === item.id ? res.data : i))
  }

  const deleteItem = async (itemId) => {
    await API.delete(`/packing/${itemId}`)
    setItems(items.filter(i => i.id !== itemId))
  }

  const packed = items.filter(i => i.isPacked).length
  const categories = ['documents', 'clothing', 'electronics']

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-2">Packing Checklist</h1>
        <p className="text-gray-400 mb-6">Progress: {packed}/{items.length} packed</p>
        <div className="w-full bg-gray-800 rounded-full h-2 mb-8">
          <div className="bg-amber-400 h-2 rounded-full" style={{ width: items.length ? `${(packed/items.length)*100}%` : '0%' }} />
        </div>
        <div className="flex gap-2 mb-6">
          <input className="flex-1 bg-gray-900 p-3 rounded-lg outline-none" placeholder="Item name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          <select className="bg-gray-900 p-3 rounded-lg outline-none" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
          <button onClick={addItem} className="bg-amber-400 text-black font-bold px-4 py-2 rounded-lg">Add</button>
        </div>
        {categories.map(cat => {
          const catItems = items.filter(i => i.category === cat)
          if (!catItems.length) return null
          return (
            <div key={cat} className="mb-6">
              <h3 className="text-amber-400 font-bold capitalize mb-2">{cat}</h3>
              {catItems.map(item => (
                <div key={item.id} className="flex items-center justify-between bg-gray-900 px-4 py-3 rounded-lg mb-2">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={item.isPacked} onChange={() => togglePacked(item)} className="w-4 h-4" />
                    <span className={item.isPacked ? 'line-through text-gray-500' : ''}>{item.name}</span>
                  </div>
                  <button onClick={() => deleteItem(item.id)} className="text-red-400 text-sm">Remove</button>
                </div>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}