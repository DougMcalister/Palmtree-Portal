import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import ClientDashboardHeader from './client-dashboard-header'
import { supplierDatabase } from '../local-database'

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="client-icon">
      <path d="m21 21-4.3-4.3" />
      <circle cx="11" cy="11" r="7" />
    </svg>
  )
}

function FilterIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="client-icon">
      <path d="M4 7h16" />
      <path d="M4 17h16" />
      <path d="M7 4v6" />
      <path d="M17 14v6" />
      <path d="M12 10v8" />
    </svg>
  )
}

function getRankClass(index: number) {
  if (index === 0) {
    return 'rank-first'
  }

  if (index === 1) {
    return 'rank-second'
  }

  if (index === 2) {
    return 'rank-third'
  }

  return ''
}

function ClientLandingPage() {
  const [isRanked, setIsRanked] = useState(false)
  const displayedSuppliers = useMemo(() => {
    if (!isRanked) {
      return supplierDatabase
    }

    return [...supplierDatabase].sort((firstSupplier, secondSupplier) => secondSupplier.rating - firstSupplier.rating)
  }, [isRanked])

  return (
    <main className="client-dashboard-page">
      <ClientDashboardHeader />

      <section className="client-suppliers-panel" aria-labelledby="client-suppliers-title">
        <h1 id="client-suppliers-title">Suppliers</h1>

        <div className="client-supplier-tools" aria-label="Supplier tools">
          <label className="client-search">
            <span className="sr-only">Search suppliers</span>
            <input type="search" placeholder="Search" />
            <SearchIcon />
          </label>

          <button className="client-filter-button" type="button">
            <FilterIcon />
            <span>Filter</span>
          </button>

          <button
            className={'client-rank-button ' + (isRanked ? 'is-active' : '')}
            type="button"
            aria-pressed={isRanked}
            onClick={() => setIsRanked((currentValue) => !currentValue)}
          >
            Rank
          </button>
        </div>

        <div className="client-supplier-table-wrap">
          <table className={'client-supplier-table ' + (isRanked ? 'client-supplier-table-ranked' : '')}>
            <caption>{isRanked ? 'Supplier leaderboard' : 'Supplier records'}</caption>
            <thead>
              <tr>
                <th scope="col">Supplier Name</th>
                <th scope="col">Category</th>
                <th scope="col">Description</th>
                {isRanked ? <th scope="col">Rating</th> : null}
              </tr>
            </thead>
            <tbody>
              {displayedSuppliers.map((supplier, index) => (
                <tr className={isRanked ? getRankClass(index) : ''} key={supplier.id}>
                  <td>
                    <Link to={'/client/supplier-details/' + supplier.id}>{supplier.name}</Link>
                  </td>
                  <td>{supplier.category}</td>
                  <td>{supplier.description}</td>
                  {isRanked ? <td>{supplier.rating.toFixed(2)}</td> : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <nav className="client-pagination" aria-label="Supplier pagination">
          <a className="is-active" href="/client" aria-current="page">
            1
          </a>
          <a href="/client?page=2">2</a>
          <a href="/client?page=3">3</a>
        </nav>
      </section>
    </main>
  )
}

export default ClientLandingPage
