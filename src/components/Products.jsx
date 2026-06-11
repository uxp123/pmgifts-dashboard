import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Modal from './Modal'

const inputStyle = {
  border: '1px solid #c4c7c7', borderRadius: 12, padding: '10px 16px',
  fontSize: 16, color: '#191c1d', background: '#fff', width: '100%', boxSizing: 'border-box',
  outline: 'none', transition: 'border-color 0.15s',
}
const primaryBtn = {
  background: '#000', color: '#fff', padding: '10px 24px', borderRadius: 12,
  fontSize: 14, border: 'none', cursor: 'pointer', fontWeight: 500,
}

export default function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterCat, setFilterCat] = useState('')
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({ name: '', price: '', category_id: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    setLoading(true)
    const [{ data: cats }, { data: prods }] = await Promise.all([
      supabase.from('categories').select('*').order('name'),
      supabase.from('products').select('*, categories(name)').order('name'),
    ])
    setCategories(cats || [])
    setProducts(prods || [])
    setLoading(false)
  }

  function openAdd() {
    setForm({ name: '', price: '', category_id: categories[0]?.id || '' })
    setError(''); setModal('add')
  }
  function openEdit(p) {
    setForm({ name: p.name, price: String(p.price), category_id: p.category_id })
    setError(''); setModal(p)
  }

  async function handleSave() {
    const trimmedName = form.name.trim()
    const price = parseFloat(form.price)
    if (!trimmedName) { setError('Product name is required'); return }
    if (isNaN(price) || price <= 0) { setError('Enter a valid price'); return }
    if (!form.category_id) { setError('Select a category'); return }
    setSaving(true); setError('')
    const payload = { name: trimmedName, price, category_id: form.category_id }
    if (modal === 'add') {
      const { error: err } = await supabase.from('products').insert(payload)
      if (err) { setError('Failed to save product'); setSaving(false); return }
    } else {
      const { error: err } = await supabase.from('products').update(payload).eq('id', modal.id)
      if (err) { setError('Failed to save product'); setSaving(false); return }
    }
    setSaving(false); setModal(null); fetchAll()
  }

  async function handleDelete(p) {
    if (!confirm(`Delete "${p.name}"?`)) return
    const { error: err } = await supabase.from('products').delete().eq('id', p.id)
    if (err) { alert('Cannot delete — this product has sales recorded against it.'); return }
    fetchAll()
  }

  const filtered = products.filter(p => {
    const matchCat = !filterCat || p.category_id === filterCat
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p style={{ fontSize: 14, color: '#444748' }}>{filtered.length} products</p>
        <button onClick={openAdd} style={primaryBtn}
          onMouseEnter={e => e.currentTarget.style.background = '#1c1b1b'}
          onMouseLeave={e => e.currentTarget.style.background = '#000'}>
          + Add Product
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search products…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ ...inputStyle, flex: 1 }}
          onFocus={e => e.target.style.borderColor = '#000'}
          onBlur={e => e.target.style.borderColor = '#c4c7c7'}
        />
        <select
          value={filterCat}
          onChange={e => setFilterCat(e.target.value)}
          style={{ ...inputStyle, flex: 'none', width: 'auto', minWidth: 180 }}
          onFocus={e => e.target.style.borderColor = '#000'}
          onBlur={e => e.target.style.borderColor = '#c4c7c7'}
        >
          <option value="">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-16" style={{ color: '#444748', fontSize: 14 }}>Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16" style={{ color: '#444748', fontSize: 14 }}>No products found.</div>
      ) : (
        <div className="rounded-xl overflow-hidden border" style={{ background: '#fff', borderColor: '#c4c7c7', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
          <table className="w-full">
            <thead style={{ background: '#f3f4f5', borderBottom: '1px solid #c4c7c7' }}>
              <tr>
                {['Product', 'Category', 'Price (GHS)', ''].map((h, i) => (
                  <th key={i}
                    className={`text-left px-5 py-3.5 ${i === 1 ? 'hidden sm:table-cell' : ''} ${i === 2 ? 'text-right' : ''}`}
                    style={{ fontSize: 11, color: '#444748', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, idx) => (
                <tr key={p.id}
                  style={{ borderTop: idx > 0 ? '1px solid rgba(196,199,199,0.35)' : 'none' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f3f4f5'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td className="px-5 py-3.5" style={{ fontSize: 14, fontWeight: 500, color: '#191c1d' }}>{p.name}</td>
                  <td className="px-5 py-3.5 hidden sm:table-cell">
                    <span className="inline-block px-2.5 py-1 rounded-full"
                      style={{ background: '#e8def8', color: '#686177', fontSize: 11, fontWeight: 500 }}>
                      {p.categories?.name}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right" style={{ fontSize: 14, fontWeight: 600, color: '#191c1d' }}>
                    {Number(p.price).toFixed(2)}
                  </td>
                  <td className="px-5 py-3.5 text-right whitespace-nowrap">
                    <button onClick={() => openEdit(p)}
                      style={{ fontSize: 12, color: '#444748', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500, marginRight: 12 }}
                      onMouseEnter={e => e.currentTarget.style.color = '#191c1d'}
                      onMouseLeave={e => e.currentTarget.style.color = '#444748'}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(p)}
                      style={{ fontSize: 12, color: '#ba1a1a', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <Modal title={modal === 'add' ? 'Add Product' : 'Edit Product'} onClose={() => setModal(null)}>
          <div className="space-y-5">
            {[
              { label: 'Product Name', key: 'name', type: 'text', placeholder: 'e.g. Birthday cards' },
              { label: 'Selling Price (GHS)', key: 'price', type: 'number', placeholder: '0.00' },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label style={{ display: 'block', fontSize: 12, color: '#444748', marginBottom: 6, fontWeight: 500, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                  {label}
                </label>
                <input
                  type={type}
                  value={form[key]}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#000'}
                  onBlur={e => e.target.style.borderColor = '#c4c7c7'}
                  placeholder={placeholder}
                  autoFocus={key === 'name'}
                  min={key === 'price' ? 0 : undefined}
                  step={key === 'price' ? '0.01' : undefined}
                />
              </div>
            ))}
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#444748', marginBottom: 6, fontWeight: 500, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                Category
              </label>
              <select
                value={form.category_id}
                onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#000'}
                onBlur={e => e.target.style.borderColor = '#c4c7c7'}
              >
                <option value="">Select category…</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            {error && <p style={{ color: '#ba1a1a', fontSize: 12 }}>{error}</p>}
            <div className="flex gap-3 justify-end">
              <button onClick={() => setModal(null)}
                style={{ padding: '10px 16px', fontSize: 14, color: '#444748', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                style={{ ...primaryBtn, opacity: saving ? 0.4 : 1 }}>
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
