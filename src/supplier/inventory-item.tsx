import { useParams } from 'react-router'
import { AppFooter, SupplierHeader } from './supplier-header.tsx'
import { plumbingInventoryDatabase } from './plumbing-inventory-database.ts'

type InventoryKind = keyof typeof plumbingInventoryDatabase
type InventoryItem = (typeof plumbingInventoryDatabase)[InventoryKind][number]

type DetailRow = {
  label: string
  value: string
}

type MonthlyEmission = {
  month: string
  kilograms: number
}

const inventoryKindLabels: Record<InventoryKind, string> = {
  vehicles: 'Vehicle',
  equipment: 'Equipment',
  materials: 'Material',
  goods: 'Goods',
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const emissionShape = [0.06, 0.12, 0.08, 0.07, 0.08, 0.09, 0.13, 0.07, 0.06, 0.09, 0.07, 0.08]
const chartSize = {
  width: 760,
  height: 430,
  top: 42,
  right: 36,
  bottom: 70,
  left: 74,
}

function isInventoryKind(value: string | undefined): value is InventoryKind {
  return value === 'vehicles' || value === 'equipment' || value === 'materials' || value === 'goods'
}

function getField(item: InventoryItem, key: string) {
  return (item as Record<string, unknown>)[key]
}

function formatField(value: unknown) {
  if (value === undefined || value === null || value === '') {
    return ''
  }

  if (Array.isArray(value)) {
    return value.join(', ')
  }

  if (typeof value === 'number') {
    return value.toLocaleString(undefined, { maximumFractionDigits: 2 })
  }

  if (typeof value === 'object') {
    const factor = value as { value?: number; unit?: string }

    if (typeof factor.value === 'number' && factor.unit) {
      return factor.value.toLocaleString(undefined, { maximumFractionDigits: 2 }) + ' ' + factor.unit
    }
  }

  return String(value)
}

function makeDetailRow(item: InventoryItem, label: string, key: string, suffix = ''): DetailRow | null {
  const value = formatField(getField(item, key))

  if (!value) {
    return null
  }

  return {
    label,
    value: value + suffix,
  }
}

function getQuantityValue(item: InventoryItem) {
  const quantity = getField(item, 'quantity')
  const quantityOnHand = getField(item, 'quantityOnHand')
  const quantityUnit = getField(item, 'quantityUnit')

  if (typeof quantityOnHand === 'number' && typeof quantityUnit === 'string') {
    return quantityOnHand.toLocaleString() + ' ' + quantityUnit
  }

  if (typeof quantity === 'number') {
    return quantity.toLocaleString()
  }

  return ''
}

function getBannerParts(item: InventoryItem) {
  return [
    formatField(getField(item, 'make')) || formatField(getField(item, 'supplier')),
    formatField(getField(item, 'model')) || formatField(getField(item, 'gradeOrSpec')),
    formatField(getField(item, 'year')) || formatField(getField(item, 'energySource')),
    formatField(getField(item, 'category')),
  ].filter(Boolean)
}

function getDetailRows(item: InventoryItem, kind: InventoryKind): DetailRow[] {
  const quantity = getQuantityValue(item)
  const usage = formatField(getField(item, 'annualUsage'))
  const usageUnit = formatField(getField(item, 'usageUnit'))
  const activity = formatField(getField(item, 'emissionsActivityAmount'))
  const activityUnit = formatField(getField(item, 'emissionsActivityUnit'))
  const totalEmissions = Number(getField(item, 'calculatedEmissionsKgCo2e') ?? 0)

  return [
    { label: 'Inventory Type', value: inventoryKindLabels[kind] },
    makeDetailRow(item, kind === 'materials' || kind === 'goods' ? 'SKU' : 'Asset Tag', kind === 'materials' || kind === 'goods' ? 'sku' : 'assetTag'),
    makeDetailRow(item, 'Name', 'name'),
    makeDetailRow(item, 'Category', 'category'),
    makeDetailRow(item, 'Make', 'make'),
    makeDetailRow(item, 'Model', 'model'),
    makeDetailRow(item, 'Year', 'year'),
    makeDetailRow(item, 'Type', kind === 'vehicles' ? 'vehicleType' : kind === 'equipment' ? 'equipmentType' : kind === 'materials' ? 'materialType' : 'goodsType'),
    makeDetailRow(item, 'Fuel Type', 'fuelType'),
    makeDetailRow(item, 'Energy Source', 'energySource'),
    makeDetailRow(item, 'Supplier', 'supplier'),
    makeDetailRow(item, 'Location', 'location'),
    makeDetailRow(item, 'Storage Location', 'storageLocation'),
    quantity ? { label: 'Quantity', value: quantity } : null,
    makeDetailRow(item, 'Odometer', 'odometerKm', ' km'),
    makeDetailRow(item, 'Fuel Use', 'fuelUsePer100Km', ' L/100 km'),
    makeDetailRow(item, 'Fuel Use', 'fuelUsePerHour', ' L/hr'),
    makeDetailRow(item, 'Electricity Use', 'electricityUseKwhPerHour', ' kWh/hr'),
    makeDetailRow(item, 'Service Interval', 'serviceIntervalMonths', ' months'),
    usage ? { label: 'Annual Usage', value: usage + (usageUnit ? ' ' + usageUnit : '') } : null,
    activity ? { label: 'Emissions Activity', value: activity + (activityUnit ? ' ' + activityUnit : '') } : null,
    makeDetailRow(item, 'Emission Factor', 'emissionsFactor'),
    { label: 'Total Emissions', value: totalEmissions.toLocaleString(undefined, { maximumFractionDigits: 2 }) + ' kg CO2e' },
    makeDetailRow(item, 'Reduction Technology', 'reduction_factors'),
    makeDetailRow(item, 'Compliance', 'compliance'),
  ].filter((row): row is DetailRow => Boolean(row))
}

function makeMonthlyEmissions(totalKilograms: number): MonthlyEmission[] {
  const weightTotal = emissionShape.reduce((total, weight) => total + weight, 0)

  return months.map((month, index) => ({
    month,
    kilograms: Number(((totalKilograms * emissionShape[index]) / weightTotal).toFixed(2)),
  }))
}

function EmissionsLineChart({ data, itemName }: { data: MonthlyEmission[]; itemName: string }) {
  const chartWidth = chartSize.width - chartSize.left - chartSize.right
  const chartHeight = chartSize.height - chartSize.top - chartSize.bottom
  const highestValue = Math.max(...data.map((entry) => entry.kilograms), 1)
  const axisMax = Math.ceil(highestValue / 100) * 100
  const ticks = [0, axisMax * 0.25, axisMax * 0.5, axisMax * 0.75, axisMax]

  const points = data.map((entry, index) => {
    const x = chartSize.left + (chartWidth / (data.length - 1)) * index
    const y = chartSize.top + chartHeight - (entry.kilograms / axisMax) * chartHeight

    return { ...entry, x, y }
  })
  const pathPoints = points.map((point) => String(point.x) + ',' + String(point.y)).join(' ')

  return (
    <article className="inventory-item-card inventory-item-chart-card" aria-label="Generated emissions total">
      <div className="inventory-item-section-heading">
        <h2>Generated Emissions</h2>
        <span>Unit: kg CO2e</span>
      </div>

      <svg className="inventory-item-line-chart" viewBox={'0 0 ' + chartSize.width + ' ' + chartSize.height} role="img">
        <title>{itemName + ' generated emissions total by month'}</title>
        {ticks.map((tick) => {
          const y = chartSize.top + chartHeight - (tick / axisMax) * chartHeight

          return (
            <g key={tick}>
              <line className="inventory-item-chart-grid" x1={chartSize.left} x2={chartSize.width - chartSize.right} y1={y} y2={y} />
              <text className="inventory-item-chart-label" x={chartSize.left - 12} y={y + 5} textAnchor="end">
                {Math.round(tick).toLocaleString()}
              </text>
            </g>
          )
        })}

        {points.map((point) => (
          <line
            key={'month-grid-' + point.month}
            className="inventory-item-chart-grid"
            x1={point.x}
            x2={point.x}
            y1={chartSize.top}
            y2={chartSize.top + chartHeight}
          />
        ))}

        <line className="inventory-item-chart-axis" x1={chartSize.left} x2={chartSize.width - chartSize.right} y1={chartSize.top + chartHeight} y2={chartSize.top + chartHeight} />
        <line className="inventory-item-chart-axis" x1={chartSize.left} x2={chartSize.left} y1={chartSize.top} y2={chartSize.top + chartHeight} />
        <polyline className="inventory-item-chart-shadow" points={pathPoints} />
        <polyline className="inventory-item-chart-line" points={pathPoints} />

        {points.map((point) => (
          <g key={point.month}>
            <circle className="inventory-item-chart-point" cx={point.x} cy={point.y} r="4.5" />
            <text className="inventory-item-chart-label" x={point.x} y={chartSize.top + chartHeight + 28} textAnchor="middle">
              {point.month}
            </text>
          </g>
        ))}
      </svg>
    </article>
  )
}

function ItemPage() {
  const { activeInventoryKind, id } = useParams()
  const kind = isInventoryKind(activeInventoryKind) ? activeInventoryKind : undefined
  const item = kind ? plumbingInventoryDatabase[kind].find((entry) => entry.id === id) : undefined

  if (!kind || !item) {
    return (
      <main className="homepage inventory-item-page" aria-label="Inventory item not found">
        <SupplierHeader />
        <section className="inventory-item-shell">
          <article className="inventory-item-banner">
            <h1>Inventory Item Not Found</h1>
            <p>The selected inventory record could not be loaded.</p>
          </article>
        </section>
        <AppFooter />
      </main>
    )
  }

  const itemName = formatField(getField(item, 'name'))
  const bannerParts = getBannerParts(item)
  const detailRows = getDetailRows(item, kind)
  const totalEmissions = Number(getField(item, 'calculatedEmissionsKgCo2e') ?? 0)
  const monthlyEmissions = makeMonthlyEmissions(totalEmissions)

  return (
    <main className="homepage inventory-item-page" aria-label={itemName + ' inventory item'}>
      <SupplierHeader />

      <section className="inventory-item-shell">
        <article className="inventory-item-banner">
          <h1>{itemName.toUpperCase()}</h1>
          <p>{bannerParts.join(' | ')}</p>
        </article>

        <div className="inventory-item-layout">
          <aside className="inventory-item-card inventory-item-summary-card" aria-label="Inventory item information">
            <div className="inventory-item-media" aria-hidden="true" />

            <table className="inventory-item-info-table">
              <caption>{itemName + ' information'}</caption>
              <tbody>
                {detailRows.map((row) => (
                  <tr key={row.label + row.value}>
                    <th scope="row">{row.label}</th>
                    <td>{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </aside>

          <div className="inventory-item-main-column">
            <EmissionsLineChart data={monthlyEmissions} itemName={itemName} />
          </div>
        </div>
      </section>

      <AppFooter />
    </main>
  )
}

export default ItemPage
