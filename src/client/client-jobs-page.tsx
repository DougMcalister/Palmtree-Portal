import { useMemo, useState } from 'react'
import ClientDashboardHeader from './client-dashboard-header'
import { purchaseOrderDatabase, supplierDatabase, workOrderDatabase } from '../local-database'

type OrderTypeFilter = 'all' | 'work' | 'purchase'

type ClientOrderRecord = {
  id: string
  number: string
  type: Exclude<OrderTypeFilter, 'all'>
  typeLabel: string
  category: string
  supplier: string
  due: string
}

const supplierNames = new Map(supplierDatabase.map((supplier) => [supplier.id, supplier.name]))

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

function createClientOrderRows() {
  const workOrderRows = workOrderDatabase.map((job) => ({
    id: job.jobNo,
    number: job.jobNo,
    type: 'work',
    typeLabel: 'Work Order',
    category: job.category,
    supplier: supplierNames.get(job.supplier_id) ?? 'Unknown supplier',
    due: job.due,
  })) satisfies ClientOrderRecord[]

  const purchaseOrderRows = purchaseOrderDatabase.map((order) => ({
    id: order.orderNo,
    number: order.orderNo,
    type: 'purchase',
    typeLabel: 'Purchase Order',
    category: order.category,
    supplier: supplierNames.get(order.supplier_id) ?? 'Unknown supplier',
    due: order.due,
  })) satisfies ClientOrderRecord[]

  return [...workOrderRows, ...purchaseOrderRows].sort((firstOrder, secondOrder) => firstOrder.due.localeCompare(secondOrder.due))
}

const clientOrderRows = createClientOrderRows()
const clientOrderCategories = Array.from(new Set(clientOrderRows.map((order) => order.category))).sort()

const typeOptions: Array<{ label: string; value: OrderTypeFilter }> = [
  { label: 'All', value: 'all' },
  { label: 'Work Orders', value: 'work' },
  { label: 'Purchase Orders', value: 'purchase' },
]

function ClientJobsPage() {
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false)
  const [activeTypeFilter, setActiveTypeFilter] = useState<OrderTypeFilter>('all')
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all')

  const displayedOrders = useMemo(
    () =>
      clientOrderRows.filter((order) => {
        const typeMatches = activeTypeFilter === 'all' || order.type === activeTypeFilter
        const categoryMatches = activeCategoryFilter === 'all' || order.category === activeCategoryFilter

        return typeMatches && categoryMatches
      }),
    [activeCategoryFilter, activeTypeFilter],
  )

  return (
    <main className="client-dashboard-page">
      <ClientDashboardHeader />

      <section className="client-suppliers-panel" aria-labelledby="client-jobs-title">
        <div className="client-jobs-heading-row">
          <h1 id="client-jobs-title">Jobs</h1>

          <div className="client-filter-menu-wrap">
            <button
              className={'client-filter-button ' + (isFilterMenuOpen ? 'is-active' : '')}
              type="button"
              aria-expanded={isFilterMenuOpen}
              aria-controls="client-jobs-filter-menu"
              onClick={() => setIsFilterMenuOpen((currentValue) => !currentValue)}
            >
              <FilterIcon />
              <span>Filter</span>
            </button>

            {isFilterMenuOpen ? (
              <div className="client-filter-menu" id="client-jobs-filter-menu">
                <fieldset className="client-filter-group">
                  <legend>Type</legend>
                  {typeOptions.map((option) => (
                    <button
                      className={activeTypeFilter === option.value ? 'is-active' : ''}
                      key={option.value}
                      type="button"
                      onClick={() => setActiveTypeFilter(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </fieldset>

                <fieldset className="client-filter-group">
                  <legend>Category</legend>
                  <button
                    className={activeCategoryFilter === 'all' ? 'is-active' : ''}
                    type="button"
                    onClick={() => setActiveCategoryFilter('all')}
                  >
                    All
                  </button>
                  {clientOrderCategories.map((category) => (
                    <button
                      className={activeCategoryFilter === category ? 'is-active' : ''}
                      key={category}
                      type="button"
                      onClick={() => setActiveCategoryFilter(category)}
                    >
                      {category}
                    </button>
                  ))}
                </fieldset>
              </div>
            ) : null}
          </div>
        </div>

        <div className="client-supplier-table-wrap">
          <table className="client-supplier-table client-jobs-table">
            <caption>Client work order and purchase order records</caption>
            <thead>
              <tr>
                <th scope="col">Job / Order Number</th>
                <th scope="col">Type</th>
                <th scope="col">Category</th>
                <th scope="col">Supplier</th>
                <th scope="col">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {displayedOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.number}</td>
                  <td>{order.typeLabel}</td>
                  <td>{order.category}</td>
                  <td>{order.supplier}</td>
                  <td>{order.due}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}

export default ClientJobsPage
