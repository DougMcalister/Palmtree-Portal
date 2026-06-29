import ClientDashboardHeader from './client-dashboard-header'
import {
  purchaseOrderDatabase,
  supplierDatabase,
  workOrderDatabase,
  type PurchaseOrder,
  type WorkOrder,
} from '../local-database'

type ClientOrder = {
  id: string
  type: 'Work Order' | 'Purchase Order'
  supplierId: string
  supplier: string
  supplierCategory: string
  category: string
  due: string
  emissions: number
}

type ContributionSlice = {
  label: string
  value: number
  color: string
}

const supplierLookup = new Map(supplierDatabase.map((supplier) => [supplier.id, supplier]))
const financialYearMonths = [
  { label: 'Jun', year: 2026, monthIndex: 5 },
  { label: 'Jul', year: 2026, monthIndex: 6 },
  { label: 'Aug', year: 2026, monthIndex: 7 },
  { label: 'Sep', year: 2026, monthIndex: 8 },
  { label: 'Oct', year: 2026, monthIndex: 9 },
  { label: 'Nov', year: 2026, monthIndex: 10 },
  { label: 'Dec', year: 2026, monthIndex: 11 },
  { label: 'Jan', year: 2027, monthIndex: 0 },
  { label: 'Feb', year: 2027, monthIndex: 1 },
  { label: 'Mar', year: 2027, monthIndex: 2 },
  { label: 'Apr', year: 2027, monthIndex: 3 },
  { label: 'May', year: 2027, monthIndex: 4 },
]

const lineChartSize = {
  width: 1080,
  height: 390,
  left: 72,
  right: 34,
  top: 30,
  bottom: 62,
}

function roundToTwo(value: number) {
  return Number(value.toFixed(2))
}

