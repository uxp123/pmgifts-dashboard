import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

function isoDate(d) { return d.toISOString().slice(0, 10) }
function startOfWeek(date) {
  const d = new Date(date)
  const day = d.getDay()
  d.setDate(d.getDate() - day + (day === 0 ? -6 : 1))
  d.setHours(0, 0, 0, 0); return d
}

const PASTEL_BARS = ['#1c1b1b', '#625b71', '#3c4a43', '#5c4d1a', '#444748']

export default function Overview({ onNavigate }) {
  const [stats, setStats] = useState(null)
  const [recentSales, setRecentSales] = useState([])
  const [categoryStats, setCategoryStats] = useState([])
  const [loading, setLoading] = useState(true)

  const today = isoDate(new Date())
  const weekStart = isoDate(startOfWeek(new Date()))

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    const [
      { data: todaySales },
      { data: weekSales },
      { data: products },
      { data: recent },
      { data: allSales },
    ] = await Promise.all([
      supabase.from('sales').select('total').eq('sale_date', today),
      supabase.from('sales').select('total').gte('sale_date', weekStart),
      supabase.from('products').select('quantity'),
      supabase.from('sales').select('*, products(name, categories(name))').order('created_at', { ascending: false }).limit(8),
      supabase.from('sales').select('total, products(categories(name))'),
    ])

    const todayTotal = (todaySales || []).reduce((s, r) => s + Number(r.total), 0)
    const weekTotal  = (weekSales  || []).reduce((s, r) => s + Number(r.total), 0)
    const totalProducts = (products || []).length
    const outOfStock    = (products || []).filter(p => (p.quantity ?? 0) === 0).length
    const lowStock      = (products || []).filter(p => (p.quantity ?? 0) > 0 && (p.quantity ?? 0) <= 5).length

    const catMap = {}
    ;(allSales || []).forEach(s => {
      const cat = s.products?.categories?.name || 'Other'
      catMap[cat] = (catMap[cat] || 0) + Number(s.total)
    })
    const catArray = Object.entries(catMap).sort((a, b) => b[1] - a[1]).slice(0, 5)
    const maxCat = catArray[0]?.[1] || 1

    setStats({ todayTotal, todayCount: (todaySales||[]).length, weekTotal, weekCount: (weekSales||[]).length, totalProducts, outOfStock, lowStock })
    setRecentSales(recent || [])
    setCategoryStats(catArray.map(([name, total]) => ({ name, total, pct: Math.round(total / maxCat * 100) })))
    setLoading(false)
  }

  if (loading) return <div className="text-center py-20" style={{ color: '#444748', fontSize: 14 }}>Loading…</div>

  const hasAlerts = stats.outOfStock + stats.lowStock > 0

  return (
    <div className="space-y-6">

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="col-span-2 sm:col-span-1 rounded-xl p-5 border" style={{ background: '#e8def8', borderColor: 'rgba(98,91,113,0.15)' }}>
          <p style={{ fontSize: 11, color: '#686177', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>Today's Revenue</p>
          <p style={{ fontSize: 22, fontWeight: 700, color: '#191c1d', lineHeight: 1.2 }}>GHS {stats.todayTotal.toFixed(2)}</p>
          <p style={{ fontSize: 12, color: '#686177', marginTop: 6 }}>{stats.todayCount} sale{stats.todayCount !== 1 ? 's' : ''} today</p>
        </div>

        <div className="col-span-2 sm:col-span-1 rounded-xl p-5 border" style={{ background: '#d7e6dd', borderColor: 'rgba(60,74,67,0.15)' }}>
          <p style={{ fontSize: 11, color: '#3c4a43', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>This Week</p>
          <p style={{ fontSize: 22, fontWeight: 700, color: '#191c1d', lineHeight: 1.2 }}>GHS {stats.weekTotal.toFixed(2)}</p>
          <p style={{ fontSize: 12, color: '#3c4a43', marginTop: 6 }}>{stats.weekCount} sale{stats.weekCount !== 1 ? 's' : ''} this week</p>
        </div>

        <div onClick={() => hasAlerts && onNavigate('products')}
          style={{ background: hasAlerts ? '#ffdad6' : '#f3f4f5', border: `1px solid ${hasAlerts ? 'rgba(186,26,26,0.15)' : '#c4c7c7'}`, borderRadius: 12, padding: 20, cursor: hasAlerts ? 'pointer' : 'default' }}>
          <p style={{ fontSize: 11, color: hasAlerts ? '#ba1a1a' : '#444748', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>Stock Alerts</p>
          <p style={{ fontSize: 22, fontWeight: 700, color: '#191c1d', lineHeight: 1.2 }}>{stats.outOfStock + stats.lowStock}</p>
          <p style={{ fontSize: 12, color: '#ba1a1a', marginTop: 6 }}>{stats.outOfStock} out · {stats.lowStock} low</p>
        </div>

        <div className="rounded-xl p-5 border" style={{ background: '#f9f4da', borderColor: 'rgba(92,77,26,0.15)' }}>
          <p style={{ fontSize: 11, color: '#5c4d1a', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>Catalogue</p>
          <p style={{ fontSize: 22, fontWeight: 700, color: '#191c1d', lineHeight: 1.2 }}>{stats.totalProducts}</p>
          <p style={{ fontSize: 12, color: '#5c4d1a', marginTop: 6 }}>products</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-6">

        {/* ── Category performance ── */}
        {categoryStats.length > 0 && (
          <div className="sm:col-span-2 rounded-xl border p-6" style={{ background: '#fff', borderColor: '#c4c7c7', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#191c1d', marginBottom: 2 }}>Category Performance</p>
            <p style={{ fontSize: 12, color: '#444748', marginBottom: 20 }}>Revenue by category (all time)</p>
            <div className="space-y-5">
              {categoryStats.map(({ name, total, pct }, i) => (
                <div key={name}>
                  <div className="flex justify-between mb-2">
                    <span style={{ fontSize: 13, color: '#191c1d', fontWeight: 500 }}>{name}</span>
                    <span style={{ fontSize: 12, color: '#444748' }}>GHS {total.toLocaleString('en-GH', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</span>
                  </div>
                  <div style={{ height: 7, background: '#f3f4f5', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: PASTEL_BARS[i % PASTEL_BARS.length], borderRadius: 99 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Recent sales ── */}
        {recentSales.length > 0 && (
          <div className={`${categoryStats.length > 0 ? 'sm:col-span-3' : 'sm:col-span-5'} rounded-xl border overflow-hidden`}
            style={{ background: '#fff', borderColor: '#c4c7c7', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
            <div className="px-6 py-4 border-b" style={{ borderColor: '#c4c7c7' }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#191c1d' }}>Recent Sales</p>
            </div>
            <table className="w-full">
              <thead style={{ background: '#f3f4f5' }}>
                <tr>
                  {['Product', 'Category', 'Qty', 'Total (GHS)'].map((h, i) => (
                    <th key={i} className={i >= 2 ? 'hidden sm:table-cell' : ''}
                      style={{ padding: '10px 20px', fontSize: 11, color: '#444748', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', textAlign: i >= 2 ? 'right' : 'left' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentSales.map((s, idx) => (
                  <tr key={s.id} style={{ borderTop: idx > 0 ? '1px solid rgba(196,199,199,0.35)' : 'none' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f3f4f5'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '12px 20px', fontSize: 14, fontWeight: 500, color: '#191c1d' }}>{s.products?.name}</td>
                    <td style={{ padding: '12px 20px' }}>
                      <span className="inline-block px-2.5 py-1 rounded-full" style={{ background: '#e8def8', color: '#686177', fontSize: 11, fontWeight: 500 }}>
                        {s.products?.categories?.name}
                      </span>
                    </td>
                    <td className="hidden sm:table-cell" style={{ padding: '12px 20px', textAlign: 'right', fontSize: 14, color: '#191c1d' }}>{s.quantity}</td>
                    <td className="hidden sm:table-cell" style={{ padding: '12px 20px', textAlign: 'right', fontSize: 14, fontWeight: 600, color: '#191c1d' }}>{Number(s.total).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {recentSales.length === 0 && (
        <div className="text-center py-20">
          <div style={{ fontSize: 48, marginBottom: 12 }}>📊</div>
          <p style={{ fontSize: 14, color: '#444748' }}>No sales yet. Start by recording a sale!</p>
        </div>
      )}
    </div>
  )
}
