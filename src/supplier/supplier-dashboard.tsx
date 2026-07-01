import { useMemo, useState } from 'react'
import { AppFooter, SupplierHeader } from './supplier-header.tsx'
import { emissionsDatabase, inventoryDatabase, sampleSupplierId, workOrdersDatabase } from '../local-database.ts'

type HomeTableMode = 'orders' | 'inventory'

const lineChartSize = {
  width: 700,
  height: 430,
  left: 64,
  right: 34,
  top: 28,
  bottom: 62,
}

const yAxisTicks = [0, 8000, 16000, 24000, 32000, 40000]

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="icon">
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  )
}

function EmissionsDonut() {
  const [transport, equipment, waste] = emissionsDatabase.categoryContributions
  const equipmentStart = transport.contribution
  const wasteStart = transport.contribution + equipment.contribution
  const utilitiesStart = wasteStart + waste.contribution

  return (
    <article className="emissions-card emissions-donut-card" aria-label="Emission contribution by category">
      <p className="chart-unit chart-unit-donut">Unit: %</p>
      <div className="donut-wrap">
        <div
          className="donut-chart"
          aria-label="Transport 39.86 percent, Equipment 18.35 percent, Waste 32.67 percent, Utilities 9.12 percent"
          style={{
            background: `conic-gradient(${transport.color} 0% ${transport.contribution}%, ${equipment.color} ${equipmentStart}% ${wasteStart}%, ${waste.color} ${wasteStart}% ${utilitiesStart}%, ${emissionsDatabase.categoryContributions[3].color} ${utilitiesStart}% 100%)`,
          }}
        >
          <span />
        </div>

        <div className="donut-label donut-label-utilities">
          <span>Utilities</span>
          <strong>9.12</strong>
        </div>
        <div className="donut-label donut-label-waste">
          <span>Waste</span>
          <strong>32.67</strong>
        </div>
        <div className="donut-label donut-label-transport">
          <span>Transport</span>
          <strong>39.86</strong>
        </div>
        <div className="donut-label donut-label-equipment">
          <span>Equipment</span>
          <strong>18.35</strong>
        </div>
      </div>

      <ul className="emissions-legend" aria-label="Emission contribution legend">
        {emissionsDatabase.categoryContributions.map((category) => (
          <li key={category.name}>
            <span style={{ backgroundColor: category.color }} />
            {category.name}
          </li>
        ))}
      </ul>
    </article>
  )
}

function EmissionsLineChart() {
  const chartWidth = lineChartSize.width - lineChartSize.left - lineChartSize.right
  const chartHeight = lineChartSize.height - lineChartSize.top - lineChartSize.bottom
  const maxValue = 40000

  const points = emissionsDatabase.monthlyEmissions.map((entry, index) => {
    const x = lineChartSize.left + (chartWidth / (emissionsDatabase.monthlyEmissions.length - 1)) * index
    const y = lineChartSize.top + chartHeight - (entry.kilograms / maxValue) * chartHeight
    return { ...entry, x, y }
  })

  const pathPoints = points.map((point) => `${point.x},${point.y}`).join(' ')

  return (
    <article className="emissions-card emissions-line-card" aria-label="Monthly total emissions">
      <p className="chart-unit chart-unit-line">Unit: kg</p>
      <svg className="line-chart" viewBox={`0 0 ${lineChartSize.width} ${lineChartSize.height}`} role="img">
        <title>FY25-26 monthly emissions total 292000 kg</title>
        {yAxisTicks.map((tick) => {
          const y = lineChartSize.top + chartHeight - (tick / maxValue) * chartHeight
          return (
            <g key={tick}>
              <line className="chart-grid-line" x1={lineChartSize.left} x2={lineChartSize.width - lineChartSize.right} y1={y} y2={y} />
              <text className="chart-axis-label" x={lineChartSize.left - 10} y={y + 5} textAnchor="end">
                {tick}
              </text>
            </g>
          )
        })}

        {points.map((point) => (
          <line
            key={`month-grid-${point.month}`}
            className="chart-grid-line"
            x1={point.x}
            x2={point.x}
            y1={lineChartSize.top}
            y2={lineChartSize.top + chartHeight}
          />
        ))}

        <line className="chart-axis" x1={lineChartSize.left} x2={lineChartSize.width - lineChartSize.right} y1={lineChartSize.top + chartHeight} y2={lineChartSize.top + chartHeight} />
        <line className="chart-axis" x1={lineChartSize.left} x2={lineChartSize.left} y1={lineChartSize.top} y2={lineChartSize.top + chartHeight} />

        <polyline className="line-chart-shadow" points={pathPoints} />
        <polyline className="line-chart-line" points={pathPoints} />

        {points.map((point) => (
          <g key={point.month}>
            <circle className="line-chart-point" cx={point.x} cy={point.y} r="4.5" />
            <text className="chart-axis-label" x={point.x} y={lineChartSize.top + chartHeight + 26} textAnchor="middle">
              {point.month}
            </text>
          </g>
        ))}

        <g className="chart-key" transform={`translate(${lineChartSize.left + chartWidth / 2 - 34} ${lineChartSize.height - 18})`}>
          <line x1="0" x2="20" y1="0" y2="0" />
          <circle cx="10" cy="0" r="4" />
          <text x="28" y="5">FY25-26</text>
        </g>
      </svg>
    </article>
  )
}

