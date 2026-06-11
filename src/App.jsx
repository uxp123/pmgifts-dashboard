import { useState } from 'react'
import Categories from './components/Categories'
import Products from './components/Products'
import RecordSale from './components/RecordSale'
import WeeklySales from './components/WeeklySales'
import DailySales from './components/DailySales'
import './index.css'

const SaleIcon = ({ active }) => (
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.8} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
  </svg>
)
const DayIcon = ({ active }) => (
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.8} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
)
const WeekIcon = ({ active }) => (
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.8} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)
const ProductIcon = ({ active }) => (
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.8} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><line x1="12" y1="22" x2="12" y2="12"/>
  </svg>
)
const CategoryIcon = ({ active }) => (
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.8} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
)

const TABS = [
  { id: 'record',     label: 'Record Sale', Icon: SaleIcon },
  { id: 'daily',      label: 'Daily',       Icon: DayIcon },
  { id: 'weekly',     label: 'Weekly',      Icon: WeekIcon },
  { id: 'products',   label: 'Products',    Icon: ProductIcon },
  { id: 'categories', label: 'Categories',  Icon: CategoryIcon },
]

const SIDEBAR_BG   = '#1c1b1b'
const ACTIVE_COLOR = '#ffffff'
const MUTED_COLOR  = '#858383'

export default function App() {
  const [tab, setTab] = useState('record')
  const current = TABS.find(t => t.id === tab)

  return (
    <div className="min-h-screen flex" style={{ background: '#f8f9fa', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ── Desktop sidebar ── */}
      <aside
        className="hidden sm:flex fixed inset-y-0 left-0 flex-col items-center py-6 gap-1 z-50"
        style={{ width: 100, background: SIDEBAR_BG }}
      >
        <div className="mb-5 flex flex-col items-center gap-1">
          <span className="text-2xl">🛍️</span>
          <span className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: MUTED_COLOR }}>PM</span>
        </div>

        {TABS.map(({ id, label, Icon }) => {
          const active = tab === id
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              className="flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all"
              style={{
                width: 84,
                color: active ? ACTIVE_COLOR : MUTED_COLOR,
                background: active ? 'rgba(255,255,255,0.1)' : 'transparent',
              }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
            >
              <Icon active={active} />
              <span className="text-[10px] font-medium leading-tight text-center">{label}</span>
            </button>
          )
        })}
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 min-h-screen pb-24 sm:pb-0">
        <div className="sm:ml-[100px]">
          <div
            className="sticky top-0 z-40 px-6 sm:px-8 py-4 flex items-center gap-3 border-b"
            style={{ background: '#f8f9fa', borderColor: '#c4c7c7' }}
          >
            <span className="sm:hidden text-xl">🛍️</span>
            <h1 className="font-semibold" style={{ fontSize: 20, lineHeight: '28px', color: '#191c1d' }}>
              {current.label}
            </h1>
          </div>

          <div className="px-6 sm:px-8 py-8 max-w-4xl mx-auto">
            {tab === 'record'     && <RecordSale />}
            {tab === 'daily'      && <DailySales />}
            {tab === 'weekly'     && <WeeklySales />}
            {tab === 'products'   && <Products />}
            {tab === 'categories' && <Categories />}
          </div>
        </div>
      </main>

      {/* ── Mobile bottom nav ── */}
      <nav
        className="sm:hidden fixed bottom-0 inset-x-0 z-50 flex border-t"
        style={{ background: SIDEBAR_BG, borderColor: 'rgba(255,255,255,0.08)' }}
      >
        {TABS.map(({ id, label, Icon }) => {
          const active = tab === id
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              className="flex-1 flex flex-col items-center gap-1 py-3 transition-colors"
              style={{ color: active ? ACTIVE_COLOR : MUTED_COLOR }}
            >
              <Icon active={active} />
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
