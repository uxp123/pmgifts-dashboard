import { useState, useEffect } from 'react'
import * as XLSX from 'xlsx'
import { supabase } from '../lib/supabase'

function startOfWeek(date) {
  const d = new Date(date)
  const day = d.getDay()
  d.setDate(d.getDate() - day + (day === 0 ? -6 : 1))
  d.setHours(0, 0, 0, 0); return d
}
function addDays(date, n) { const d = new Date(date); d.setDate(d.getDate() + n); return d }
function fmtDate(d) { return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) }
function isoDate(d) { return d.toISOString().slice(0, 10) }

export default function WeeklySales() {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()))
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)

  const weekEnd = addDays(weekStart, 6)
  const isCurrentWeek = isoDate(startOfWeek(new Date())) === isoDate(weekStart)

  useEffect(() => { fetchSales() }, [weekStart])

  async function fetchSales() {
    setLoading(true)
    const { data } = await supabase
      .from('sales').select('*, products(name, categories(name))')
      .gte('sale_date', isoDate(weekStart)).lte('sale_date', isoDate(weekEnd))
      .order('sale_date', { ascending: false }).order('created_at', { ascending: false })
    setSales(data || []); setLoading(false)
  }

  async function handleDelete(id) {
    if (!confirm('Delete this sale record?')) return
    setDeleting(id)
    await supabase.from('sales').delete().eq('id', id)
    setDeleting(null); fetchSales()
  }

  const total = sales.reduce((sum, s) => sum + Number(s.total), 0)

  function exportCSV() {
    const rows = sales.map(s => ({
      Date: s.sale_date, Product: s.products?.name, Category: s.products?.categories?.name,
      Qty: s.quantity, 'Unit Price (GHS)': Number(s.unit_price).toFixed(2), 'Total (GHS)': Number(s.total).toFixed(2),
    }))
    rows.push({ Date: '', Product: 'WEEK TOTAL', Category: '', Qty: '', 'Unit Price (GHS)': '', 'Total (GHS)': total.toFixed(2) })
    const ws = XLSX.utils.json_to_sheet(rows); const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Sales')
    XLSX.writeFile(wb, `sales_${isoDate(weekStart)}_to_${isoDate(weekEnd)}.csv`)
  }

  function exportExcel() {
    const rows = sales.map(s => ({
      Date: s.sale_date, Product: s.products?.name, Category: s.products?.categories?.name,
      Qty: s.quantity, 'Unit Price (GHS)': Number(s.unit_price), 'Total (GHS)': Number(s.total),
    }))
    rows.push({ Date: '', Product: 'WEEK TOTAL', Category: '', Qty: '', 'Unit Price (GHS)': '', 'Total (GHS)': total })
    const ws = XLSX.utils.json_to_sheet(rows)
    ws['!cols'] = [{ wch: 12 }, { wch: 30 }, { wch: 25 }, { wch: 6 }, { wch: 16 }, { wch: 14 }]
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Weekly Sales')
    XLSX.writeFile(wb, `sales_${isoDate(weekStart)}_to_${isoDate(weekEnd)}.xlsx`)
  }

  const navBtnStyle = {
    width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
    border: '1px solid #c4c7c7', borderRadius: 10, fontSize: 20, fontWeight: 700,
    color: '#444748', background: '#fff', cursor: 'pointer', transition: 'background 0.15s',
  }

  return (
    <div>
      {/* Week navigator */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => setWeekStart(addDays(weekStart, -7))} style={navBtnStyle}
          onMouseEnter={e => e.currentTarget.style.background = '#f3f4f5'}
          onMouseLeave={e => e.currentTarget.style.background = '#fff'}>‹</button>
        <div className="flex-1 text-center">
          <p style={{ fontSize: 15, fontWeight: 600, color: '#191c1d' }}>{fmtDate(weekStart)} — {fmtDate(weekEnd)}</p>
          {isCurrentWeek && <p style={{ fontSize: 11, color: '#625b71', fontWeight: 500, marginTop: 2 }}>Current week</p>}
        </div>
        <button onClick={() => setWeekStart(addDays(weekStart, 7))} disabled={isCurrentWeek}
          style={{ ...navBtnStyle, opacity: isCurrentWeek ? 0.25 : 1, cursor: isCurrentWeek ? 'not-allowed' : 'pointer' }}>›</button>
      </div>

      {/* Summary + export row */}
      {sales.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="sm:col-span-2 rounded-xl px-5 py-4 flex items-center justify-between border"
            style={{ background: '#e8def8', borderColor: 'rgba(98,91,113,0.15)' }}>
            <div>
              <p style={{ fontSize: 11, color: '#686177', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>Week Total</p>
              <p style={{ fontSize: 24, fontWeight: 700, color: '#191c1d' }}>GHS {total.toFixed(2)}</p>
            </div>
            <p style={{ fontSize: 14, color: '#686177' }}>{sales.length} sale{sales.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex flex-col gap-2">
            <button onClick={exportExcel}
              className="flex-1 font-medium transition-colors rounded-xl"
              style={{ background: '#000', color: '#fff', border: 'none', cursor: 'pointer', padding: '10px', fontSize: 14 }}
              onMouseEnter={e => e.currentTarget.style.background = '#1c1b1b'}
              onMouseLeave={e => e.currentTarget.style.background = '#000'}>
              Export Excel
            </button>
            <button onClick={exportCSV}
              className="flex-1 font-medium transition-colors rounded-xl"
              style={{ background: '#e7e8e9', color: '#444748', border: '1px solid #c4c7c7', cursor: 'pointer', padding: '10px', fontSize: 14 }}
              onMouseEnter={e => e.currentTarget.style.background = '#e1e3e4'}
              onMouseLeave={e => e.currentTarget.style.background = '#e7e8e9'}>
              Export CSV
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-16" style={{ color: '#444748', fontSize: 14 }}>Loading…</div>
      ) : sales.length === 0 ? (
        <div className="text-center py-20">
          <div style={{ fontSize: 48, marginBottom: 12 }}>🧾</div>
          <p style={{ fontSize: 14, color: '#444748' }}>No sales recorded for this week.</p>
        </div>
      ) : (
        <div className="rounded-xl overflow-hidden border"
          style={{ background: '#fff', borderColor: '#c4c7c7', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
          <table className="w-full">
            <thead style={{ background: '#f3f4f5', borderBottom: '1px solid #c4c7c7' }}>
              <tr>
                {[
                  { label: 'Date', cls: '' },
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
              {sales.map((s, idx) => (
                <tr key={s.id}
                  style={{ borderTop: idx > 0 ? '1px solid rgba(196,199,199,0.35)' : 'none' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f3f4f5'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td className="px-5 py-3.5 whitespace-nowrap" style={{ fontSize: 13, color: '#444748' }}>{s.sale_date}</td>
                  <td className="px-5 py-3.5" style={{ fontSize: 14, fontWeight: 500, color: '#191c1d' }}>{s.products?.name}</td>
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    <span className="inline-block px-2.5 py-1 rounded-full"
                      style={{ background: '#edeeef', color: '#444748', fontSize: 11, fontWeight: 500 }}>
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
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