function SupplierDashboard() {
  const [activeTable, setActiveTable] = useState<HomeTableMode>('orders')
  const totalEmissionsKg = useMemo(
    () => emissionsDatabase.monthlyEmissions.reduce((total, entry) => total + entry.kilograms, 0),
    [],
  )

  const isOrders = activeTable === 'orders'

  return (
    <main className="homepage home-dashboard" aria-label="City of Melville dashboard">
      <SupplierHeader />

      <section className="emissions-summary" aria-label="Emissions summary">
        <EmissionsDonut />
        <EmissionsLineChart />
        <p className="total-emissions">Total emissions: {totalEmissionsKg.toLocaleString()} kg</p>
      </section>

      <section className="home-table-section" aria-label="Dashboard table">
        <div className="home-table-toggle" role="tablist" aria-label="Dashboard table type">
          <button
            className={`home-toggle-button ${isOrders ? 'is-active' : ''}`}
            type="button"
            role="tab"
            aria-selected={isOrders}
            onClick={() => setActiveTable('orders')}
          >
            Orders
          </button>
          <button
            className={`home-toggle-button ${!isOrders ? 'is-active' : ''}`}
            type="button"
            role="tab"
            aria-selected={!isOrders}
            onClick={() => setActiveTable('inventory')}
          >
            Inventory
          </button>
        </div>

        <article className="home-data-panel">
          <div className="home-data-panel-header">
            <h1>{isOrders ? 'Current Work Orders' : 'Inventory'}</h1>
            <div className={isOrders ? 'home-panel-columns home-panel-columns-orders' : 'home-panel-columns home-panel-columns-inventory'} aria-hidden="true">
              {(isOrders ? ['Job No.', 'Client', 'Description', 'Due'] : ['Name', 'Make', 'Model', 'Category']).map((column) => (
                <span key={column}>{column}</span>
              ))}
            </div>
            <a className="panel-action" href={isOrders ? '/operations' : '/inventory'}>
              <span>{isOrders ? 'Operations' : 'Inventory'}</span>
              <ArrowRightIcon />
            </a>
          </div>

          {isOrders ? (
            <table className="home-data-table home-orders-table">
              <caption>Current work orders</caption>
              <thead>
                <tr>
                  <th scope="col">Job No.</th>
                  <th scope="col">Client</th>
                  <th scope="col">Description</th>
                  <th scope="col">Due</th>
                </tr>
              </thead>
              <tbody>
                {workOrdersDatabase
                  .filter((order) => order.supplier_id === sampleSupplierId)
                  .slice(0, 15)
                  .map((order) => (
                  <tr key={order.jobNo}>
                    <td>{order.jobNo}</td>
                    <td>{order.client}</td>
                    <td>{order.description}</td>
                    <td>{order.due}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="home-data-table home-inventory-table">
              <caption>Inventory</caption>
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Make</th>
                  <th scope="col">Model</th>
                  <th scope="col">Category</th>
                </tr>
              </thead>
              <tbody>
                {inventoryDatabase.slice(0,15).map((item) => (
                  <tr key={`${item.name}-${item.model}`}>
                    <td>{item.name}</td>
                    <td>{item.make}</td>
                    <td>{item.model}</td>
                    <td>{item.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </article>
      </section>

      <AppFooter />
    </main>
  )
}

export default SupplierDashboard
