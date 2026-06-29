import { useMemo } from 'react'
import { useParams } from 'react-router'
import ClientDashboardHeader from './client-dashboard-header'
import {
  purchaseOrderDatabase,
  supplierDatabase,
  workOrderDatabase,
  type PurchaseOrder,
  type WorkOrder,
} from '../local-database'

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const lineChartSize = {
  width: 760,
  height: 330,
  left: 58,
  right: 24,
  top: 28,
  bottom: 54,
}

type ContributorKey = 'transport_comp' | 'equipment_comp' | 'waste_comp' | 'utility_comp'

type Contributor = {
  key: ContributorKey
  label: string
  color: string
}

const contributors: Contributor[] = [
  { key: 'transport_comp', label: 'Transport', color: '#287e22' },
  { key: 'equipment_comp', label: 'Equipment', color: '#aaf194' },
  { key: 'waste_comp', label: 'Waste', color: '#00bf05' },
  { key: 'utility_comp', label: 'Utilities', color: '#48e800' },
]

function roundToTwo(value: number) {
  return Number(value.toFixed(2))
}

function getMonthIndex(date: string) {
  return new Date(date + 'T00:00:00').getMonth()
}

function sumMonthlyEmissions(workOrders: WorkOrder[], purchaseOrders: PurchaseOrder[]) {
  const totals = monthLabels.map((month) => ({ month, workOrders: 0, purchaseOrders: 0, total: 0 }))

  workOrders.forEach((order) => {
    const monthIndex = getMonthIndex(order.due)
    totals[monthIndex].workOrders += order.emissions
    totals[monthIndex].total += order.emissions
  })

  purchaseOrders.forEach((order) => {
    const monthIndex = getMonthIndex(order.due)
    totals[monthIndex].purchaseOrders += order.emissions
    totals[monthIndex].total += order.emissions
  })

  return totals.map((entry) => ({
    ...entry,
    workOrders: roundToTwo(entry.workOrders),
    purchaseOrders: roundToTwo(entry.purchaseOrders),
    total: roundToTwo(entry.total),
  }))
}

function SupplierEmissionsLineChart({
  monthlyEmissions,
}: {
  monthlyEmissions: ReturnType<typeof sumMonthlyEmissions>
}) {
  const chartWidth = lineChartSize.width - lineChartSize.left - lineChartSize.right
  const chartHeight = lineChartSize.height - lineChartSize.top - lineChartSize.bottom
  const maxValue = Math.max(1, ...monthlyEmissions.map((entry) => entry.total))
  const axisMax = Math.ceil(maxValue * 1.2 * 10) / 10
  const ticks = [0, axisMax / 2, axisMax]

  const points = monthlyEmissions.map((entry, index) => {
    const x = lineChartSize.left + (chartWidth / (monthlyEmissions.length - 1)) * index
    const y = lineChartSize.top + chartHeight - (entry.total / axisMax) * chartHeight

    return { ...entry, x, y }
  })

  const pathPoints = points.map((point) => point.x + ',' + point.y).join(' ')

  return (
    <article className="supplier-analytics-card supplier-line-card" aria-label="Supplier annual emissions output">
      <div className="supplier-analytics-card-header">
        <h3>Annual Emissions Output</h3>
        <span>kg CO2-e per AUD</span>
      </div>

      <svg className="supplier-line-chart" viewBox={'0 0 ' + lineChartSize.width + ' ' + lineChartSize.height} role="img">
        <title>Monthly emissions from matching work orders and purchase orders</title>
        {ticks.map((tick) => {
          const y = lineChartSize.top + chartHeight - (tick / axisMax) * chartHeight

          return (
            <g key={tick}>
              <line className="supplier-chart-grid" x1={lineChartSize.left} x2={lineChartSize.width - lineChartSize.right} y1={y} y2={y} />
              <text className="supplier-chart-axis-label" x={lineChartSize.left - 10} y={y + 5} textAnchor="end">
                {tick.toFixed(1)}
              </text>
            </g>
          )
        })}

        {points.map((point) => (
          <line
            key={'month-grid-' + point.month}
            className="supplier-chart-grid"
            x1={point.x}
            x2={point.x}
            y1={lineChartSize.top}
            y2={lineChartSize.top + chartHeight}
          />
        ))}

        <line className="supplier-chart-axis" x1={lineChartSize.left} x2={lineChartSize.width - lineChartSize.right} y1={lineChartSize.top + chartHeight} y2={lineChartSize.top + chartHeight} />
        <line className="supplier-chart-axis" x1={lineChartSize.left} x2={lineChartSize.left} y1={lineChartSize.top} y2={lineChartSize.top + chartHeight} />

        <polyline className="supplier-line-chart-shadow" points={pathPoints} />
        <polyline className="supplier-line-chart-line" points={pathPoints} />

        {points.map((point) => (
          <g key={point.month}>
            <circle className="supplier-line-chart-point" cx={point.x} cy={point.y} r="4.5" />
            <text className="supplier-chart-axis-label" x={point.x} y={lineChartSize.top + chartHeight + 28} textAnchor="middle">
              {point.month}
            </text>
          </g>
        ))}
      </svg>
    </article>
  )
}

