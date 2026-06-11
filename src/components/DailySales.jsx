import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

function isoDate(d) { return d.toISOString().slice(0, 10) }
function addDays(date, n) { const d = new Date(date); d.setDate(d.getDate() + n); return d }
function fmtDateLong(iso) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

const today = isoDate(new Date())

export default function DailySales() {
  const [date, setDate] = useState(today)
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)

  const isToday = date === today

  useEffect(() => { fetchSales() }, [date])

  async function fetchSales() {
    setLoading(true)
    const { data } = await supabase
      .from('sales')
      .select('*, products(name, categories(name))')
      .eq('sale_date', date)
      .order('created_at', { ascending: false })
    setSales(data || [])
    setLoading(false)
  }

  async function handleDelete(id) {
    if (!confirm('Delete this sale record?')) return
    setDeleting(id)
    await supabase.from('sales').delete().eq('id', id)
    setDeleting(null)
    fetchSales()
  }

  function prevDay() { setDate(isoDate(addDays(new Date(date + 'T00:00:00'), -1))) }
  function nextDay() { if (!isToday) setDate(isoDate(addDays(new Date(date + 'T00:00:00'), 1))) }

  const total = sales.reduce((sum, s) => sum + Number(s.total), 0)

  const navBtnStyle = {
    width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
    border: '1px solid #c4c7c7', borderRadius: 10, fontSize: 20, fontWeight: 700,
    color: '#444748', background: '#fff', cursor: 'pointer', transition: 'background 0.15s',
  }

  return (
    <div>
      {/* Day navigator */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={prevDay} style={navBtnStyle}
          onMouseEnter={e => e.currentTarget.style.background = '#f3f4f5'}
          onMouseLeave={e => e.currentTarget.style.background = '#fff'}>‹</button>

        <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-center sm:text-left">
          <div className="flex-1">
            <p style={{ fontSize: 15, fontWeight: 600, color: '#191c1d' }}>{fmtDateLong(date)}</p>
            {isToday && <p style={{ fontSize: 11, color: '#625b71', fontWeight: 500, marginTop: 2 }}>Today</p>}
          </div>
          {/* Jump-to-date picker */}
          <input
            type="date"
            value={date}
            max={today}
            onChange={e => { if (e.target.value) setDate(e.target.value) }}
            style={{
              border: '1px solid #c4c7c7', borderRadius: 10, padding: '6px 12px',
              fontSize: 13, color: '#444748', background: '#fff', outline: 'none', cursor: 'pointer',
            }}
          />
        </div>

        <button onClick={nextDay} disabled={isToday} style={{ ...navBtnStyle, opacity: isToday ? 0.25 : 1, cursor: isToday ? 'not-allowed' : 'pointer' }}
          onMouseEnter={e => { if (!isToday) e.currentTarget.style.background = '#f3f4f5' }}
          onMouseLeave={e => e.currentTarget.style.background = '#fff'}>›</button>
      </div>

      {/* Summary card */}
      {!loading && sales.length > 0 && (
        <div className="rounded-xl px-5 py-4 mb-6 flex items-center justify-between border"
          style={{ background: '#e8def8', borderColor: 'rgba(98,91,113,0.15)' }}>
          <div>
            <p style={{ fontSize: 11, color: '#686177', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>
              Day Total
            </p>
            <p style={{ fontSize: 28, fontWeight: 700, color: '#191c1d' }}>GHS {total.toFixed(2)}</p>
          </div>
          <p style={{ fontSize: 14, color: '#686177' }}>{sales.length} sale{sales.length !== 1 ? 's' : ''}</p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-16" style={{ color: '#444748', fontSize: 14 }}>Loading…</div>
      ) : sales.length === 0 ? (
        <div className="text-center py-20">
          <div style={{ fontSize: 48, marginBottom: 12 }}>📅</div>
          <p style={{ fontSize: 14, color: '#444748' }}>No sales recorded for this day.</p>
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden border"
          style={{ background: '#fff', borderColor: '#c4c7c7', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
          <table className="w-full">
            <thead style={{ background: '#f3f4f5', borderBottom: '1px solid #c4c7c7' }}>
              <tr>
                {[
                  { label: 'Time', cls: 'hidden sm:table-cell' },
                  { label: 'Product', cls: '' },
                  { label: 'Category', cls: 'hidden md:table-cell' },
                  { label: 'Qty', cls: 'text-right' },
                  { label: 'Unit', cls: 'text-right hidden sm:table-cell' },
                  { label: 'Total (GHS)', cls: 'text-right' },
                  { label: '', cls: '' },
                ].map(({ label, cls }, i) => (
                  <th key={i} className={`px-5 py-3.5 ${cls}`}
                    style={{ fontSize: 11, color: '#444748', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', textAlign: cls.includes('text-right') ? 'right' : 'left' }}>
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sales.map((s, idx) => {
                const time = new Date(s.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
                return (
                  <tr key={s.id}
                    style={{ borderTop: idx > 0 ? '1px solid rgba(196,199,199,0.35)' : 'none' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f3f4f5'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td className="px-5 py-3.5 hidden sm:table-cell" style={{ fontSize: 13, color: '#444748', fontVariantNumeric: 'tabular-nums' }}>{time}</td>
                    <td className="px-5 py-3.5" style={{ fontSize: 14, fontWeight: 500, color: '#191c1d' }}>{s.products?.name}</td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <span className="inline-block px-2.5 py-1 rounded-full"
                        style={{ background: '#e8def8', color: '#686177', fontSize: 11, fontWeight: 500 }}>
                        {s.products?.categories?.name}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right" style={{ fontSize: 14, color: '#191c1d' }}>{s.quantity}</td>
                    <td className="px-5 py-3.5 text-right hidden sm:table-cell" style={{ fontSize: 13, color: '#444748' }}>{Number(s.unit_price).toFixed(2)}</td>
                    <td className="px-5 py-3.5 text-right" style={{ fontSize: 14, fontWeight: 600, color: '#191c1d' }}>{Number(s.total).toFixed(2)}</td>
                    <td className="px-5 py-3.5 text-right">
                      <button onClick={() => handleDelete(s.id)} disabled={deleting === s.id}
                        style={{ fontSize: 12, color: '#ba1a1a', background: 'none', border: 'none', cursor: deleting === s.id ? 'wait' : 'pointer', opacity: deleting === s.id ? 0.4 : 1 }}>
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
            {/* Totals footer */}
            <tfoot style={{ borderTop: '2px solid #c4c7c7', background: '#f9f4da' }}>
              <tr>
                <td colSpan={5} className="px-5 py-3.5 hidden sm:table-cell text-right"
                  style={{ fontSize: 13, fontWeight: 600, color: '#444748' }}>
                  Day Total
                </td>
                <td colSpan={3} className="px-5 py-3.5 sm:hidden"
                  style={{ fontSize: 13, fontWeight: 600, color: '#444748' }}>
                  Day Total
                </td>
                <td className="px-5 py-3.5 text-right" style={{ fontSize: 16, fontWeight: 700, color: '#191c1d' }}>
                  {total.toFixed(2)}
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  )
}
