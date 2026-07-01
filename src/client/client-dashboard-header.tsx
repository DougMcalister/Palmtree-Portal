import { NavLink } from 'react-router'

const clientNavItems = [
  { label: 'Suppliers', to: '/client' },
  { label: 'Jobs', to: '/client/jobs' },
  { label: 'Emissions Data', to: '/client/analytics' },
]

function ClientDashboardHeader() {
  return (
    <header className="client-dashboard-header">
      <a className="client-city-brand" href="/client" aria-label="City of Melville client dashboard">
        <img className="app-brand-logo" src="/client-logo.svg" alt="City of Melville" />
      </a>

      <nav className="client-dashboard-nav" aria-label="Client dashboard navigation">
        {clientNavItems.map((item) => (
          <NavLink className={({ isActive }) => (isActive ? 'is-active' : undefined)}
          end={item.to === '/client'} key={item.to} to={item.to}>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <a className="client-logout" href="/">
        Logout
      </a>
    </header>
  )
}

export default ClientDashboardHeader
