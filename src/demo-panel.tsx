import { useEffect, useSyncExternalStore } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { clearDemoSession, getStoredDemoMode, startDemoSession, subscribeDemoMode, type DemoMode } from './demo-mode.ts'

const demoOptions: DemoMode[] = ['off', 'client', 'supplier']

const demoLabels: Record<DemoMode, string> = {
  off: 'Off',
  client: 'Client',
  supplier: 'Supplier',
}

function DemoPanel() {
  const location = useLocation()
  const navigate = useNavigate()
  const activeMode = useSyncExternalStore(subscribeDemoMode, getStoredDemoMode, () => 'off')

  useEffect(() => {
    if (location.pathname === '/' && activeMode !== 'off') {
      clearDemoSession()
    }
  }, [activeMode, location.pathname])

  function handleModeSelect(mode: DemoMode) {
    if (mode === 'off') {
      clearDemoSession()

      if (location.pathname !== '/') {
        navigate('/')
      }

      return
    }

    const redirectPath = startDemoSession(mode)

    if (location.pathname !== redirectPath) {
      navigate(redirectPath)
    }
  }

  return (
    <aside className="demo-panel" aria-label="Demo mode selector">
      <div className="demo-panel-toggle" role="radiogroup" aria-label="Demo mode">
        {demoOptions.map((mode) => (
          <button
            className={`demo-panel-button ${activeMode === mode ? 'is-active' : ''}`}
            key={mode}
            type="button"
            role="radio"
            aria-checked={activeMode === mode}
            onClick={() => handleModeSelect(mode)}
          >
            {demoLabels[mode]}
          </button>
        ))}
      </div>
    </aside>
  )
}

export default DemoPanel
