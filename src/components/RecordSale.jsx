import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function RecordSale({ onSaleRecorded }) {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterCat, setFilterCat] = useState('')
  const [form, setForm] = useState({
    product_id: '',
    quantity: 1,
    sale_date: new Date().toISOString().slice(0, 10),
  })
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { fetchData() }, [])

  async function fetchData() {
    const [{ data: cats }, { data: prods }] = await Promise.all([
      supabase.from('categories').select('*').order('name'),
      supabase.from('products').select('*, categories(name)').order('name'),
    ])
    setCategories(cats || [])
    setProducts(prods || [])
    setLoading(false)
  }

  const filteredProducts = products.filter(p =>
    !filterCat || p.category_id === filterCat
  )

  const selectedProduct = products.find(p => p.id === form.product_id)
  const total = selectedProduct ? (selectedProduct.price * form.quantity).toFixed(2) : null

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.product_id) { setError('Please select a product'); return }
    if (!form.quantity || form.quantity < 1) { setError('Quantity must be at least 1'); return }
    setSaving(true)
    setError('')
    const { error: err } = await supabase.from('sales').insert({
      product_id: form.product_id,
      quantity: Number(form.quantity),
      unit_price: selectedProduct.price,
      sale_date: form.sale_date,
    })
    setSaving(false)
    if (err) { setError('Failed to record sale. Please try again.'); return }
    setSuccess(true)
    setForm(f => ({
      ...f,
      product_id: '',
      quantity: 1,
      sale_date: new Date().toISOString().slice(0, 10),
    }))
    setFilterCat('')
    setTimeout(() => setSuccess(false), 3000)
    if (onSaleRecorded) onSaleRecorded()
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Record a Sale</h1>

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-5 py-4 mb-5 font-medium">
          Sale recorded successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Category</label>
          <select
            value={filterCat}
            onChange={e => { setFilterCat(e.target.value); setForm(f => ({ ...f, product_id: '' })) }}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            disabled={loading}
          >
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Product *</label>
          <select
            value={form.product_id}
            onChange={e => setForm(f => ({ ...f, product_id: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            disabled={loading}
          >
            <option value="">Select a product…</option>
            {filteredProducts.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} — GHS {Number(p.price).toFixed(2)}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
            <input
              type="number"
              min="1"
              value={form.quantity}
              onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={form.sale_date}
              onChange={e => setForm(f => ({ ...f, sale_date: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {total && (
          <div className="bg-emerald-50 rounded-xl px-5 py-4 flex justify-between items-center">
            <span className="text-gray-600 font-medium">Total</span>
            <span className="text-2xl font-bold text-emerald-700">GHS {total}</span>
          </div>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={saving || loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold text-base disabled:opacity-50 transition-colors"
        >
          {saving ? 'Recording…' : 'Record Sale'}
        </button>
      </form>
    </div>
  )
}
