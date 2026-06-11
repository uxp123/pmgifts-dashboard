import { useState } from 'react'
import Categories from './components/Categories'
import Products from './components/Products'
import RecordSale from './components/RecordSale'
import WeeklySales from './components/WeeklySales'
import './index.css'

const TABS = [
  { id: 'record', label: 'Record Sale' },
  { id: 'weekly', label: 'Weekly Sales' },
  { id: 'products', label: 'Products' },
  { id: 'categories', label: 'Categories' },
]

export default function App() {
  const [tab, setTab] = useState('record')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🛍️</span>
              <span className="font-bold text-gray-800 text-lg">PM Gifts</span>
            </div>

            {/* Desktop nav */}
            <nav className="hidden sm:flex gap-1">
              {TABS.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    tab === t.id
                      ? 'bg-emerald-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </nav>

            {/* Mobile menu button */}
            <button
              className="sm:hidden text-gray-600 hover:text-gray-800 p-2"
              onClick={() => setMobileMenuOpen(o => !o)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>

          {/* Mobile dropdown */}
          {mobileMenuOpen && (
            <div className="sm:hidden pb-3 border-t border-gray-100 pt-2 flex flex-col gap-1">
              {TABS.map(t => (
                <button
                  key={t.id}
                  onClick={() => { setTab(t.id); setMobileMenuOpen(false) }}
                  className={`text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    tab === t.id
                      ? 'bg-emerald-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {tab === 'record' && <RecordSale onSaleRecorded={() => {}} />}
        {tab === 'weekly' && <WeeklySales />}
        {tab === 'products' && <Products />}
        {tab === 'categories' && <Categories />}
      </main>
    </div>
  )
}
