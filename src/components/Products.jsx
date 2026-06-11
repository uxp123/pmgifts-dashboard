import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Modal from './Modal'

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

  useEffect(() => {
    fetchAll()
  }, [])

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
    setError('')
    setModal('add')
  }

  function openEdit(p) {
    setForm({ name: p.name, price: String(p.price), category_id: p.category_id })
    setError('')
    setModal(p)
  }

  async function handleSave() {
    const trimmedName = form.name.trim()
    const price = parseFloat(form.price)
    if (!trimmedName) { setError('Product name is required'); return }
    if (isNaN(price) || price <= 0) { setError('Enter a valid price'); return }
    if (!form.category_id) { setError('Select a category'); return }
    setSaving(true)
    setError('')
    const payload = { name: trimmedName, price, category_id: form.category_id }
    if (modal === 'add') {
      const { error: err } = await supabase.from('products').insert(payload)
      if (err) { setError('Failed to save product'); setSaving(false); return }
    } else {
      const { error: err } = await supabase.from('products').update(payload).eq('id', modal.id)
      if (err) { setError('Failed to save product'); setSaving(false); return }
    }
    setSaving(false)
    setModal(null)
    fetchAll()
  }

  async function handleDelete(p) {
    if (!confirm(`Delete "${p.name}"?`)) return
    const { error: err } = await supabase.from('products').delete().eq('id', p.id)
    if (err) {
      alert('Cannot delete — this product has sales recorded against it.')
      return
    }
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
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>
        <button
          onClick={openAdd}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + Add Product
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <input
          type="text"
          placeholder="Search products…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <select
          value={filterCat}
          onChange={e => setFilterCat(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
        >
          <option value="">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">No products found.</div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600 font-semibold">Product</th>
                <th className="text-left px-4 py-3 text-gray-600 font-semibold hidden sm:table-cell">Category</th>
                <th className="text-right px-4 py-3 text-gray-600 font-semibold">Price (GHS)</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-800 font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{p.categories?.name}</td>
                  <td className="px-4 py-3 text-right text-gray-800">
                    {Number(p.price).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openEdit(p)}
                      className="text-blue-600 hover:text-blue-800 font-medium mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p)}
                      className="text-red-500 hover:text-red-700 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-4 py-2 text-xs text-gray-400 border-t border-gray-100">
            {filtered.length} product{filtered.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}

      {modal && (
        <Modal
          title={modal === 'add' ? 'Add Product' : 'Edit Product'}
          onClose={() => setModal(null)}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="e.g. Birthday cards"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={form.category_id}
                onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              >
                <option value="">Select category…</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price (GHS)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="0.00"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex gap-3 justify-end">
              <button onClick={() => setModal(null)} className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium">
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
