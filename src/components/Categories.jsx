import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Modal from './Modal'

const PASTELS = [
  { bg: '#e8def8', text: '#686177' },
  { bg: '#d7e6dd', text: '#3c4a43' },
  { bg: '#f9f4da', text: '#5c4d1a' },
  { bg: '#e7e8e9', text: '#444748' },
]

const inputStyle = {
  border: '1px solid #c4c7c7', borderRadius: 12, padding: '10px 16px',
  fontSize: 16, color: '#191c1d', background: '#fff', width: '100%', boxSizing: 'border-box',
  outline: 'none', transition: 'border-color 0.15s',
}

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { fetchCategories() }, [])

  async function fetchCategories() {
    setLoading(true)
    const { data } = await supabase.from('categories').select('*').order('name')
    setCategories(data || [])
    setLoading(false)
  }

  function openAdd() { setName(''); setError(''); setModal('add') }
  function openEdit(cat) { setName(cat.name); setError(''); setModal(cat) }

  async function handleSave() {
    const trimmed = name.trim()
    if (!trimmed) { setError('Category name is required'); return }
    setSaving(true); setError('')
    if (modal === 'add') {
      const { error: err } = await supabase.from('categories').insert({ name: trimmed })
      if (err) { setError('A category with that name already exists'); setSaving(false); return }
    } else {
      const { error: err } = await supabase.from('categories').update({ name: trimmed }).eq('id', modal.id)
      if (err) { setError('A category with that name already exists'); setSaving(false); return }
    }
    setSaving(false); setModal(null); fetchCategories()
  }

  async function handleDelete(cat) {
    if (!confirm(`Delete "${cat.name}"? Products in this category will be affected.`)) return
    const { error: err } = await supabase.from('categories').delete().eq('id', cat.id)
    if (err) { alert('Cannot delete — this category still has products linked to it.'); return }
    fetchCategories()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <p style={{ fontSize: 14, color: '#444748' }}>{categories.length} categories</p>
        <button
          onClick={openAdd}
          className="font-medium transition-colors"
          style={{ background: '#000', color: '#fff', padding: '10px 20px', borderRadius: 12, fontSize: 14, border: 'none', cursor: 'pointer' }}
          onMouseEnter={e => e.currentTarget.style.background = '#1c1b1b'}
          onMouseLeave={e => e.currentTarget.style.background = '#000'}
        >
          + Add Category
        </button>
      </div>

      {loading ? (
        <div className="text-center py-16" style={{ color: '#444748', fontSize: 14 }}>Loading…</div>
      ) : categories.length === 0 ? (
        <div className="text-center py-16" style={{ color: '#444748', fontSize: 14 }}>No categories yet.</div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => {
            const p = PASTELS[i % PASTELS.length]
            return (
              <div key={cat.id}
                className="flex items-center justify-between px-5 py-4 rounded-xl border"
                style={{ background: p.bg, color: p.text, borderColor: 'rgba(0,0,0,0.06)' }}>
                <span className="font-semibold" style={{ fontSize: 15 }}>{cat.name}</span>
                <div className="flex gap-3">
                  <button onClick={() => openEdit(cat)}
                    className="font-medium transition-opacity hover:opacity-70"
                    style={{ fontSize: 12, color: p.text, background: 'none', border: 'none', cursor: 'pointer' }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(cat)}
                    className="font-medium transition-opacity hover:opacity-70"
                    style={{ fontSize: 12, color: '#ba1a1a', background: 'none', border: 'none', cursor: 'pointer' }}>
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {modal && (
        <Modal title={modal === 'add' ? 'Add Category' : 'Edit Category'} onClose={() => setModal(null)}>
          <div className="space-y-5">
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#444748', marginBottom: 6, fontWeight: 500, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                Category Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSave()}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#000'}
                onBlur={e => e.target.style.borderColor = '#c4c7c7'}
                placeholder="e.g. Gift Items"
                autoFocus
              />
              {error && <p style={{ color: '#ba1a1a', fontSize: 12, marginTop: 6 }}>{error}</p>}
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setModal(null)}
                style={{ padding: '10px 16px', fontSize: 14, color: '#444748', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                style={{ background: '#000', color: '#fff', padding: '10px 24px', borderRadius: 12, fontSize: 14, border: 'none', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.4 : 1, fontWeight: 500 }}>
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
