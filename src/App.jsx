import { useState } from 'react'
import Overview from './components/Overview'
import Categories from './components/Categories'
import Products from './components/Products'
import RecordSale from './components/RecordSale'
import WeeklySales from './components/WeeklySales'
import DailySales from './components/DailySales'
import './index.css'

const PROTECTED = ['products', 'categories']
const CORRECT_PASSWORD = 'ilovemyhubby@1973'

const OverviewIcon = ({ active }) => (
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth={active ? 2 : 1.8} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>
  </svg>
)
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
const LockIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{ display: 'inline', marginLeft: 4, verticalAlign: 'middle', opacity: 0.5 }}>
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
)

const TABS = [
  { id: 'overview',   label: 'Overview',    Icon: OverviewIcon },
  { id: 'record',     label: 'Record Sale', Icon: SaleIcon },
  { id: 'daily',      label: 'Daily',       Icon: DayIcon },
  { id: 'weekly',     label: 'Weekly',      Icon: WeekIcon },
  { id: 'products',   label: 'Products',    Icon: ProductIcon,  locked: true },
  { id: 'categories', label: 'Categories',  Icon: CategoryIcon, locked: true },
]

const SIDEBAR_BG   = '#1c1b1b'
const ACTIVE_COLOR = '#ffffff'
const MUTED_COLOR  = '#858383'

function PasswordModal({ targetTab, onSuccess, onCancel }) {
  const [pw, setPw] = useState('')
  const [error, setError] = useState(false)
  const [show, setShow] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (pw === CORRECT_PASSWORD) {
      onSuccess()
    } else {
      setError(true)
      setPw('')
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}>
      <div className="rounded-2xl p-8 w-full mx-4"
        style={{ maxWidth: 360, background: '#fff', boxShadow: '0 20px 60px rgba(0,0,0,0.18)' }}>
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
            style={{ background: '#1c1b1b' }}>
            <svg width="22" height="22" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#191c1d', marginBottom: 4 }}>Protected Section</h2>
          <p style={{ fontSize: 13, color: '#444748', textAlign: 'center' }}>
            Enter the password to access <strong>{targetTab === 'products' ? 'Products' : 'Categories'}</strong>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div style={{ position: 'relative' }}>
            <input
              type={show ? 'text' : 'password'}
              value={pw}
              onChange={e => { setPw(e.target.value); setError(false) }}
              placeholder="Enter password…"
              autoFocus
              style={{
                border: `1px solid ${error ? '#ba1a1a' : '#c4c7c7'}`, borderRadius: 12,
                padding: '11px 44px 11px 16px', fontSize: 15, color: '#191c1d',
                background: error ? '#fff8f7' : '#fff', width: '100%', boxSizing: 'border-box',
                outline: 'none',
              }}
            />
            <button type="button" onClick={() => setShow(s => !s)}
              style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#858383', fontSize: 12, fontWeight: 500 }}>
              {show ? 'Hide' : 'Show'}
            </button>
          </div>
          {error && <p style={{ fontSize: 12, color: '#ba1a1a', marginTop: -8 }}>Incorrect password. Try again.</p>}

          <div className="flex gap-3">
            <button type="button" onClick={onCancel}
              style={{ flex: 1, padding: '11px', borderRadius: 12, fontSize: 14, fontWeight: 500, background: 'none', border: '1px solid #c4c7c7', color: '#444748', cursor: 'pointer' }}>
              Cancel
            </button>
            <button type="submit"
              style={{ flex: 1, padding: '11px', borderRadius: 12, fontSize: 14, fontWeight: 600, background: '#000', color: '#fff', border: 'none', cursor: 'pointer' }}>
              Unlock
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function App() {
  const [tab, setTab] = useState('overview')
  const [unlocked, setUnlocked] = useState(false)
  const [pendingTab, setPendingTab] = useState(null)
  const current = TABS.find(t => t.id === tab)

  function handleTabClick(id) {
    if (PROTECTED.includes(id) && !unlocked) {
      setPendingTab(id)
    } else {
      setTab(id)
    }
  }

  function handleUnlock() {
    setUnlocked(true)
    setTab(pendingTab)
    setPendingTab(null)
  }

  function handleCancel() {
    setPendingTab(null)
  }

  return (
    <div className="min-h-screen flex" style={{ background: '#f8f9fa', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {pendingTab && (
        <PasswordModal targetTab={pendingTab} onSuccess={handleUnlock} onCancel={handleCancel} />
      )}

      {/* ── Desktop sidebar ── */}
      <aside
        className="hidden sm:flex fixed inset-y-0 left-0 flex-col items-center py-6 gap-1 z-50"
        style={{ width: 100, background: SIDEBAR_BG }}
      >
        <div className="mb-5 flex flex-col items-center gap-1">
          <span className="text-2xl">🛍️</span>
          <span className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: MUTED_COLOR }}>PM</span>
        </div>

        {TABS.map(({ id, label, Icon, locked }) => {
          const active = tab === id
          return (
            <button
              key={id}
              onClick={() => handleTabClick(id)}
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
              <span className="text-[10px] font-medium leading-tight text-center">
                {label}{locked && !unlocked && <LockIcon />}
              </span>
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
            {tab === 'overview'   && <Overview onNavigate={handleTabClick} />}
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
              onClick={() => handleTabClick(id)}
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
