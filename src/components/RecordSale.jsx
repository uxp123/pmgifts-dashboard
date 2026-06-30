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

const PAYMENT_METHODS = ['Cash', 'Momo', 'Debit/Credit Card']

const METHOD_STYLES = {
  'Cash':             { bg: '#d7e6dd', color: '#3c4a43' },
  'Momo':             { bg: '#f9f4da', color: '#5c4d1a' },
  'Debit/Credit Card':{ bg: '#e8def8', color: '#686177' },
}

export default function RecordSale() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterCat, setFilterCat] = useState('')
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({
    product_id: '',
    quantity: 1,
    sale_date: new Date().toISOString().slice(0, 10),
    payment_method: 'Cash',
    notes: '',
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

  const filteredProducts = products.filter(p => {
    const matchCat = !filterCat || p.category_id === filterCat
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })
  const selectedProduct = products.find(p => p.id === form.product_id)
  const total = selectedProduct ? (selectedProduct.price * form.quantity).toFixed(2) : null

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.product_id) { setError('Please select a product'); return }
    if (!form.quantity || form.quantity < 1) { setError('Quantity must be at least 1'); return }
    const qty = Number(form.quantity)
    if (qty > (selectedProduct.quantity ?? 0)) {
      setError(`Not enough stock — only ${selectedProduct.quantity ?? 0} in stock`); return
    }
    setSaving(true); setError('')
    const { error: err } = await supabase.from('sales').insert({
      product_id: form.product_id,
      quantity: qty,
      unit_price: selectedProduct.price,
      sale_date: form.sale_date,
      payment_method: form.payment_method,
      notes: form.notes.trim() || null,
    })
    if (err) { setSaving(false); setError('Failed to record sale. Please try again.'); return }
    await supabase.from('products').update({ quantity: (selectedProduct.quantity ?? 0) - qty }).eq('id', form.product_id)
    setSaving(false)
    setSuccess(true)
    setForm(f => ({ ...f, product_id: '', quantity: 1, sale_date: new Date().toISOString().slice(0, 10), notes: '' }))
    setFilterCat(''); setSearch('')
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
            onChange={e => { setFilterCat(e.target.value); setSearch(''); setForm(f => ({ ...f, product_id: '' })) }}
            style={inputStyle} disabled={loading}
            onFocus={e => e.target.style.borderColor = '#000'}
            onBlur={e => e.target.style.borderColor = '#c4c7c7'}>
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div>
          <label style={labelStyle}>Search Product</label>
          <input
            type="text"
            placeholder="Type to search…"
            value={search}
            onChange={e => { setSearch(e.target.value); setForm(f => ({ ...f, product_id: '' })) }}
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = '#000'}
            onBlur={e => e.target.style.borderColor = '#c4c7c7'}
          />
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

        {/* Payment method */}
        <div>
          <label style={labelStyle}>Payment Method</label>
          <div className="flex gap-2 flex-wrap">
            {PAYMENT_METHODS.map(method => {
              const active = form.payment_method === method
              const s = METHOD_STYLES[method]
              return (
                <button key={method} type="button" onClick={() => setForm(f => ({ ...f, payment_method: method }))}
                  style={{
                    padding: '8px 16px', borderRadius: 99, fontSize: 13, fontWeight: 500, cursor: 'pointer',
                    border: `1.5px solid ${active ? 'transparent' : '#c4c7c7'}`,
                    background: active ? s.bg : '#fff',
                    color: active ? s.color : '#444748',
                    transition: 'all 0.15s',
                  }}>
                  {method}
                </button>
              )
            })}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label style={labelStyle}>Notes <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span></label>
          <textarea
            value={form.notes}
            onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
            placeholder="e.g. Customer requested gift wrap, paid in advance…"
            rows={2}
            style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.5', fontSize: 14 }}
            onFocus={e => e.target.style.borderColor = '#000'}
            onBlur={e => e.target.style.borderColor = '#c4c7c7'}
          />
        </div>

        {total && (
          <div className="rounded-xl px-5 py-4 flex justify-between items-center"
            style={{ background: '#e8def8', border: '1px solid rgba(98,91,113,0.15)' }}>
            <div>
              <p style={{ fontSize: 11, color: '#686177', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 2 }}>Total</p>
              <p style={{ fontSize: 12, color: '#686177' }}>{form.quantity} × GHS {Number(selectedProduct.price).toFixed(2)}</p>
              <p style={{ fontSize: 12, color: METHOD_STYLES[form.payment_method].color, marginTop: 2, fontWeight: 500 }}>{form.payment_method}</p>
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
