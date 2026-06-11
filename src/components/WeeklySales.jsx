import { useState, useEffect } from 'react'
import * as XLSX from 'xlsx'
import { supabase } from '../lib/supabase'

function startOfWeek(date) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Monday start
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function addDays(date, n) {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

function fmtDate(d) {
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function isoDate(d) {
  return d.toISOString().slice(0, 10)
}

export default function WeeklySales() {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()))
  const [sales, setSales] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)

  const weekEnd = addDays(weekStart, 6)

  useEffect(() => { fetchSales() }, [weekStart])

  async function fetchSales() {
    setLoading(true)
    const { data } = await supabase
      .from('sales')
      .select('*, products(name, categories(name))')
      .gte('sale_date', isoDate(weekStart))
      .lte('sale_date', isoDate(weekEnd))
      .order('sale_date', { ascending: false })
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

  const total = sales.reduce((sum, s) => sum + Number(s.total), 0)

  function exportCSV() {
    const rows = sales.map(s => ({
      Date: s.sale_date,
      Product: s.products?.name,
      Category: s.products?.categories?.name,
      Qty: s.quantity,
      'Unit Price (GHS)': Number(s.unit_price).toFixed(2),
      'Total (GHS)': Number(s.total).toFixed(2),
    }))
    rows.push({ Date: '', Product: '', Category: '', Qty: '', 'Unit Price (GHS)': 'WEEK TOTAL', 'Total (GHS)': total.toFixed(2) })
    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Sales')
    XLSX.writeFile(wb, `sales_${isoDate(weekStart)}_to_${isoDate(weekEnd)}.csv`)
  }

  function exportExcel() {
    const rows = sales.map(s => ({
      Date: s.sale_date,
      Product: s.products?.name,
      Category: s.products?.categories?.name,
      Qty: s.quantity,
      'Unit Price (GHS)': Number(s.unit_price),
      'Total (GHS)': Number(s.total),
    }))
    rows.push({ Date: '', Product: '', Category: '', Qty: '', 'Unit Price (GHS)': 'WEEK TOTAL', 'Total (GHS)': total })
    const ws = XLSX.utils.json_to_sheet(rows)
    ws['!cols'] = [{ wch: 12 }, { wch: 30 }, { wch: 25 }, { wch: 6 }, { wch: 16 }, { wch: 14 }]
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Weekly Sales')
    XLSX.writeFile(wb, `sales_${isoDate(weekStart)}_to_${isoDate(weekEnd)}.xlsx`)
  }

  const isCurrentWeek = isoDate(startOfWeek(new Date())) === isoDate(weekStart)

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Weekly Sales</h1>
        {sales.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={exportCSV}
              className="border border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Export CSV
            </button>
            <button
              onClick={exportExcel}
              className="border border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Export Excel
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setWeekStart(addDays(weekStart, -7))}
          className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-600 font-bold text-lg transition-colors"
          title="Previous week"
        >
          ‹
        </button>
        <div className="flex-1 text-center">
          <div className="font-semibold text-gray-800">
            {fmtDate(weekStart)} — {fmtDate(weekEnd)}
          </div>
          {isCurrentWeek && (
            <div className="text-xs text-emerald-600 font-medium mt-0.5">Current week</div>
          )}
        </div>
        <button
          onClick={() => setWeekStart(addDays(weekStart, 7))}
          disabled={isCurrentWeek}
          className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-600 font-bold text-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="Next week"
        >
          ›
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading…</div>
      ) : sales.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-3">🧾</div>
          <div>No sales recorded for this week.</div>
        </div>
      ) : (
        <>
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-gray-600 font-semibold">Date</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-semibold">Product</th>
                  <th className="text-left px-4 py-3 text-gray-600 font-semibold hidden md:table-cell">Category</th>
                  <th className="text-right px-4 py-3 text-gray-600 font-semibold">Qty</th>
                  <th className="text-right px-4 py-3 text-gray-600 font-semibold hidden sm:table-cell">Unit (GHS)</th>
                  <th className="text-right px-4 py-3 text-gray-600 font-semibold">Total (GHS)</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sales.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{s.sale_date}</td>
                    <td className="px-4 py-3 text-gray-800 font-medium">{s.products?.name}</td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{s.products?.categories?.name}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{s.quantity}</td>
                    <td className="px-4 py-3 text-right text-gray-500 hidden sm:table-cell">
                      {Number(s.unit_price).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-800">
                      {Number(s.total).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDelete(s.id)}
                        disabled={deleting === s.id}
                        className="text-red-400 hover:text-red-600 text-xs font-medium disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t-2 border-gray-200 bg-gray-50">
                <tr>
                  <td colSpan={5} className="px-4 py-3 font-semibold text-gray-700 text-right hidden sm:table-cell">
                    Week Total
                  </td>
                  <td colSpan={2} className="px-4 py-3 font-semibold text-gray-700 text-right sm:hidden">
                    Week Total
                  </td>
                  <td className="px-4 py-3 text-right text-lg font-bold text-emerald-700">
                    {total.toFixed(2)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="mt-4 text-right text-sm text-gray-400">
            {sales.length} sale{sales.length !== 1 ? 's' : ''} this week
          </div>
        </>
      )}
    </div>
  )
}
