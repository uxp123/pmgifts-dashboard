import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const inputStyle = {
  border: '1px solid #c4c7c7', borderRadius: 12, padding: '10px 16px',
  fontSize: 16, color: '#191c1d', background: '#fff', width: '100%', boxSizing: 'border-box',
  outline: 'none', transition: 'border-color 0.15s',
}
const labelStyle = {
  display: 'block', fontSize: 11, color: '#444748', marginBottom: 6,
  fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase',
}

export default function RecordSale() {
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

  const filteredProducts = products.filter(p => !filterCat || p.category_id === filterCat)
  const selectedProduct = products.find(p => p.id === form.product_id)
  const total = selectedProduct ? (selectedProduct.price * form.quantity).toFixed(2) : null

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.product_id) { setError('Please select a product'); return }
    if (!form.quantity || form.quantity < 1) { setError('Quantity must be at least 1'); return }
    setSaving(true); setError('')
    const { error: err } = await supabase.from('sales').insert({
      product_id: form.product_id,
      quantity: Number(form.quantity),
      unit_price: selectedProduct.price,
      sale_date: form.sale_date,
    })
    setSaving(false)
    if (err) { setError('Failed to record sale. Please try again.'); return }
    setSuccess(true)
    setForm(f => ({ ...f, product_id: '', quantity: 1, sale_date: new Date().toISOString().slice(0, 10) }))
    setFilterCat('')
    setTimeout(() => setSuccess(false), 3500)
  }

  return (
    <div style={{ maxWidth: 520, margin: '0 auto' }}>
      {success && (
        <div className="flex items-center gap-2 rounded-xl px-5 py-4 mb-6 font-medium"
          style={{ background: '#d7e6dd', color: '#111e19', border: '1px solid #bbcac1', fontSize: 14 }}>
          ✓ Sale recorded successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-xl border p-6 space-y-6"
        style={{ background: '#fff', borderColor: '#c4c7c7', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>

        <div>
          <label style={labelStyle}>Filter by Category</label>
          <select value={filterCat}
            onChange={e => { setFilterCat(e.target.value); setForm(f => ({ ...f, product_id: '' })) }}
            style={inputStyle} disabled={loading}
            onFocus={e => e.target.style.borderColor = '#000'}
            onBlur={e => e.target.style.borderColor = '#c4c7c7'}>
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div>
          <label style={labelStyle}>Product *</label>
          <select value={form.product_id}
            onChange={e => setForm(f => ({ ...f, product_id: e.target.value }))}
            style={inputStyle} disabled={loading}
            onFocus={e => e.target.style.borderColor = '#000'}
            onBlur={e => e.target.style.borderColor = '#c4c7c7'}>
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
            <label style={labelStyle}>Quantity *</label>
            <input type="number" min="1" value={form.quantity}
              onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#000'}
              onBlur={e => e.target.style.borderColor = '#c4c7c7'} />
          </div>
          <div>
            <label style={labelStyle}>Date</label>
            <input type="date" value={form.sale_date}
              onChange={e => setForm(f => ({ ...f, sale_date: e.target.value }))}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#000'}
              onBlur={e => e.target.style.borderColor = '#c4c7c7'} />
          </div>
        </div>

        {total && (
          <div className="rounded-xl px-5 py-4 flex justify-between items-center"
            style={{ background: '#e8def8', border: '1px solid rgba(98,91,113,0.15)' }}>
            <div>
              <p style={{ fontSize: 11, color: '#686177', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 2 }}>Total</p>
              <p style={{ fontSize: 12, color: '#686177' }}>{form.quantity} × GHS {Number(selectedProduct.price).toFixed(2)}</p>
            </div>
            <p style={{ fontSize: 24, fontWeight: 700, color: '#191c1d' }}>GHS {total}</p>
          </div>
        )}

        {error && <p style={{ color: '#ba1a1a', fontSize: 12 }}>{error}</p>}

        <button type="submit" disabled={saving || loading}
          className="w-full font-semibold transition-colors"
          style={{
            background: '#000', color: '#fff', padding: '14px', borderRadius: 12,
            fontSize: 16, border: 'none', cursor: saving || loading ? 'not-allowed' : 'pointer',
            opacity: saving || loading ? 0.4 : 1,
          }}
          onMouseEnter={e => { if (!saving && !loading) e.currentTarget.style.background = '#1c1b1b' }}
          onMouseLeave={e => e.currentTarget.style.background = '#000'}>
          {saving ? 'Recording…' : 'Record Sale'}
        </button>
      </form>
    </div>
  )
}