function SupplierContributorPie({ workOrders }: { workOrders: WorkOrder[] }) {
  const contributionTotals = contributors.map((contributor) => ({
    ...contributor,
    value: roundToTwo(workOrders.reduce((total, order) => total + order[contributor.key], 0)),
  }))
  const totalContribution = contributionTotals.reduce((total, contribution) => total + contribution.value, 0)

  const contributionPercentages = contributionTotals.map((contribution) =>
    totalContribution > 0 ? (contribution.value / totalContribution) * 100 : 0,
  )
  const gradientStops = contributionTotals
    .map((contribution, index) => {
      const start = contributionPercentages.slice(0, index).reduce((total, percentage) => total + percentage, 0)
      const end = start + contributionPercentages[index]

      return contribution.color + ' ' + start + '% ' + end + '%'
    })
    .join(', ')

  return (
    <article className="supplier-analytics-card supplier-pie-card" aria-label="Work order emission contributors">
      <div className="supplier-analytics-card-header">
        <h3>Work Order Contributors</h3>
        <span>Component split</span>
      </div>

      {totalContribution > 0 ? (
        <div className="supplier-pie-layout">
          <div
            className="supplier-pie-chart"
            aria-label="Work order emission contribution pie chart"
            style={{ background: 'conic-gradient(' + gradientStops + ')' }}
          >
            <span />
          </div>

          <ul className="supplier-pie-legend">
            {contributionTotals.map((contribution) => (
              <li key={contribution.key}>
                <span style={{ backgroundColor: contribution.color }} />
                <strong>{contribution.label}</strong>
                <em>{((contribution.value / totalContribution) * 100).toFixed(1)}%</em>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="supplier-empty-analytics">No matching work order emissions yet.</p>
      )}
    </article>
  )
}

function ClientSupplierDetails() {
  const { supplierId } = useParams()

  const supplier = supplierDatabase.find((record) => record.id === supplierId)

  const supplierWorkOrders = useMemo(
    () => workOrderDatabase.filter((workOrder) => workOrder.supplier_id === supplierId),
    [supplierId],
  )
  const supplierPurchaseOrders = useMemo(
    () => purchaseOrderDatabase.filter((purchaseOrder) => purchaseOrder.supplier_id === supplierId),
    [supplierId],
  )
  const monthlyEmissions = useMemo(
    () => sumMonthlyEmissions(supplierWorkOrders, supplierPurchaseOrders),
    [supplierWorkOrders, supplierPurchaseOrders],
  )
  const annualEmissionsTotal = monthlyEmissions.reduce((total, entry) => total + entry.total, 0)

  if (!supplier) {
    return (
      <main className="client-dashboard-page">
        <ClientDashboardHeader />
        <section className="supplier-info-card">
          <h1>Supplier not found</h1>
        </section>
      </main>
    )
  }

  return (
    <main className="client-dashboard-page">
      <ClientDashboardHeader />

      <section className="supplier-info-card">
        <div className="supplier-heading">
          <h1 id="supplier-name">{supplier.name}</h1>
          <p id="supplier-category">{supplier.category}</p>
        </div>
        <dl className="supplier-summary-metrics" aria-label="Supplier emissions summary">
          <div>
            <dt>Annual Output</dt>
            <dd>{roundToTwo(annualEmissionsTotal)} kg/$</dd>
          </div>
          <div>
            <dt>Work Orders</dt>
            <dd>{supplierWorkOrders.length}</dd>
          </div>
          <div>
            <dt>Purchase Orders</dt>
            <dd>{supplierPurchaseOrders.length}</dd>
          </div>
        </dl>
      </section>

      <section className="client-supplier-table-wrap supplier-detail-tables" aria-label="Supplier order records">
        <table className="client-supplier-table supplier-detail-table">
          <caption>{supplier.name} Work Orders</caption>
          <thead>
            <tr>
              <th scope="col">Job Number</th>
              <th scope="col">Category</th>
              <th scope="col">Emissions</th>
              <th scope="col">Date</th>
            </tr>
          </thead>
          <tbody>
            {supplierWorkOrders.map((workOrder) => (
              <tr key={workOrder.jobNo}>
                <td>{workOrder.jobNo}</td>
                <td>{workOrder.category}</td>
                <td>{workOrder.emissions} kg/$</td>
                <td>{workOrder.due}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <table className="client-supplier-table supplier-detail-table">
          <caption>{supplier.name} Purchase Orders</caption>
          <thead>
            <tr>
              <th scope="col">Order Number</th>
              <th scope="col">Category</th>
              <th scope="col">Emissions</th>
              <th scope="col">Date</th>
            </tr>
          </thead>
          <tbody>
            {supplierPurchaseOrders.map((purchaseOrder) => (
              <tr key={purchaseOrder.orderNo}>
                <td>{purchaseOrder.orderNo}</td>
                <td>{purchaseOrder.category}</td>
                <td>{purchaseOrder.emissions} kg/$</td>
                <td>{purchaseOrder.due}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="supplier-analytics-pane" aria-labelledby="supplier-analytics-title">
        <div className="supplier-analytics-heading">
          <h2 id="supplier-analytics-title">Emissions Analytics</h2>
          <p>Matching supplier ID: {supplier.id}</p>
        </div>

        <div className="supplier-analytics-grid">
          <SupplierEmissionsLineChart monthlyEmissions={monthlyEmissions} />
          <SupplierContributorPie workOrders={supplierWorkOrders} />
        </div>
      </section>
    </main>
  )
}

export default ClientSupplierDetails
