export default function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full max-w-md rounded-xl border"
        style={{ background: '#fff', borderColor: '#c4c7c7', boxShadow: '0 16px 48px rgba(0,0,0,0.14)' }}>
        <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: '#c4c7c7' }}>
          <h2 className="font-semibold" style={{ fontSize: 16, color: '#191c1d' }}>{title}</h2>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-lg leading-none transition-colors"
            style={{ color: '#444748' }}
            onMouseEnter={e => e.currentTarget.style.background = '#edeeef'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>✕</button>
        </div>
        <div className="px-6 py-6">{children}</div>
      </div>
    </div>
  )
}
