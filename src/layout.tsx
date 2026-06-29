function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="settings-icon">
      <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
      <path d="M19.4 15a1.8 1.8 0 0 0 .36 1.98l.06.06a2.1 2.1 0 0 1-2.97 2.97l-.06-.06a1.8 1.8 0 0 0-1.98-.36 1.8 1.8 0 0 0-1.1 1.65v.17a2.1 2.1 0 0 1-4.2 0v-.09a1.8 1.8 0 0 0-1.17-1.7 1.8 1.8 0 0 0-1.98.36l-.06.06a2.1 2.1 0 0 1-2.97-2.97l.06-.06a1.8 1.8 0 0 0 .36-1.98 1.8 1.8 0 0 0-1.65-1.1h-.17a2.1 2.1 0 0 1 0-4.2h.09a1.8 1.8 0 0 0 1.7-1.17 1.8 1.8 0 0 0-.36-1.98l-.06-.06a2.1 2.1 0 0 1 2.97-2.97l.06.06a1.8 1.8 0 0 0 1.98.36h.08A1.8 1.8 0 0 0 9.5 2.6v-.17a2.1 2.1 0 0 1 4.2 0v.09a1.8 1.8 0 0 0 1.1 1.65 1.8 1.8 0 0 0 1.98-.36l.06-.06a2.1 2.1 0 0 1 2.97 2.97l-.06.06a1.8 1.8 0 0 0-.36 1.98v.08a1.8 1.8 0 0 0 1.65 1.1h.17a2.1 2.1 0 0 1 0 4.2h-.09A1.8 1.8 0 0 0 19.4 15Z" />
    </svg>
  )
}

export function AppHeader() {
  return (
    <header className="top-nav">
      <a className="brand" href="/" aria-label="City of Melville home">
        <span className="brand-mark" aria-hidden="true">
          <span className="brand-mark-tower" />
        </span>
        <span className="brand-copy">
          <span>City of</span>
          <strong>Melville</strong>
        </span>
      </a>

      <nav className="primary-nav" aria-label="Primary navigation">
        <a href="/inventory">Inventory</a>
        <a href="/supplier/analytics">Operations</a>
        <a href="/admin">Admin</a>
      </nav>

      <button className="settings-button" type="button" aria-label="Settings">
        <SettingsIcon />
      </button>
    </header>
  )
}

export function AppFooter() {
  return <footer className="site-footer" aria-label="Site footer" />
}