function formatMetric(value: number) {
  return roundToTwo(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function toClientOrderFromWorkOrder(order: WorkOrder): ClientOrder {
  const supplier = supplierLookup.get(order.supplier_id)

  return {
    id: order.jobNo,
    type: 'Work Order',
    supplierId: order.supplier_id,
    supplier: supplier?.name ?? 'Unknown supplier',
    supplierCategory: supplier?.category ?? 'Other',
    category: order.category,
    due: order.due,
    emissions: order.emissions,
  }
}

function toClientOrderFromPurchaseOrder(order: PurchaseOrder): ClientOrder {
  const supplier = supplierLookup.get(order.supplier_id)

  return {
    id: order.orderNo,
    type: 'Purchase Order',
    supplierId: order.supplier_id,
    supplier: supplier?.name ?? 'Unknown supplier',
    supplierCategory: supplier?.category ?? 'Other',
    category: order.category,
    due: order.due,
    emissions: order.emissions,
  }
}

const clientOrders = [
  ...workOrderDatabase.map(toClientOrderFromWorkOrder),
  ...purchaseOrderDatabase.map(toClientOrderFromPurchaseOrder),
]

const monthlyTotals = financialYearMonths.map((month) => ({
  ...month,
  value: roundToTwo(
    clientOrders
      .filter((order) => {
        const dueDate = new Date(order.due + 'T00:00:00')

        return dueDate.getFullYear() === month.year && dueDate.getMonth() === month.monthIndex
      })
      .reduce((total, order) => total + order.emissions, 0),
  ),
}))

const contributorSlices: ContributionSlice[] = [
  {
    label: 'Transport',
    value: roundToTwo(workOrderDatabase.reduce((total, order) => total + order.transport_comp, 0)),
    color: '#287e22',
  },
  {
    label: 'Equipment',
    value: roundToTwo(workOrderDatabase.reduce((total, order) => total + order.equipment_comp, 0)),
    color: '#aaf194',
  },
  {
    label: 'Waste',
    value: roundToTwo(workOrderDatabase.reduce((total, order) => total + order.waste_comp, 0)),
    color: '#00bf05',
  },
  {
    label: 'Utilities',
    value: roundToTwo(workOrderDatabase.reduce((total, order) => total + order.utility_comp, 0)),
    color: '#48e800',
  },
]

const supplierCategoryTotals = Array.from(
  clientOrders.reduce((totals, order) => {
    totals.set(order.supplierCategory, roundToTwo((totals.get(order.supplierCategory) ?? 0) + order.emissions))

    return totals
  }, new Map<string, number>()),
)
  .map(([category, value]) => ({ category, value }))
  .sort((first, second) => second.value - first.value)

const topJobs = [...clientOrders].sort((first, second) => second.emissions - first.emissions).slice(0, 5)

const topSuppliers = Array.from(
  clientOrders.reduce((totals, order) => {
    const current = totals.get(order.supplierId) ?? {
      supplierId: order.supplierId,
      supplier: order.supplier,
      category: order.supplierCategory,
      value: 0,
    }

    totals.set(order.supplierId, {
      ...current,
      value: roundToTwo(current.value + order.emissions),
    })

    return totals
  }, new Map<string, { supplierId: string; supplier: string; category: string; value: number }>()),
)
  .map(([, supplier]) => supplier)
  .sort((first, second) => second.value - first.value)
  .slice(0, 5)

function TotalEmissionsLineChart() {
  const chartWidth = lineChartSize.width - lineChartSize.left - lineChartSize.right
  const chartHeight = lineChartSize.height - lineChartSize.top - lineChartSize.bottom
  const maxValue = Math.max(1, ...monthlyTotals.map((entry) => entry.value))
  const axisMax = Math.ceil(maxValue * 1.18)
  const ticks = [0, axisMax / 2, axisMax]
  const points = monthlyTotals.map((entry, index) => {
    const x = lineChartSize.left + (chartWidth / (monthlyTotals.length - 1)) * index
    const y = lineChartSize.top + chartHeight - (entry.value / axisMax) * chartHeight

    return { ...entry, x, y }
  })
  const pathPoints = points.map((point) => point.x + ',' + point.y).join(' ')

  return (
    <article className="client-analytics-card client-analytics-line-card" aria-label="Financial year total emissions">
      <div className="client-analytics-card-heading">
        <h2>Total Emissions</h2>
        <span>kg/$ by month</span>
      </div>

      <svg className="client-analytics-line-chart" viewBox={'0 0 ' + lineChartSize.width + ' ' + lineChartSize.height} role="img">
        <title>Total emissions across the financial year</title>
        {ticks.map((tick) => {
          const y = lineChartSize.top + chartHeight - (tick / axisMax) * chartHeight

          return (
            <g key={tick}>
              <line className="client-analytics-grid-line" x1={lineChartSize.left} x2={lineChartSize.width - lineChartSize.right} y1={y} y2={y} />
              <text className="client-analytics-axis-label" x={lineChartSize.left - 12} y={y + 5} textAnchor="end">
                {formatMetric(tick)}
              </text>
            </g>
          )
        })}

        {points.map((point) => (
          <line
            className="client-analytics-grid-line"
            key={'month-grid-' + point.label + point.year}
            x1={point.x}
            x2={point.x}
            y1={lineChartSize.top}
            y2={lineChartSize.top + chartHeight}
          />
        ))}

        <line className="client-analytics-axis" x1={lineChartSize.left} x2={lineChartSize.width - lineChartSize.right} y1={lineChartSize.top + chartHeight} y2={lineChartSize.top + chartHeight} />
        <line className="client-analytics-axis" x1={lineChartSize.left} x2={lineChartSize.left} y1={lineChartSize.top} y2={lineChartSize.top + chartHeight} />
        <polyline className="client-analytics-line-shadow" points={pathPoints} />
        <polyline className="client-analytics-line" points={pathPoints} />

        {points.map((point) => (
          <g key={point.label + point.year}>
            <circle className="client-analytics-line-point" cx={point.x} cy={point.y} r="5" />
            <text className="client-analytics-axis-label" x={point.x} y={lineChartSize.top + chartHeight + 28} textAnchor="middle">
              {point.label}
            </text>
          </g>
        ))}
      </svg>
    </article>
  )
}

function ContributorPieChart() {
  const total = contributorSlices.reduce((sum, slice) => sum + slice.value, 0)
  const percentages = contributorSlices.map((slice) => (total > 0 ? (slice.value / total) * 100 : 0))
  const gradient = contributorSlices
    .map((slice, index) => {
      const start = percentages.slice(0, index).reduce((sum, percentage) => sum + percentage, 0)
      const end = start + percentages[index]

      return slice.color + ' ' + start + '% ' + end + '%'
    })
    .join(', ')

  return (
    <article className="client-analytics-card" aria-label="Emission contribution breakdown">
      <div className="client-analytics-card-heading">
        <h2>Emission Contribution</h2>
        <span>Work order components</span>
      </div>

      <div className="client-analytics-pie-layout">
        <div className="client-analytics-pie" style={{ background: 'conic-gradient(' + gradient + ')' }}>
          <span />
        </div>
        <ul className="client-analytics-legend">
          {contributorSlices.map((slice, index) => (
            <li key={slice.label}>
              <span style={{ backgroundColor: slice.color }} />
              <strong>{slice.label}</strong>
              <em>{percentages[index].toFixed(1)}%</em>
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}

function SupplierCategoryBarChart() {
  const maxValue = Math.max(1, ...supplierCategoryTotals.map((entry) => entry.value))

  return (
    <article className="client-analytics-card" aria-label="Supplier category contribution">
      <div className="client-analytics-card-heading">
        <h2>Supplier Categories</h2>
        <span>kg/$ contribution</span>
      </div>

      <div className="client-analytics-bars">
        {supplierCategoryTotals.map((entry) => (
          <div className="client-analytics-bar-row" key={entry.category}>
            <span>{entry.category}</span>
            <div className="client-analytics-bar-track">
              <i style={{ width: (entry.value / maxValue) * 100 + '%' }} />
            </div>
            <strong>{formatMetric(entry.value)}</strong>
          </div>
        ))}
      </div>
    </article>
  )
}

function ClientAnalyticsPage() {
  const annualTotal = clientOrders.reduce((total, order) => total + order.emissions, 0)

  return (
    <main className="client-dashboard-page">
      <ClientDashboardHeader />

      <section className="client-analytics-panel" aria-labelledby="client-analytics-title">
        <div className="client-analytics-title-row">
          <div>
            <h1 id="client-analytics-title">Emissions Data</h1>
            <p>Financial year total: {formatMetric(annualTotal)} kg/$</p>
          </div>
        </div>

        <TotalEmissionsLineChart />

        <div className="client-analytics-chart-grid">
          <ContributorPieChart />
          <SupplierCategoryBarChart />
        </div>

        <div className="client-analytics-table-grid">
          <div className="client-supplier-table-wrap">
            <table className="client-supplier-table client-analytics-table">
              <caption>Top 5 emissions contributing jobs</caption>
              <thead>
                <tr>
                  <th scope="col">Job</th>
                  <th scope="col">Type</th>
                  <th scope="col">Supplier</th>
                  <th scope="col">kg/$</th>
                </tr>
              </thead>
              <tbody>
                {topJobs.map((job) => (
                  <tr key={job.id}>
                    <td>{job.id}</td>
                    <td>{job.type}</td>
                    <td>{job.supplier}</td>
                    <td>{formatMetric(job.emissions)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="client-supplier-table-wrap">
            <table className="client-supplier-table client-analytics-table">
              <caption>Top 5 emissions contributing suppliers</caption>
              <thead>
                <tr>
                  <th scope="col">Supplier</th>
                  <th scope="col">Category</th>
                  <th scope="col">kg/$</th>
                </tr>
              </thead>
              <tbody>
                {topSuppliers.map((supplier) => (
                  <tr key={supplier.supplierId}>
                    <td>{supplier.supplier}</td>
                    <td>{supplier.category}</td>
                    <td>{formatMetric(supplier.value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  )
}

export default ClientAnalyticsPage
