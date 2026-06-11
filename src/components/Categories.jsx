import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Modal from './Modal'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null) // null | 'add' | {id, name}
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { fetchCategories() }, [])

  async function fetchCategories() {
    setLoading(true)
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name')
    setCategories(data || [])
    setLoading(false)
  }

  function openAdd() {
    setName('')
    setError('')
    setModal('add')
  }

  function openEdit(cat) {
    setName(cat.name)
    setError('')
    setModal(cat)
  }

  async function handleSave() {
    const trimmed = name.trim()
    if (!trimmed) { setError('Category name is required'); return }
    setSaving(true)
    setError('')
    if (modal === 'add') {
      const { error: err } = await supabase.from('categories').insert({ name: trimmed })
      if (err) { setError('A category with that name already exists'); setSaving(false); return }
    } else {
      const { error: err } = await supabase.from('categories').update({ name: trimmed }).eq('id', modal.id)
      if (err) { setError('A category with that name already exists'); setSaving(false); return }
    }
    setSaving(false)
    setModal(null)
    fetchCategories()
  }

  async function handleDelete(cat) {
    if (!confirm(`Delete "${cat.name}"? Products in this category will also be affected.`)) return
    const { error: err } = await supabase.from('categories').delete().eq('id', cat.id)
    if (err) {
      alert('Cannot delete — this category still has products linked to it.')
      return
    }
    fetchCategories()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
        <button
          onClick={openAdd}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + Add Category
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading…</div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12 text-gray-400">No categories yet. Add one above.</div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map(cat => (
            <div key={cat.id} className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex items-center justify-between shadow-sm">
              <span className="font-medium text-gray-700">{cat.name}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(cat)}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(cat)}
                  className="text-sm text-red-500 hover:text-red-700 font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <Modal
          title={modal === 'add' ? 'Add Category' : 'Edit Category'}
          onClose={() => setModal(null)}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSave()}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="e.g. Gift Items"
                autoFocus
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setModal(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-lg font-medium disabled:opacity-50 transition-colors"
              >
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
