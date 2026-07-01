import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import ClientDashboardHeader from './client-dashboard-header'
import { supplierDatabase, workOrderDatabase } from '../local-database'

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

type WorkOrderCategory = (typeof workOrderDatabase)[number]['category']
type WorkOrderCategoryFilter = 'all' | WorkOrderCategory

const workOrderCategoryOptions = Array.from(
  new Set(workOrderDatabase.map((order) => order.category)),
).sort() as WorkOrderCategory[]

const supplierWorkOrderSearchText = new Map(
  supplierDatabase.map((supplier) => {
    const associatedWorkOrders = workOrderDatabase.filter((order) => order.supplier_id === supplier.id)
    const workOrderText = associatedWorkOrders
      .map((order) => [order.jobNo, order.client, order.category, order.description, order.due].join(' '))
      .join(' ')

    return [supplier.id, workOrderText.toLowerCase()]
  }),
)

const supplierWorkOrderCategories = new Map(
  supplierDatabase.map((supplier) => [
    supplier.id,
    new Set(workOrderDatabase.filter((order) => order.supplier_id === supplier.id).map((order) => order.category)),
  ]),
)

function ClientLandingPage() {
  const [isRanked, setIsRanked] = useState(false)
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false)
  const [activeWorkOrderCategory, setActiveWorkOrderCategory] = useState<WorkOrderCategoryFilter>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const displayedSuppliers = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase()

    const filteredSuppliers = supplierDatabase.filter((supplier) => {
      const workOrderCategories = supplierWorkOrderCategories.get(supplier.id)
      const categoryMatches =
        activeWorkOrderCategory === 'all' || Boolean(workOrderCategories?.has(activeWorkOrderCategory))
      const supplierSearchText = [
        supplier.name,
        supplier.category,
        supplier.description,
        supplier.rating.toString(),
        supplierWorkOrderSearchText.get(supplier.id) ?? '',
      ]
        .join(' ')
        .toLowerCase()
      const searchMatches = normalizedSearchTerm === '' || supplierSearchText.includes(normalizedSearchTerm)

      return categoryMatches && searchMatches
    })

    if (!isRanked) {
      return filteredSuppliers
    }

    return [...filteredSuppliers].sort((firstSupplier, secondSupplier) => secondSupplier.rating - firstSupplier.rating)
  }, [activeWorkOrderCategory, isRanked, searchTerm])

  return (
    <main className="client-dashboard-page">
      <ClientDashboardHeader />

      <section className="client-suppliers-panel" aria-labelledby="client-suppliers-title">
        <h1 id="client-suppliers-title">Suppliers</h1>

        <div className="client-supplier-tools" aria-label="Supplier tools">
          <label className="client-search">
            <span className="sr-only">Search suppliers</span>
            <input
              type="search"
              placeholder="Search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
            <SearchIcon />
          </label>

          <div className="client-filter-menu-wrap">
            <button
              className={'client-filter-button ' + (isFilterMenuOpen || activeWorkOrderCategory !== 'all' ? 'is-active' : '')}
              type="button"
              aria-expanded={isFilterMenuOpen}
              aria-controls="client-suppliers-filter-menu"
              onClick={() => setIsFilterMenuOpen((currentValue) => !currentValue)}
            >
              <FilterIcon />
              <span>Filter</span>
            </button>

            {isFilterMenuOpen ? (
              <div className="client-filter-menu" id="client-suppliers-filter-menu">
                <fieldset className="client-filter-group">
                  <legend>Work Orders</legend>
                  <button
                    className={activeWorkOrderCategory === 'all' ? 'is-active' : ''}
                    type="button"
                    onClick={() => setActiveWorkOrderCategory('all')}
                  >
                    All
                  </button>
                  {workOrderCategoryOptions.map((category) => (
                    <button
                      className={activeWorkOrderCategory === category ? 'is-active' : ''}
                      key={category}
                      type="button"
                      onClick={() => setActiveWorkOrderCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </fieldset>
              </div>
            ) : null}
          </div>

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
              {displayedSuppliers.length > 0 ? (
                displayedSuppliers.map((supplier, index) => (
                  <tr className={isRanked ? getRankClass(index) : ''} key={supplier.id}>
                    <td>
                      <Link to={'/client/supplier-details/' + supplier.id}>{supplier.name}</Link>
                    </td>
                    <td>{supplier.category}</td>
                    <td>{supplier.description}</td>
                    {isRanked ? <td>{supplier.rating.toFixed(2)}</td> : null}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={isRanked ? 4 : 3}>No suppliers match the current search or work order filter.</td>
                </tr>
              )}
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
