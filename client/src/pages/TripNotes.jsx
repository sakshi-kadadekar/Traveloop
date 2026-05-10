import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import API from '../api/axios'
import Navbar from '../components/Navbar'

export default function TripNotes() {
  const { id } = useParams()
  const [notes, setNotes] = useState([])
  const [content, setContent] = useState('')
  const [stopName, setStopName] = useState('')

  useEffect(() => {
    API.get(`/notes/${id}`).then(res => setNotes(res.data)).catch(() => {})
  }, [id])

  const addNote = async () => {
    if (!content.trim()) return
    const res = await API.post('/notes', { tripId: id, content, stopName })
    setNotes([res.data, ...notes])
    setContent('')
    setStopName('')
  }

  const deleteNote = async (noteId) => {
    await API.delete(`/notes/${noteId}`)
    setNotes(notes.filter(n => n.id !== noteId))
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Trip Notes 📓</h1>

        <div className="bg-gray-900 rounded-xl p-5 mb-6">
          <textarea
            className="w-full bg-gray-800 text-white p-3 rounded-lg outline-none h-28 resize-none"
            placeholder="Write a note, reminder, or anything important..."
            value={content}
            onChange={e => setContent(e.target.value)}
          />
          <div className="flex gap-3 mt-3">
            <input
              className="flex-1 bg-gray-800 text-white p-3 rounded-lg outline-none"
              placeholder="Stop name (optional)"
              value={stopName}
              onChange={e => setStopName(e.target.value)}
            />
            <button onClick={addNote}
              className="bg-amber-400 text-black font-bold px-6 py-2 rounded-lg hover:bg-amber-300">
              + Add Note
            </button>
          </div>
        </div>

        {notes.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p className="text-4xl mb-3">📝</p>
            <p>No notes yet. Add your first note!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notes.map(note => (
              <div key={note.id} className="bg-gray-900 rounded-xl p-5 border border-gray-800">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex gap-2 items-center">
                    {note.stopName && (
                      <span className="bg-amber-900 text-amber-400 text-xs px-2 py-1 rounded-full">
                        📍 {note.stopName}
                      </span>
                    )}
                    <span className="text-gray-500 text-xs">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <button onClick={() => deleteNote(note.id)}
                    className="text-red-500 hover:text-red-400 text-sm">
                    Delete
                  </button>
                </div>
                <p className="text-gray-200">{note.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}